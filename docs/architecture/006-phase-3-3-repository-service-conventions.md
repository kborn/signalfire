# Phase 3.3 Repository And Service Conventions

## Purpose

Document the baseline backend persistence conventions established in Phase 3.3 for Release 1 domain entities.

This document is the canonical reference for how repositories and services should divide responsibility until later phases introduce controllers and richer use-case orchestration.

## Scope

Applies to:

- `Topic`
- `Article`
- `Action`
- `Event`
- `Submission`

## Core Boundary

- Repositories own Prisma queries.
- Services own use-case methods.
- Controllers should call services, not repositories.
- `PrismaModule` remains infrastructure only.

## Repository Conventions

Repositories are responsible for:

- direct `PrismaService` access
- query composition
- relation filters
- selecting the persistence method (`findUnique`, `findMany`, `create`, etc.)
- returning entity-shaped results for current Phase 3.3 read paths

Repositories should:

- keep method names explicit
- prefer entity-owned queries
- keep persistence details out of services

Repositories should not:

- coordinate multiple repositories
- own transaction boundaries across domain areas
- contain moderation workflow logic
- expose generic base-repository abstractions

## Service Conventions

Services are responsible for:

- exposing use-case-level methods
- delegating persistence to repositories
- becoming the future coordination point for cross-entity reads/writes

In the current Phase 3.3 implementation, many service methods are intentionally thin pass-throughs. That is acceptable because the goal of this phase is to establish clean boundaries before Phase 5 APIs are built.

Services should become more orchestration-heavy only when a use case needs:

- multiple repository calls
- transaction coordination
- result shaping across entities
- domain rules that should not live in repositories

## Entity Ownership Pattern

Phase 3.3 uses entity-owned repository methods rather than duplicating the same read path in multiple repositories.

Examples:

- `TopicRepository` returns topics
- `ArticleRepository` returns articles
- `ActionRepository` returns actions
- `EventRepository` returns events
- `SubmissionRepository` returns submissions

This means topic-scoped article lookups belong in `ArticleRepository`, not both `TopicRepository` and `ArticleRepository`.

## Published Content Rule

For public read paths introduced in Phase 3.3, published-content filtering is encoded directly in repository methods whose names make that rule explicit.

Examples:

- `findPublishedByTopicSlug(...)`
- `findPublishedByActionId(...)`
- `findByArticleId(...)` for `Event` when the current query is already restricted to published events

This keeps the current implementation simple while still making read intent visible in method naming.

## Includes, Selects, And Relation Loading

Prisma does not auto-load related entities.

Repositories should only use `include` or `select` when a use case actually needs related data in the same query.

Current Phase 3.3 baseline methods favor simple entity reads:

- fetch the primary entity directly
- fetch related entities through explicit repository methods when needed later

This avoids loading large relation graphs by default and keeps Phase 3.3 aligned with upcoming Phase 5 API read paths.

## Transactions

Cross-repository transaction boundaries belong in services, not repositories.

Phase 3.3 does not yet require multi-repository transaction orchestration, so no shared transaction abstraction is introduced.

## Submission-Specific Rule

Submission creation is future-facing but intentionally minimal in Phase 3.3.

- creation persists a submission record
- new submissions are stored as `PENDING`
- moderation workflow behavior remains out of scope for this phase

## What Phase 3.3 Does Not Introduce

- controllers for domain APIs
- generic repository abstractions
- admin CRUD surfaces
- moderation workflow logic beyond baseline persistence
- search/discovery-specific query shaping
- richer event access patterns planned for later phases
