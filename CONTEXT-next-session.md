# Context for Next Agent Session — Phase 15: Deployment Infrastructure

## State of the repo

**Branch:** `main` (clean)

**Phase 15 status:** 🚧 Active — Phase 15.1 complete, Phase 15.2 next.

---

## Locked hosting decision (do not relitigate)

**Platform: Railway — all services in one project.**

Three Railway services: `web` (Next.js / `apps/web`), `api` (NestJS / `apps/api`), `db` (Railway-managed PostgreSQL).

- Migrations run as a release command on the `api` service: `cd apps/api && pnpm exec prisma migrate deploy`
- Admin session cookies require a shared custom domain between web and API to avoid `SameSite` cross-origin complexity
- Milestone 2 crawler is a fourth Railway service in the same project — no provider migration needed

Full rationale in `docs/architecture/011-phase-15-deployment-architecture.md`.

---

## What's next: Phase 15.2 — CI & Repository Governance

Tasks:

- Confirm CI suite covers required gates for `main`: lint, typecheck, unit, integration where possible
- Add Dependabot for automated dependency update PRs
- Add dependency vulnerability validation in CI (`pnpm audit --prod`)
- Define and apply branch protection rules for `main`
- Decide on `CODEOWNERS`

Phase 15.2 is independent of the Railway setup — it's all repository and GitHub configuration.

---

## Phase 15.3 and 15.4 (upcoming)

- **15.3** — Deployment configuration: env vars, secrets, Railway service wiring, staging deploy validation
- **15.4** — Observability: lightweight traffic visibility via platform logs or minimal request logging

---

## Product state

Phase 14 is complete and on `main`. The public product is at 8/10. See prior `CONTEXT-next-session.md` content in git history for the full surface-by-surface breakdown — it remains accurate.

---

## Locked decisions carried forward

All Phase 14 locked decisions remain in force. See `docs/agent-governance/decisions.md` for the full list. Visual palette, typography, motif placement, demo banner position, journey strip, and homepage issue roll treatment are all locked.
