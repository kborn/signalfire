# Context for Next Agent Session — Phase 15: Deployment Infrastructure

## State of the repo

**Branch:** `feat/phase_15/deployment_configuration` (pushed, not merged)

**Phase 15 status:** 🚧 Active — 15.1, 15.2, 15.3 complete. Browser e2e fix applied (see below). 15.4 (Observability) is next.

---

## Browser e2e CI fix — applied, needs CI verification

The `connection()` workaround on `/issues/page.tsx` has been removed and `revalidate = 3600` restored. The page now matches the pattern used by the home page and submit pages (`revalidate = 3600` + `.catch(() => null)`).

**What was done:**

- Removed `await connection()` and its import from `/issues/page.tsx`
- Restored `export const revalidate = 3600`
- The `.catch(() => null)` guard added in an earlier commit was kept

**What was NOT the root cause (correcting the prior context):**

The previous session's note said "the harness runs `prisma migrate deploy` but not the seed script" — this was incorrect. `globalSetup.js` has had the seed step since Phase 4.1:

```js
execSync('pnpm prisma:migrate:seed', { env: { ...process.env, SEED_MODE: 'baseline' } });
```

Topics have always been seeded. The actual root cause was the missing `.catch()` guard on
the issues page, which caused the ISR pre-render to fail when the fetch threw. Once `.catch()`
was added, `connection()` was no longer needed — it just wasn't removed promptly.

**CI verification still needed:**

The e2e tests require a container runtime (Testcontainers/Docker) to run. They cannot be
verified locally in this session. Push the branch and watch the `e2e-test` CI job to confirm
`submission.browser.e2e-spec.ts` passes. If it still fails, the cause is something in
Next.js 16 ISR behavior rather than data availability — and `connection()` should be
restored as a pragmatic workaround.

**ISR rendering audit complete:**

All public ISR pages consistently use `revalidate = 3600` + error handling. No changes
were needed beyond the issues page fix.

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

## What's next: Phase 15.4 — Observability

Tasks:

- Enable lightweight traffic visibility through Railway platform logs or minimal request logging
- Confirm error logging is sufficient to diagnose production incidents

This is a lightweight phase — Railway already provides per-service request logs.

---

## Locked decisions carried forward

All prior locked decisions remain in force. See `docs/agent-governance/decisions.md`.
