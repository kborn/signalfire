# SignalFire (Product: Find Your Fight)

SignalFire is a full-stack civic action platform. The public product identity is
**Find Your Fight**.

The product helps people move from issue understanding to concrete civic
participation through Topics, Articles, Actions, and Events.

## Why This Repo Matters

This repository demonstrates:

- full-stack product implementation across UI, API, and database layers
- civic content discovery with cross-linked public resources
- community submission workflows with moderation and publication mapping
- phased delivery with explicit architecture and decisions documentation
- test coverage across frontend behavior, backend logic, and contracts

## Feature Scope (Release 1)

Implemented:

- public discovery through Topics, Articles, Actions, and Events
- article and event submission flows
- moderation queue and review actions for submissions
- editorial normalization before approval
- publication mapping from approved submissions into public records
- demo seed content for portfolio screenshots and review

Not included yet:

- public user accounts
- social feed/comment features
- production deployment hardening
- deployed admin authentication/authorization
- topic CRUD beyond seeded Release 1 topics

## Architecture

pnpm monorepo:

- `apps/web`: Next.js App Router frontend
- `apps/api`: NestJS backend API
- `packages/api-contracts`: shared request/response contracts
- `docs/specs`: product and feature specs
- `docs/architecture`: architecture notes and implementation contracts
- `docs/agent-governance`: roadmap, decisions, and AI collaboration rules
- `docs/learnings`: implementation guides and walkthroughs

Public routes use server-rendered fetching for initial content. Browser-side API
calls handle post-load actions such as submissions and moderation actions.

## Quick Reviewer Path (10-15 min)

1. Start locally with demo seed data (commands below).
2. Review public discovery pages (`/topics`, `/articles`, `/actions`, `/events`).
3. Review contribution flow (`/submit/article`, `/submit/event`).
4. Review moderation/admin flow (`/admin/submissions`).

Recommended screenshot flow:

- `docs/runbooks/phase-11-6-demo-content-screenshot-flow.md`

## Local Setup

Requirements:

- Node.js compatible with repo toolchain
- pnpm `10.30.3`
- Docker or local PostgreSQL

Install dependencies:

```bash
pnpm install
```

Start PostgreSQL:

```bash
docker-compose up -d
```

Set environment files:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.local.example apps/web/.env.local
```

Apply migrations and seed baseline data:

```bash
pnpm api:prisma:migrate:dev
pnpm api:prisma:migrate:seed
```

Seed demo portfolio content:

```bash
pnpm api:prisma:migrate:seed:demo
```

Run apps:

```bash
pnpm dev
```

Local ports:

- web: `http://localhost:3000`
- API: `http://localhost:3001`

## Useful Commands

```bash
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm --filter web test
pnpm --filter api test:unit
pnpm --filter api test:e2e
```

API e2e tests use Testcontainers and require a working local container runtime.

## Roadmap and Decisions

Canonical planning docs:

- `docs/agent-governance/progress.md`
- `docs/agent-governance/decisions.md`

Current focus: Phase 11.6 (public repository readiness).

## Admin Deployment Caveat

Admin/moderation routes are included in source, but any real-user deployment
must enforce authentication and authorization before exposing admin surfaces.

## License and Contributions

This repository is public-source for portfolio review, but not currently
published under an open-source license.

- package metadata is marked `UNLICENSED`
- no `LICENSE` file is included yet
- external contributions are not being solicited at this stage
