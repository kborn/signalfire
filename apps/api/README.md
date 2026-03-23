# API App

NestJS backend service for SignalFire.

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

Phase 2.2 baseline migration example:

```bash
pnpm api:prisma:migrate:dev --name infrastructure_probe
```

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
```

## Phase 4 Test Infrastructure

Phase 4 persistence integration workflow documentation lives in:

- `docs/architecture/007-phase-4-test-infrastructure.md`
- `docs/runbooks/phase-4-integration-test-workflow.md`

## Phase 2 Notes

- Local end-to-end migration validation is required.
- CI migration execution is deferred unless low-complexity DB orchestration is available.
