# Phase 4 Test Infrastructure

## Purpose

Define the Phase 4 backend test infrastructure contract so persistence-level
integration tests can run with the same isolation model locally and in CI.

This document is the canonical implementation guide for:

- ephemeral database isolation
- integration test environment variables
- migration lifecycle expectations
- minimum persistence coverage required before Phase 5

## Scope

Phase 4 applies to backend persistence integration tests only.

It does not introduce:

- Phase 5 API/controller behavior tests
- frontend end-to-end testing
- performance/load testing
- coverage percentage gates
- shared long-lived test databases

## Chosen Isolation Model

Phase 4 uses:

- one transient Postgres server per execution environment
- one unique logical database per integration test run
- create -> migrate -> test -> drop lifecycle for every integration run

This means:

- local and CI both execute against disposable databases
- integration tests never point at the primary development database
- test isolation is enforced at the database level, not only through row cleanup

## Why Database-Per-Run

Database-per-run isolation is the narrowest practical choice for the current repo.

It provides:

- strong protection against development-data contamination
- realistic migration validation on fresh databases
- predictable teardown behavior
- parity between local and CI execution without requiring a permanent test database

Schema-per-run isolation is not chosen because Phase 4 should validate the full
database lifecycle, including creation and migration application from empty state.

## Execution Environments

### Local

Local execution requires access to a disposable Postgres server instance.

Acceptable local provisioning options:

- a developer-run Docker container
- a local Postgres installation
- another disposable local Postgres process

The provisioning mechanism may differ, but the isolation model must remain the same:

- create a unique test database
- apply migrations
- run integration tests
- drop the database

### CI

CI should provision a transient Postgres service for the job and then follow the
same logical flow used locally:

- create a unique test database name for the run
- apply migrations to that database
- execute persistence integration tests
- drop the database before job completion when feasible

The CI provisioning layer may be a GitHub Actions service container or another
ephemeral CI-native Postgres mechanism. The important contract is database-per-run isolation.

## Environment Contract

Phase 4 should standardize the backend integration environment around two classes
of connection information.

### Application connection

- `DATABASE_URL`
  - points to the ephemeral integration database used by Prisma and application code during the test run

### Administrative connection

- `INTEGRATION_DATABASE_ADMIN_URL`
  - points to the transient Postgres server with enough privilege to create and drop per-run databases

### Execution metadata

- `INTEGRATION_DATABASE_NAME`
  - unique database name for the current run
- `NODE_ENV=test`
  - required for integration execution
- `CI`
  - optional environment signal used only for runner behavior differences

If implementation later prefers deriving `DATABASE_URL` from an admin URL plus
database name, that is acceptable as long as the contract remains explicit and documented.

## Safety Guardrails

The integration harness must fail closed.

Required safety behavior:

- refuse to run if `DATABASE_URL` targets the known development database name
- refuse destructive reset/drop behavior unless `NODE_ENV=test`
- generate a unique database name for every run to avoid cross-run collisions
- ensure teardown still runs after test failure when possible

## Migration Lifecycle Contract

Every integration run should follow this sequence:

1. Provision or connect to the transient Postgres server.
2. Create a unique integration database.
3. Point `DATABASE_URL` at that database.
4. Run Prisma generate if needed by the execution path.
5. Apply committed migrations to the fresh database.
6. Execute persistence integration tests.
7. Drop the integration database.

Phase 4 should validate migrations from empty state on every integration run.

It should not rely on:

- the developer's long-lived local database
- manually reset shared test schemas
- row-deletion cleanup as the primary isolation mechanism

## Test Taxonomy

Phase 4 should keep backend validation modes separate.

### Unit tests

- use mocks/fakes
- do not require Postgres
- remain fast and independently runnable

### Persistence integration tests

- use real Postgres plus Prisma
- validate schema, constraints, and repository behavior
- use the ephemeral database workflow defined in this document

### HTTP smoke tests

- validate Nest application bootstrap and basic request handling
- may remain separate from persistence integration tests

Phase 4 does not require merging HTTP smoke tests into the persistence suite.

## Minimum Persistence Coverage

Phase 4 exit criteria require integration coverage for the required Release 1 relationships and baseline integrity rules already represented in the Prisma schema.

### Required relationships

- `TopicArticle` join behavior for Topic -> Article
- `TopicAction` join behavior for Topic -> Action
- `TopicEvent` join behavior for Topic -> Event
- `Submission.articleId` one-to-one link behavior for Submission -> Article
- `Submission.eventId` one-to-one link behavior for Submission -> Event

### Baseline integrity constraints

- unique `slug` constraints on `Topic`, `Article`, and `Action`
- composite uniqueness for required topic join tables
- uniqueness of `Submission.articleId`
- uniqueness of `Submission.eventId`
- migration application succeeds against a fresh database

### Optional relationship coverage

Optional Phase 3 relationships may be tested if implementation work depends on them:

- `ArticleAction`
- `ArticleEvent`
- `ActionEvent`

They are useful stretch coverage but are not required to close Phase 4 unless the
integration harness or repository behavior starts depending on them.

## Command Expectations

Phase 4 implementation should expose distinct backend commands for:

- unit tests
- persistence integration tests
- HTTP smoke/e2e tests

Representative command shape:

- `pnpm --filter api test`
- `pnpm --filter api test:integration`
- `pnpm --filter api test:e2e`

Exact names may vary, but the workflows must be separable in both local and CI usage.

## CI Expectations

CI should add an explicit backend persistence integration step rather than relying
only on a broad monorepo test target.

The CI job should make it obvious when each category runs:

- lint
- typecheck
- build
- unit tests
- persistence integration tests
- HTTP smoke tests, if retained in CI

This avoids ambiguity about whether Phase 4 acceptance criteria are actually enforced.

## Intentional Non-Goals

Phase 4 does not require:

- seeding editorial/demo content into integration databases
- broad repository fixture libraries beyond what tests need
- frontend test infrastructure expansion
- moderation workflow end-to-end coverage
- search/discovery query correctness tests

Those concerns belong to later phases unless a narrow implementation dependency appears.
