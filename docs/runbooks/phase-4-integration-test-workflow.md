# Phase 4 Integration Test Workflow

## Purpose

Describe the intended local and CI workflow for backend persistence integration tests.

This runbook is for developers implementing and operating the Phase 4 test harness.

## Preconditions

Before running backend persistence integration tests, ensure:

- dependencies are installed with `pnpm install`
- a working container runtime is available locally for Testcontainers
- Phase 3 migrations are committed
- no integration workflow points at the primary local development database

## Local Workflow

### 1. Ensure a working container runtime is available

The current implementation uses Testcontainers to start a transient Postgres container
for the integration run.

Examples:

- Docker Desktop
- Colima
- Podman with compatible Testcontainers support

### 2. Run the integration lifecycle

The intended workflow is:

1. start a transient Postgres container
2. set `DATABASE_URL` from the container connection string
3. apply committed Prisma migrations
4. seed required baseline data
5. run backend persistence integration tests
6. stop the container

This lifecycle should be wrapped in automation during implementation rather than
performed manually for every run.

## Local Validation Expectations

A developer should be able to verify all of the following from a clean machine state:

- the container runtime is discovered successfully
- migrations apply to a fresh database
- persistence integration tests pass
- the container is removed after the run

## CI Workflow

CI should follow the same lifecycle as local execution, with Testcontainers
provisioning the Postgres container during the job.

Expected CI flow:

1. ensure a working container runtime is available on the runner
2. start transient Postgres container through Testcontainers
3. apply migrations
4. seed required baseline data
5. run persistence integration tests
6. stop the container when the job finishes

The CI implementation should not use a long-lived shared test database or a separate
manually managed integration Postgres service.

## Guardrails

The integration runner should stop immediately if:

- the container runtime is unavailable
- `NODE_ENV` is not `test` when destructive behavior is introduced later
- `DATABASE_URL` appears to target the development database

## Troubleshooting

### Migrations fail on a fresh database

Check:

- the latest committed migrations are present
- identity-column edits required by the Postgres migration convention were preserved
- `DATABASE_URL` points to the intended ephemeral database

### Teardown fails

Check:

- the harness handles failures in teardown cleanup
- the container runtime is healthy
- the test process is not leaving open handles that block shutdown

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
