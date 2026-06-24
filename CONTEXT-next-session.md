# Context for Next Agent Session — Phase 15.5: Mobile Pass

## State of the repo

**Branch:** `feat/phase_15/observability` (not yet pushed or merged)

**Phase 15.4 status:** ✅ Complete — HTTP request logging and bootstrap logger added.

**Phase 15.5 status:** ⏳ Up next — mobile issues found on live site.

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

---

## Phase 15.5 — Mobile Pass

Issues were found by the human reviewer on the live site at real mobile viewport. The specific
list of issues should be provided at session start by the human — check this context file or
ask the user directly if no issue list is present.

**When starting Phase 15.5:**

1. Ask the user for the specific mobile issues they found if not already documented here
2. Add them as explicit tasks in the Phase 15.5 section of `docs/agent-governance/progress.md`
3. Fix, verify at mobile viewport, confirm no desktop regressions, commit

---

## What was done in this session (observability + docs)

- `HttpLoggingInterceptor` — globally registered in `apps/api/src/main.ts`, logs per-request traffic
- `Logger('Bootstrap')` — bootstrap startup and fatal error logging in `main.ts`
- `decisions.md` — new "Observability strategy for Milestone 1" entry with log format reference and where-to-look table
- `docs/runbooks/ops.md` — new ops runbook covering local dev, build, Railway deploy, log access, DB ops, admin access, health checks
- `progress.md` — Phase 15.4 ✅, Phase 15.5 added, Phase 16 remains ⏳

---

## Locked decisions carried forward

All prior locked decisions remain in force. See `docs/agent-governance/decisions.md`.
Ops runbook: `docs/runbooks/ops.md`.
