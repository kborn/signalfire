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
```

Phase 2.2 baseline migration example:

```bash
pnpm api:prisma:migrate:dev --name infrastructure_probe
```

## Validation

From repository root:

```bash
pnpm api:prisma:generate
pnpm --filter api typecheck
pnpm --filter api lint
```

## Phase 2 Notes

- Local end-to-end migration validation is required.
- CI migration execution is deferred unless low-complexity DB orchestration is available.
