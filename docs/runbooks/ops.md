# Operations Runbook — Find Your Fight

Practical reference for building, running, deploying, and observing the application.
Not a tutorial — assumes familiarity with the stack.

---

## Table of contents

- [Environments](#environments)
- [Local development](#local-development)
- [Building](#building)
- [Deployment — Railway](#deployment--railway)
- [Resource limits](#resource-limits)
- [Observability — reading logs](#observability--reading-logs)
- [Database operations](#database-operations)
- [Admin access](#admin-access)
- [Health checks](#health-checks)

---

## Environments

| Environment | Web                                           | API                                          | Notes                        |
| ----------- | --------------------------------------------- | -------------------------------------------- | ---------------------------- |
| Local       | `http://localhost:3000`                       | `http://localhost:3001`                      | Docker Compose for DB        |
| Production  | `https://demo.findmyfight.com`                | `https://api-production-8544.up.railway.app` | Railway, single project      |
| Production  | `https://web-production-75507.up.railway.app` | (same as above)                              | Railway internal URL for web |

---

## Local development

### Prerequisites

- Node.js 20+, pnpm 9+
- Docker (for local PostgreSQL via Compose)

### Start everything

```bash
# Start the database
docker compose up -d

# Install dependencies (first time or after lockfile changes)
pnpm install

# Run migrations and seed
pnpm prisma:migrate:seed

# Start both apps with hot reload
pnpm dev
```

### Useful commands

```bash
pnpm typecheck          # typecheck all packages
pnpm lint               # lint all packages
pnpm test               # unit + controller tests (no container required)
pnpm build              # production build for all packages

# API only
pnpm --filter api test
pnpm --filter api typecheck

# Web only
pnpm --filter web typecheck
pnpm --filter web build
```

### Environment files

- `apps/api/.env.local` — API runtime config (DATABASE_URL, SESSION_SECRET, WEB_ORIGINS, PORT)
- `apps/web/.env.local` — Web runtime config (NEXT_PUBLIC_API_BASE_URL, API_BASE_URL)
- `.env.example` files exist at each app root as the canonical variable contract

---

## Building

### Production build

```bash
pnpm build
```

Runs `turbo run build` across all packages. Each app compiles independently:

- **API**: `nest build` → `apps/api/dist/main.js`
- **Web**: `next build` → `.next/` directory

### Start production build locally

```bash
# API
node apps/api/dist/main.js

# Web
pnpm --filter web start
```

---

## Deployment — Railway

### Platform

All three services — `web` (Next.js), `api` (NestJS), `db` (PostgreSQL) — live in a single Railway project.

**Dashboard:** https://railway.app — log in, select the `signal-fire` project.

### How deploys work

Railway watches the `main` branch. On merge:

1. Railway detects the push and triggers a new build for each connected service.
2. **API build**: `pnpm --filter api build` → produces `apps/api/dist/`
3. **API start command**: `cd apps/api && pnpm exec prisma migrate deploy && node dist/main`
   - Migrations run before the new process starts accepting traffic.
4. **Web build**: `pnpm --filter web build`
5. **Web start command**: `pnpm --filter web start`

### Environment variables

Managed in the Railway dashboard under each service's **Variables** tab.

| Variable                   | Service | Description                                            |
| -------------------------- | ------- | ------------------------------------------------------ |
| `DATABASE_URL`             | API     | PostgreSQL connection string (Railway-injected)        |
| `SESSION_SECRET`           | API     | Cookie signing secret — must be set, never committed   |
| `WEB_ORIGINS`              | API     | Comma-separated allowed CORS origins (web service URL) |
| `PORT`                     | API     | Set by Railway automatically                           |
| `NEXT_PUBLIC_API_BASE_URL` | Web     | Public API URL, used in browser-side fetches           |
| `API_BASE_URL`             | Web     | Internal API URL, used in server-side fetches          |

`NEXT_PUBLIC_API_BASE_URL` is also a GitHub Actions secret for CI builds.

### Triggering a manual deploy

Railway auto-deploys on push to `main`. To force a redeploy without a new commit:
Railway dashboard → service → **Deploy** → **Redeploy**.

### Rolling back

Railway dashboard → service → **Deployments** tab → select a prior deploy → **Rollback**.

---

## Resource limits and service configuration

Some Railway settings can be committed to `railway.toml`; others are dashboard-only. Both are
documented here so changes to dashboard settings have a paper trail — update this section when
any dashboard value changes.

### What's in railway.toml (version-controlled)

Each service has a `railway.toml` at its app root. Railway reads it automatically when the
service root directory is set to `apps/api` or `apps/web`.

| Setting              | `apps/api/railway.toml`                                            | `apps/web/railway.toml`   |
| -------------------- | ------------------------------------------------------------------ | ------------------------- |
| Start command        | `cd apps/api && pnpm exec prisma migrate deploy && node dist/main` | `pnpm --filter web start` |
| Healthcheck path     | `/health/ready` (DB connectivity check)                            | `/`                       |
| Healthcheck timeout  | 30s                                                                | 30s                       |
| Restart policy       | `ON_FAILURE`                                                       | `ON_FAILURE`              |
| Max restart attempts | 3                                                                  | 3                         |
| Replicas per region  | 1                                                                  | 1                         |

Railway gates traffic on the healthcheck — the old deployment keeps serving until the new one
passes, preventing downtime during deploys.

### Dashboard-only settings (not version-controllable)

These settings cannot be expressed in `railway.toml`. They are documented here so they are
visible and reviewable. Update this table whenever a value is changed in the dashboard.

**`web` service** (Railway dashboard → `web` → Settings)

| Setting                           | Value                                      | Reason                                                                                                                                              |
| --------------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Wait for CI                       | **On**                                     | Prevents deploying a build that failed lint/typecheck/tests                                                                                         |
| Custom domain                     | `demo.findmyfight.com`                     | Already configured via GoDaddy CNAME                                                                                                                |
| Outbound IPv6                     | **Off**                                    | No IPv6 requirement for this app                                                                                                                    |
| CDN caching                       | **Off**                                    | Next.js ISR manages its own cache headers; an additional CDN layer creates invalidation ambiguity                                                   |
| Max memory per replica            | **512 MB**                                 | Bounds cost and surfaces memory leaks early                                                                                                         |
| Max CPU per replica               | **No limit**                               | Usage-based billing handles low traffic; revisit if Metrics tab shows spikes                                                                        |
| Teardown (old deploy termination) | **Enabled** — overlap 30s, draining 3s     | 30s overlap gives the new container time to pass its healthcheck before the old one stops; 3s draining is enough for fast SSR responses to complete |
| Serverless (scale to zero)        | **Off**                                    | Cold-start queuing would delay the first request — bad for a recruiter demo                                                                         |
| Railway config file               | Auto-resolved from service root `apps/web` | Picks up `apps/web/railway.toml` automatically                                                                                                      |

**`api` service** (Railway dashboard → `api` → Settings)

| Setting                           | Value                                      | Reason                                                                         |
| --------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------ |
| Wait for CI                       | **On**                                     | Same as web                                                                    |
| Outbound IPv6                     | **Off**                                    | No IPv6 requirement                                                            |
| CDN caching                       | **Off**                                    | API responses are not static; caching would return stale data                  |
| Max memory per replica            | **512 MB**                                 | Same rationale as web                                                          |
| Max CPU per replica               | **No limit**                               | Same rationale as web                                                          |
| Teardown (old deploy termination) | **Enabled** — overlap 30s, draining 3s     | Same values as web; in-flight API requests complete before old container stops |
| Serverless (scale to zero)        | **Off**                                    | Admin and public API must respond immediately                                  |
| Railway config file               | Auto-resolved from service root `apps/api` | Picks up `apps/api/railway.toml` automatically                                 |

**`db` service** (Railway dashboard → `db` → Settings)

| Setting   | Value    | Reason                                                                 |
| --------- | -------- | ---------------------------------------------------------------------- |
| Disk size | **1 GB** | Sufficient for demo data volume; adjust if content grows significantly |

### Verifying current usage

Railway dashboard → service → **Metrics** tab — shows real CPU and memory usage over time.
If a service consistently uses >80% of its memory limit, raise the limit before OOM crashes start.

---

## Observability — reading logs

### Railway log viewer

Railway dashboard → select a service → **Logs** tab.

Logs stream in real time. Use the filter bar to search by text.

### What each service logs

**API service (stdout/stderr):**

```
# Bootstrap
[Nest] 1  - INFO  [NestFactory] Starting Nest application...
[Nest] 1  - INFO  [Bootstrap] API listening on port 3001

# Per-request (HttpLoggingInterceptor)
[Nest] 1  - LOG   [HTTP] GET /topics 200 12ms
[Nest] 1  - LOG   [HTTP] POST /admin/login 401 5ms

# Errors (NestJS built-in exception filter)
[Nest] 1  - ERROR [ExceptionsHandler] Something went wrong
```

**Web service (stderr from Next.js):**

Next.js writes server-side render errors and unhandled exceptions directly to stderr. These appear in the web service log stream. There is no request-level log for the web service — Railway's platform-level access logs are not currently enabled.

### Diagnosing common problems

| Symptom                       | Where to look                                                             |
| ----------------------------- | ------------------------------------------------------------------------- |
| API returning unexpected 5xx  | API logs — search for the route path and look at surrounding error lines  |
| API not starting after deploy | API logs — look for `[Bootstrap]` lines; migration errors appear here too |
| Prisma migration failure      | API logs — `prisma migrate deploy` output precedes the startup log        |
| Public page blank or broken   | Web logs — Next.js SSR errors appear on the web service log stream        |
| Admin login not working       | API logs — auth guard rejections log at `WARN` level                      |
| Service restart loop          | Railway project → **Activity** — crash signals appear here                |

### Log retention

Railway retains logs for the current deployment. Older logs may not be available after a rollback or redeploy. If you need persistent log history, consider shipping logs to an external sink (out of scope for Milestone 1).

---

## Database operations

### Connecting to the production database

Railway dashboard → `db` service → **Connect** tab → copy the connection string.

Use a GUI client (e.g., TablePlus, psql) with the provided credentials.

### Running migrations in production

Migrations run automatically as part of the API start command:

```
cd apps/api && pnpm exec prisma migrate deploy && node dist/main
```

Do not run `prisma migrate dev` or `prisma db push` against the production database. Use `prisma migrate deploy` only.

### Creating a new migration locally

```bash
pnpm --filter api prisma migrate dev --name <description>
```

This generates a new migration file under `apps/api/prisma/migrations/`. The migration runs automatically on the next API deploy to production.

### Seeding

```bash
# Local: apply migrations and seed baseline data
pnpm prisma:migrate:seed

# Seed only (skips migration)
SEED_MODE=baseline pnpm --filter api prisma db seed
```

The seed is not run automatically in production. Demo data was applied manually after the initial deployment.

---

## Admin access

### Production credentials

| Field    | Value                                |
| -------- | ------------------------------------ |
| URL      | `https://demo.findmyfight.com/admin` |
| Email    | `admin@example.com`                  |
| Password | `FindYourFight1`                     |

These are demo credentials. Do not use in any environment with real user data.

### Admin user provisioning

There is no admin signup UI. New admin users are provisioned directly in the database:

```bash
# Connect to the database and insert a hashed-password admin user
# See apps/api/src/admin-api/auth/ for the password hashing approach
```

See `docs/agent-governance/decisions.md` → "Admin user model for Release 1" for the full rationale.

### Session behavior

Admin sessions are cookie-backed. Sessions expire after inactivity. On expiry, the next admin request redirects to `/admin/login` with an informative message. See `docs/runbooks/admin-auth-posture.md` for CSRF posture details.

---

## Health checks

### API health endpoints

```
GET /health/live    → 200 if the process is running
GET /health/ready   → 200 if the database is reachable; 503 if not
```

Railway uses these to determine service health. Both endpoints are unauthenticated.

### Verifying a deploy

After merging to `main` and Railway completing the deploy:

1. Check `GET https://api-production-8544.up.railway.app/health/ready` → should return `200`
2. Load `https://demo.findmyfight.com` → homepage should render
3. Load `https://demo.findmyfight.com/admin` → should redirect to login
4. Check Railway API logs for `[Bootstrap] API listening on port ...` confirming clean startup
