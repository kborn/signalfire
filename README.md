# Find Your Fight

Find Your Fight is a civic discovery application that helps visitors focus on
one issue, understand what is at stake, and find a concrete way to act.

The repository is still named `signal-fire`, but the public product identity is
`Find Your Fight`.

## Current Scope

Implemented product areas:

- public issue discovery through Topics
- public Articles, Actions, and Events
- related-content links across issues, explainers, actions, and events
- public article and event submission flows
- moderation queue for submitted Articles and Events
- editorial normalization before approval
- publication mapping from approved submissions into public content records
- demo seed content for local portfolio/screenshot review

Out of scope for the current release:

- public user accounts
- social feeds or platform-hosted organizing
- production deployment
- authentication/authorization for deployed admin routes
- topic management beyond the seeded Release 1 topic set

## Architecture

This is a pnpm monorepo.

- `apps/web` - Next.js App Router frontend
- `apps/api` - NestJS backend API
- `packages/api-contracts` - shared request/response contracts
- `docs/specs` - product and feature specs
- `docs/architecture` - architecture notes and implementation contracts
- `docs/agent-governance` - roadmap, decisions, and AI collaboration rules
- `docs/learnings` - implementation guides, walkthroughs, and learning cards

The public web routes use server-rendered data fetching for initial page
content. Browser-side API calls are used where the user performs an action after
page load, such as public submissions and admin moderation.

## Requirements

- Node.js compatible with the repo toolchain
- pnpm `10.30.3`
- Docker or another local PostgreSQL option for database-backed development

Install dependencies:

```bash
pnpm install
```

Start PostgreSQL:

```bash
docker-compose up -d
```

Set local environment files from the examples:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.local.example apps/web/.env.local
```

Apply migrations and seed baseline data:

```bash
pnpm api:prisma:migrate:dev
pnpm api:prisma:migrate:seed
```

For local demo content:

```bash
pnpm api:prisma:migrate:seed:demo
```

Run the app:

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

## Demo Review

Demo seed mode creates Articles, Actions, Events, relationships, and moderation
submissions suitable for local portfolio review.

Recommended screenshot paths are documented in:

- `docs/runbooks/phase-11-6-demo-content-screenshot-flow.md`

## Roadmap Status

The canonical roadmap is:

- `docs/agent-governance/progress.md`

Current milestone focus is Phase 11.6: public repository readiness after the
Phase 11.5 public experience refresh.

## Admin And Deployment Caveat

The admin/moderation source code is part of this repository, but deployment to
any environment intended for real users requires authentication and
authorization before exposing admin routes.

Making the source repository public does not mean the application is ready for a
public production deployment.

## License And Contributions

This repository is public-source for portfolio review, but it is not currently
published under an open-source license.

- package metadata is marked `UNLICENSED`
- no `LICENSE` file is included yet
- external contributions are not being solicited at this stage

A formal license and contribution policy should be added before inviting reuse
or outside contributions.
