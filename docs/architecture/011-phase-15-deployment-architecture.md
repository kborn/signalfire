# Deployment Architecture — Phase 15

**Date:** 2026-06-23
**Phase:** 15 — Deployment Infrastructure

---

## Context

The stack is a Turborepo monorepo with three runtime concerns: a Next.js public site (`apps/web`), a NestJS API (`apps/api`), and a PostgreSQL database. Admin authentication is cookie-backed sessions issued by the API and validated by Next.js middleware on every `/admin` request. The demo release is portfolio-scale — low traffic, low cost — but I want to choose a platform that can accommodate a planned event crawler and parser in Milestone 2 without a provider migration.

---

## Options Considered

### Option A — Vercel (web) + Railway (API + DB)

Vercel is the natural home for Next.js. ISR, edge middleware, and the deployment preview workflow are well-integrated. Railway handles the NestJS API and PostgreSQL as separate services.

**Pros:**

- Vercel's free tier is generous for Next.js; the CDN and preview URLs are well-polished.
- Both platforms are well-documented and have good DX.

**Cons:**

- Cookie-backed admin sessions become cross-origin. The Next.js frontend on `*.vercel.app` calling the API on `*.railway.app` requires explicit `SameSite=None; Secure` cookie configuration and CORS headers tuned to the deployed domain pair. This is solvable but it's configuration surface that doesn't exist in the local stack and will produce hard-to-debug auth failures in the deployed environment.
- Two providers means two sets of env vars, two dashboards, two billing relationships, and two places to look when something breaks.
- The Milestone 2 crawler belongs near the API and database, not on Vercel. So the split doesn't buy anything long-term — the interesting future services all land on Railway anyway.

**Verdict:** Rejected. The cookie auth complexity is real overhead for a portable demo that needs to stay maintainable.

---

### Option B — Railway (everything)

Railway runs the Next.js app, NestJS API, and PostgreSQL as three separate services inside one project. All services share private networking and can reference each other by service name. Cron jobs and background workers are first-class — adding a crawler in Milestone 2 is another service, not a new provider.

**Pros:**

- Cookie-backed sessions work cleanly. The web app and API can share a custom domain or communicate over Railway's private network; no cross-origin friction.
- One project, one dashboard, one set of env var secrets.
- Monorepo support is straightforward: each service points at its subdirectory with a start command.
- Migrations fit naturally: `prisma migrate deploy` runs as a release command on the API service before the new version starts accepting traffic.
- The Milestone 2 crawler is another Railway service in the same project — private networking to the API and DB is already there.
- Cost at demo scale is minimal (~$5–10/month).

**Cons:**

- Less name recognition than Vercel or AWS. Not a portfolio signal by provider name.
- Railway's Next.js support is functional but not as purpose-built as Vercel's. ISR and advanced caching primitives require more manual configuration.

**Verdict:** Selected. The auth boundary stays simple, the future worker story is native, and the cost and operational surface are appropriate for the release.

---

### Option C — AWS

I know AWS well enough that the configuration wouldn't be unfamiliar. App Runner or ECS Fargate for the API, Amplify or S3+CloudFront for the web app, RDS for PostgreSQL.

**Cons:**

- Overkill for a portfolio demo. The IAM surface, VPC configuration, and per-service provisioning represent significant setup cost for a release that serves a handful of reviewers.
- Cost at low traffic is higher relative to Railway/Render due to minimum instance sizing on RDS and container services.
- Nothing in the current stack or Milestone 2 plan requires AWS-specific services. SQS and Lambda are not more appropriate for a crawler than Railway workers; they're just more familiar.

**Verdict:** Rejected for this release. Would revisit if the Milestone 2 crawler has volume or latency requirements that Railway can't meet.

---

## Decision

**Railway, all services in one project.**

Three Railway services: `web` (Next.js), `api` (NestJS), `db` (Railway-managed PostgreSQL). Migrations run as a release command on the API service. Admin session cookies are configured for the custom domain shared by web and API. Milestone 2 crawler slots in as a fourth service with private access to the existing API and database.

---

## Service Topology

```
Railway Project: signal-fire
├── web          (Next.js — apps/web)
├── api          (NestJS  — apps/api)
├── db           (PostgreSQL — Railway managed)
└── [future] crawler   (Milestone 2 — worker service)
```

Private networking between services is available by default within a Railway project. The API and DB communicate over the private network. The web app calls the API over the public URL (or private network if kept on the same Railway domain).

---

## Migration Strategy

`prisma migrate deploy` runs as a Railway release command on the `api` service, executed after the new image builds but before traffic switches to the new version. This ensures the schema is always at the correct version for the running API code. The release command will be:

```
cd apps/api && pnpm exec prisma migrate deploy
```

A failed migration aborts the deploy and Railway keeps the previous version running.

---

## Admin Auth Boundary

The admin interface (`/admin/*`) is protected by Next.js middleware that validates a session cookie against the API's `/admin/auth/session` endpoint. In the deployed environment:

- Session cookies are issued by the API with `Secure`, `HttpOnly`, and `SameSite=Lax`.
- `SameSite=Lax` works when the web app and API share a root domain (e.g., `app.findmyfight.com` and `api.findmyfight.com`). If they are on separate Railway subdomains, `SameSite=None; Secure` is required and the API must set `credentials: include` on CORS responses for admin routes.
- The simpler path is a shared custom domain. This is the target configuration.
