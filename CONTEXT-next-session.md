# Context for Next Agent Session — Phase 15: Deployment Infrastructure

## State of the repo

**Branch:** `feat/phase_15/deployment_configuration` (pushed, not merged)

**Phase 15 status:** 🚧 Active — 15.1, 15.2, 15.3 complete. 15.4 (Observability) is next.

---

## Deployed environment

**Platform:** Railway — single project, production environment configured as demo deployment

| Service         | URL                                           |
| --------------- | --------------------------------------------- |
| Web (Next.js)   | `https://web-production-75507.up.railway.app` |
| API (NestJS)    | `https://api-production-8544.up.railway.app`  |
| DB (PostgreSQL) | Railway-managed, internal only                |

**Admin credentials:** `admin@example.com` / `FindYourFight1`

**Demo seed:** Applied — topics, articles, actions, events, admin user all present.

---

## Locked hosting decision

Railway, all services in one project. Full rationale in `docs/architecture/011-phase-15-deployment-architecture.md`.

---

## Known open items from 15.3

- `NEXT_PUBLIC_API_BASE_URL` needs to be added as a GitHub Actions CI secret (`https://api-production-8544.up.railway.app`) so the `build` CI job passes. Currently the build job fails in CI because it tries to fetch topics at build time with no API available.
- Railway start command on API: `cd apps/api && pnpm exec prisma migrate deploy && node dist/main` — migrations run automatically on every deploy.
- Cross-domain cookie fix landed: admin login/logout proxy through `/api/admin/auth/*` Next.js routes. Session cookie is scoped to web domain. No custom domain required for this to work.

---

## What's next: Phase 15.4 — Observability

Tasks:

- Enable lightweight traffic visibility through Railway platform logs or minimal request logging on public routes
- Confirm error logging is sufficient to diagnose production incidents

This is a lightweight phase — Railway already provides request logs per service. The main question is whether anything additional is needed at the application level.

---

## Locked decisions carried forward

All prior locked decisions remain in force. See `docs/agent-governance/decisions.md` for the full list.
