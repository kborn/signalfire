# Find Your Fight API App

NestJS backend service for Find Your Fight.

Use the root README for repository setup, local environment files, demo seed
guidance, and public repository status:

- `../../README.md`

This package owns the API runtime, Prisma persistence workflow, public content
endpoints, public submission intake, and moderation/admin API endpoints.

## Run Locally

From repository root:

```bash
pnpm api:dev
```

## Prisma Workflow

From repository root:

```bash
pnpm api:prisma:generate
pnpm api:prisma:migrate:dev --name <migration_name>
pnpm api:prisma:migrate:deploy
pnpm api:prisma:migrate:seed
```

Use a descriptive migration name when creating local development migrations.

## Seed Modes

Baseline seed:

```bash
pnpm api:prisma:migrate:seed
```

Demo seed for local development:

```bash
pnpm api:prisma:migrate:seed:demo
```

Behavior:

- baseline seed inserts seeded Topics only
- demo seed inserts Topics plus local demo Articles, Actions, Events, and relationships
- production should use baseline seed only
- integration tests should use baseline seed unless a test suite explicitly needs demo content

## Validation

From repository root:

```bash
pnpm api:prisma:generate
pnpm --filter api typecheck
pnpm --filter api lint
pnpm --filter api test:unit
pnpm --filter api test:e2e
```

API e2e and integration tests use Testcontainers and require a working local
container runtime.

## Operational Notes

Persistence integration workflow documentation lives in:

- `docs/architecture/007-phase-4-test-infrastructure.md`
- `docs/runbooks/phase-4-integration-test-workflow.md`
