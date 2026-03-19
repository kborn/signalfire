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

- one transient Postgres container per integration test execution
- one application database inside that container for the run
- start container -> migrate -> seed -> test -> stop container lifecycle for every integration run

This means:

- local and CI both execute against disposable Postgres infrastructure
- integration tests never point at the primary development database
- test isolation is enforced by replacing the whole database runtime for each run

## Current Harness Risk

The current integration harness shares one ephemeral Postgres database across the
entire Jest integration run and resets mutable tables after each test by truncation.

This is acceptable only while integration execution remains effectively serialized.

If multiple integration spec files execute concurrently against that shared database,
one test can truncate rows that another test still depends on.

That creates a concrete flake risk:

- test A inserts rows and begins assertions
- test B finishes earlier and triggers shared-table truncation in `afterEach`
- test A observes missing data or inconsistent state mid-test

The risk is in the interaction between:

- one database per integration run
- shared mutable tables
- per-test truncation cleanup
- Jest worker parallelism across spec files

Phase 4.3 evaluates per-test transaction rollback as a safer isolation strategy for
eligible specs while keeping truncation as the fallback cleanup path.

## Why Container-Per-Run

Container-per-run isolation is the clearest implementation path for the current repo.

It provides:

- strong protection against development-data contamination
- realistic migration validation on a fresh Postgres instance
- predictable teardown behavior with a single cleanup step
- parity between local and CI execution through the same Testcontainers workflow

Database-per-run on a shared server is not chosen because the current implementation
does not need a separate admin connection contract or create/drop orchestration when
the entire Postgres runtime can be created and destroyed per integration execution.

## Execution Environments

### Local

Local execution requires a working container runtime that Testcontainers can use.

Expected local provisioning path:

- Docker Desktop, Colima, Podman, or another compatible Testcontainers runtime

The local workflow remains:

- start a transient Postgres container
- point `DATABASE_URL` at that container database
- apply migrations
- seed required baseline data
- run integration tests
- stop the container

### CI

CI should provide a working container runtime and then follow the same logical flow
used locally:

- start a transient Postgres container through Testcontainers
- apply migrations to the container database
- seed required baseline data
- execute persistence integration tests
- stop the container before job completion

The important contract is that local and CI both use the same container-per-run isolation model.

## Environment Contract

Phase 4 standardizes the backend integration environment around the application connection.

### Application connection

- `DATABASE_URL`
  - points to the ephemeral integration database used by Prisma and application code during the test run

### Execution metadata

- `NODE_ENV=test`
  - required for integration execution
- `CI`
  - optional environment signal used only for runner behavior differences

The current implementation does not require a separate admin URL or explicit
database-name variable because Testcontainers provisions the transient Postgres
runtime and exposes the final application connection string directly.

## Safety Guardrails

The integration harness must fail closed.

Required safety behavior:

- refuse to run if `DATABASE_URL` targets the known development database name
- refuse destructive reset/drop behavior unless `NODE_ENV=test`
- use a fresh transient Postgres container for every integration run
- ensure teardown still runs after test failure when possible

## Migration Lifecycle Contract

Every integration run should follow this sequence:

1. Start a transient Postgres container.
2. Point `DATABASE_URL` at the container database.
3. Run Prisma generate if needed by the execution path.
4. Apply committed migrations to the fresh database.
5. Seed required baseline data for integration tests.
6. Execute persistence integration tests.
7. Stop the integration container.

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
