# Phase 4 Integration Test Workflow

## Purpose

Describe the intended local and CI workflow for backend persistence integration tests.

This runbook is for developers implementing and operating the Phase 4 test harness.

## Preconditions

Before running backend persistence integration tests, ensure:

- dependencies are installed with `pnpm install`
- a disposable Postgres server is available locally
- Phase 3 migrations are committed
- no integration workflow points at the primary local development database

## Local Workflow

### 1. Provision a disposable Postgres server

Any local Postgres server is acceptable if it is used only as the host for transient
integration databases.

Examples:

- local Docker container
- local Postgres service

The server should expose an administrative connection that can create and drop databases.

### 2. Set integration environment variables

Local integration execution should provide:

- `INTEGRATION_DATABASE_ADMIN_URL`
- `INTEGRATION_DATABASE_NAME`
- `DATABASE_URL`
- `NODE_ENV=test`

`DATABASE_URL` must reference the unique integration database for the current run.

### 3. Run the integration lifecycle

The intended workflow is:

1. create a unique integration database
2. apply committed Prisma migrations
3. run backend persistence integration tests
4. drop the integration database

This lifecycle should be wrapped in automation during implementation rather than
performed manually for every run.

## Local Validation Expectations

A developer should be able to verify all of the following from a clean machine state:

- integration database creation succeeds
- migrations apply to a fresh database
- persistence integration tests pass
- the database is removed after the run

## CI Workflow

CI should follow the same lifecycle as local execution, with the Postgres server
provisioned by the CI platform.

Expected CI flow:

1. provision transient Postgres service
2. generate a unique integration database name
3. create the database
4. apply migrations
5. run persistence integration tests
6. drop the database when the job finishes if the runner supports it

The CI implementation should not use a long-lived shared test database.

## Guardrails

The integration runner should stop immediately if:

- `NODE_ENV` is not `test`
- `DATABASE_URL` appears to target the development database
- the integration database name is missing or non-unique
- admin privileges are insufficient to create or drop the test database

## Troubleshooting

### Migrations fail on a fresh database

Check:

- the latest committed migrations are present
- identity-column edits required by the Postgres migration convention were preserved
- `DATABASE_URL` points to the intended ephemeral database

### Teardown fails

Check:

- active connections are closed before drop
- the harness handles failures in `afterAll` or equivalent cleanup
- the database name is unique to the current run

### Tests accidentally touch development data

Treat that as a harness bug.

The fix belongs in:

- connection guardrails
- test environment validation
- destructive-command safety checks

## Deliverables Expected From Implementation

Phase 4 implementation should leave the repo with:

- a documented integration environment contract
- repeatable local commands for persistence integration tests
- explicit CI wiring for those tests
- clear separation between unit, persistence integration, and smoke/e2e workflows
