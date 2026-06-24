# Context for Next Agent Session — Phase 15: Deployment Infrastructure

## State of the repo

**Branch:** `feat/phase_15/deployment_configuration` (pushed, not merged)

**Phase 15 status:** 🚧 Active — 15.1, 15.2, 15.3 complete. 15.4 (Observability) is next.

---

## Immediate task before anything else: fix the browser e2e CI failure properly

**Do not start 15.4 until this is resolved.**

The current branch has a workaround (`connection()` added to `/issues/page.tsx`) that fixes a CI
failure symptomatically but incorrectly. Read this section fully before touching any code.

### What's failing

`test/submission/submission.browser.e2e-spec.ts` fails in CI because the e2e harness builds the
Next.js app (`next build`) before starting the Playwright tests. The `/issues` page has
`export const revalidate = 3600` which makes Next.js try to pre-render it at build time. That
pre-render makes an HTTP request to the local test API at `http://127.0.0.1:PORT/topics`. The
test API is running at that point, but the test database has no topics (migrations applied, no
seed), so something in the ISR pre-render fails — the exact mechanism wasn't determined.

### What's been tried (do not retry these)

- Adding `.catch(() => null)` to `getTopicsList()` in the issues page — did not fix it
- Adding `NODE_ENV: 'production'` to the harness build env — did not fix it
- Adding `connection()` back to the issues page — this WORKS but is a workaround

### The correct fix

Seed the baseline topics in the e2e test harness setup. The harness runs `prisma migrate deploy`
but not the seed script. Adding a baseline seed (topics only) to the global setup means:

1. The test DB has topics when `next build` runs
2. ISR pre-render fetches `/topics`, gets real data, renders correctly
3. `connection()` is not needed as a workaround
4. The Playwright assertion `getByLabel('Climate')` is also validated against real seeded data
   (without the seed, this assertion would silently fail if topics were ever missing)

**The fix should:**

1. Remove `connection()` and restore `export const revalidate = 3600` on `/issues/page.tsx`
   (or whatever the correct ISR value is — check `docs/agent-governance/decisions.md` and
   prior review notes; `connection()` was flagged in a previous review as incorrect here)
2. Add baseline topic seeding to the e2e global setup
   (`apps/api/test/intg-config/globalSetup.js` or equivalent)
3. Verify the browser e2e tests pass in CI

Also worth doing in the same pass: audit all public pages for ISR vs dynamic rendering consistency.
The current state is somewhat arbitrary — some pages have `revalidate`, some use `connection()`,
some are dynamic because they use server-only APIs. The strategy should be intentional and
documented, not incidental.

Relevant files:

- `apps/api/test/harness/browser-e2e.harness.ts` — the harness that runs the build
- `apps/api/test/intg-config/globalSetup.js` — global setup that provisions the test DB
- `apps/web/src/app/(public)/issues/page.tsx` — the page with the workaround
- `apps/api/prisma/seed.ts` — contains `seedTopics()` function, extract for reuse in test setup

---

## Deployed environment

**Platform:** Railway — single project, production environment configured as demo deployment

| Service         | URL                                           |
| --------------- | --------------------------------------------- |
| Web (Next.js)   | `https://web-production-75507.up.railway.app` |
| API (NestJS)    | `https://api-production-8544.up.railway.app`  |
| DB (PostgreSQL) | Railway-managed, internal only                |
| Custom domain   | `https://demo.findmyfight.com` → web service  |

**Admin credentials:** `admin@example.com` / `FindYourFight1`

**Demo seed:** Applied — topics, articles, actions, events, admin user all present.

---

## Locked hosting decision

Railway, all services in one project. Full rationale in `docs/architecture/011-phase-15-deployment-architecture.md`.

---

## Deployment notes from 15.3

- Railway start command on API: `cd apps/api && pnpm exec prisma migrate deploy && node dist/main`
- Cross-domain cookie fix: admin login/logout proxy through `/api/admin/auth/*` Next.js routes
- `NEXT_PUBLIC_API_BASE_URL` wired as GitHub Actions CI secret for the `build` job
- `demo.findmyfight.com` → Railway web service via GoDaddy CNAME + TXT verification record

---

## What's next after the e2e fix: Phase 15.4 — Observability

Tasks:

- Enable lightweight traffic visibility through Railway platform logs or minimal request logging
- Confirm error logging is sufficient to diagnose production incidents

This is a lightweight phase — Railway already provides per-service request logs.

---

## Locked decisions carried forward

All prior locked decisions remain in force. See `docs/agent-governance/decisions.md`.
