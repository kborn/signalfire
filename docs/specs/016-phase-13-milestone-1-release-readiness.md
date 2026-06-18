# Phase 13 Milestone 1 Release Readiness

## Purpose

Record the concrete Milestone 1 launch-readiness decisions that belong to Phase
13.4 so the release-prep pass stays finite and reviewable.

This document is canonical for:

- Release 1 logging scope
- Milestone 1 release checklist
- explicit non-goals and deferred concerns
- admin-access boundary history
- repository/docs/screenshot verification expectations

## Release 1 Logging Approach

Release 1 does **not** introduce a full observability platform. The goal is a
small, intentional logging baseline that helps local debugging, launch review,
and early deployment triage without adding infrastructure scope in Phase 13.

### What should be logged

API and admin logging should cover:

- application start with runtime mode and bound port
- unhandled server errors with route/method context when available
- admin auth outcomes:
  - login success
  - login failure
  - logout
  - unauthorized admin-session checks
- moderation review outcomes:
  - submission id
  - review decision
  - resulting moderation status
  - created-record summary when approval publishes or drafts a record
- admin create/update actions for Articles, Actions, and Events
- deployment-relevant operational steps when run manually:
  - migration execution
  - baseline seed run
  - demo seed run

### What should not be logged

Do not log:

- raw passwords
- session tokens or cookie values
- full request bodies for public submissions
- submitter email addresses in success-path informational logs
- moderation-only private notes unless required for local debugging

### Format and implementation boundary

- Nest's built-in logging surface is sufficient for Milestone 1.
- Plain structured text or key-value logging is acceptable.
- Centralized log shipping, metrics pipelines, distributed tracing, dashboards,
  and alerting are deferred to Phase 14+.

## Milestone 1 Release Checklist

Use this checklist before calling Milestone 1 code-complete for release/demo
handoff.

### 1. Environment and data reset

Run:

```bash
docker-compose up -d
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.local.example apps/web/.env.local
pnpm api:prisma:migrate:dev
pnpm api:prisma:migrate:seed
pnpm api:prisma:migrate:seed:demo
```

Enable demo-mode chrome when reviewer-facing screenshots or public-demo review
are intended:

```bash
NEXT_PUBLIC_ENABLE_DEMO_MODE=true
```

### 2. Required validation commands

Run:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm --filter web test
pnpm --filter api test:unit
```

When a container runtime is available, also run:

```bash
pnpm --filter api test:integration
pnpm --filter api test:e2e
```

### 3. Final smoke paths

Public:

- `/`
- `/about`
- `/topics`
- one topic detail route
- one article detail route
- one action detail route
- `/events` with filter interaction
- `/events/[id]`
- `/submit`
- `/submit/article`
- `/submit/event`

Admin:

- `/admin/login`
- `/admin`
- `/admin/submissions`
- one pending submission review
- one approved submission review
- `/admin/articles`
- `/admin/actions`
- `/admin/events`

### 4. Screenshot refresh

Reviewer-facing screenshots live in `docs/screenshots/`.

Refresh them with:

```bash
node scripts/regenerate-doc-screenshots.mjs
```

Expected prerequisites:

- local web app running on `http://localhost:3000` unless `SCREENSHOT_BASE_URL`
  overrides it
- seeded demo credentials available

### 5. Docs verification

Before handoff, verify:

- `README.md` quick-start steps still work
- demo/admin credentials guidance matches seeded behavior
- screenshot filenames referenced in docs still exist
- deployment caveats still match the current admin boundary
- active-phase status in `docs/agent-governance/progress.md` remains accurate

### 6. Deployment handoff prerequisites

Phase 13 handoff into Phase 14 requires:

- stable schema and migration history
- explicit admin-auth deployment boundary
- known deferred infrastructure concerns recorded
- validation commands and smoke paths documented

## Milestone 1 Non-Goals And Deferreds

These items are intentionally deferred and should not be reopened during final
polish unless a blocker appears:

- centralized observability platform
- production alerting/on-call workflows
- public user accounts
- social/discussion features
- topic CRUD beyond the seeded Release 1 scope
- event-ingestion automation or crawlers
- geo-intelligence beyond the bounded demo finder
- production-grade deployment automation and repository protection rules

## Admin Access Boundary History

### Local-only assumption history

Earlier implementation phases allowed admin and moderation routes to remain
openly reachable during local-only development to keep implementation drag low.
That was acceptable only because the application was not yet deployed for real
users.

### Current boundary

As of the Phase 11.9 auth implementation, the deployed admin boundary is:

- database-backed `AdminSession` records
- cookie-backed admin auth
- API-side auth guard validation
- Next middleware checks for `/admin` requests and redirect-to-login behavior

### Remaining deferred concerns

Still deferred to deployment infrastructure hardening:

- HTTPS-only deployment verification for secure cookie transport
- environment-specific secret management and rotation
- hosting-specific ingress/proxy behavior review
- CI-backed migration and e2e execution in a deployed-like environment

## Repository And Screenshot Verification Status

As of **June 17, 2026**, the repository review surface was checked against the
current shipped product state in these areas:

- README quick start, demo access guidance, and deployment caveats
- screenshot inventory under `docs/screenshots/`
- screenshot regeneration script targets
- current Phase 13.4 source-review fixes and validation commands

Remaining launch-readiness work after this doc:

- broader moderation/admin integration or smoke coverage in an environment with
  a working container runtime
- a final focused regression pass across public and admin flows
