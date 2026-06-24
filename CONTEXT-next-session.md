# Context for Next Agent Session — Phase 16: Public Launch

## State of the repo

**Branch:** `feat/phase_15/observability` (not yet pushed or merged)

**Phase 15 status:** ✅ Complete — all subphases done.

**Phase 16 status:** ⏳ Up next.

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

## Phase 15 observability — what was added

`HttpLoggingInterceptor` in `apps/api/src/common/http-logging.interceptor.ts` is registered globally.
Logs `[METHOD] /path STATUS Xms` per request to stdout; Railway service logs surface this as traffic visibility.
NestJS built-in logger handles bootstrap and framework-level error output.
Next.js writes server-side errors to stderr automatically.

---

## What's next: Phase 16 — Public Launch

See `docs/agent-governance/progress.md` Phase 16 definition of done:

- Launch a public demo instance appropriate for portfolio and recruiter review
- Verify deployment health, runtime config, and migration state in the live environment after launch
- Verify deployed public site and repository provide distinct but complementary entry points
- Confirm the live demo experience provides a clear path into the admin workflow with demo credentials
- Ensure the demo dataset is broad and intentional enough to showcase the system credibly

**Key decision for Phase 16:** The app is already deployed at `https://demo.findmyfight.com` via Railway.
Phase 16 is about verifying the live environment, confirming the demo is portfolio-ready, and any
final documentation/README updates to guide recruiters and reviewers.

---

## Locked decisions carried forward

All prior locked decisions remain in force. See `docs/agent-governance/decisions.md`.
