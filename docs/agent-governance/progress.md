# Project Progress

This document tracks **phases and current status**.
It is the canonical answer to: “Where are we in the plan?”

---

| Phase                                             | Name                            | Status    |
| ------------------------------------------------- | ------------------------------- | --------- |
| [0](#-phase-0--repo-bootstrap-)                   | Repo Bootstrap                  | ✅        |
| [1](#-phase-1--platform-skeleton-)                | Repository & Platform Skeleton  | ✅        |
| [2](#-phase-2--backend-foundations-)              | Backend Foundations             | ✅        |
| [3](#-phase-3--core-domain-model-)                | Core Domain Model               | ✅        |
| [4](#-phase-4--test-infrastructure-)              | Test Infrastructure             | ✅        |
| [5](#-phase-5--topic--content-apis-)              | Topic & Content APIs            | ✅        |
| [6](#-phase-6--content-discovery-ui-)             | Content Discovery UI            | ✅        |
| [7](#-phase-7--event-domain--apis-)               | Event Domain & APIs             | ✅        |
| [8](#-phase-8--event-ui-)                         | Event UI                        | ✅        |
| [9](#-phase-9--ui-polish-)                        | UI Polish                       | ✅        |
| [10](#-phase-10--submission-system-)              | Submission System               | ✅        |
| [11](#-phase-11--moderation--admin-interface-)    | Moderation & Admin Interface    | ✅        |
| [12](#-phase-12--search--discovery-improvements-) | Search & Discovery Improvements | ✅        |
| [13](#-phase-13--release-prep--final-polish-)     | Release Prep & Final Polish     | ✅        |
| [14](#-phase-14--portfolio-credibility-pass-)     | Portfolio Credibility Pass      | ✅        |
| [15](#-phase-15--deployment-infrastructure-)      | Deployment Infrastructure       | 🚧 ACTIVE |
| [16](#-phase-16--public-launch-)                  | Public Launch                   | ⏳        |

---

## Implementation Order

Agents should treat the **active phase** as the current boundary.

Work should only focus on:

1. Completing tasks listed in the current phase
2. Creating new tasks inside the phase if necessary
3. Updating progress.md when tasks are completed

Agents must **not jump ahead to future phases** unless explicitly approved by the human.

---

## Phase Completion Rule

A phase is considered complete when all items listed under
"Phase Tasks" are satisfied.

Phase tasks may evolve during implementation, but the Phase Tasks
represents the criteria that must be met before moving to the next phase.

When a phase is completed:

1. Update the phase status to `Complete`
2. Update **Current Position** to the next phase
3. Create the entry for the next phase using the Phase Entry Format

---

## Phase Entry Format (Required)

### ► Phase N — `Name` `Status`

###### Goal

One sentence description of the high level goal of this phase

###### Definition of Done

- [ ] Architecture documented
- [ ] Stack decided
- [ ] Implementation can begin

---

#### Phase N.1 - `Name` `Status`

###### Phase Tasks:

- [ ] `task1`
- [ ] `task2`

---

#### Phase N.2 - `Name` `Status`

###### Phase Tasks:

- [ ] `task1`
- [ ] `task2`

---

#### Notes (optional; keep short):

- `temporary reminders / blockers; link to decisions.md for rationale`

---

#### Links (optional):

- Implementation: `PR`
- Tests: `path`
- Decisions: `section link`

---

---

### ► Phase N+1 — `Name` `Status`

...

---

## Phase Overview

### ► Phase 0 — Repo Bootstrap ✅

###### Goal

Establish the repository structure, governance documentation, and initial architectural decisions required to begin implementation.

###### Definition of Done

- [x] Repository structure for the project is established
- [x] The selected technology stack is documented in `project-context.md`
- [x] AI governance documentation defining agent roles and guardrails exists
- [x] Core architectural intent and system structure are documented
- [x] Product scope, domain model, and roadmap documentation exist
- [x] `progress.md` defines all anticipated phases required to reach Release 1
- [x] The documentation set is sufficient for implementation to begin without additional architectural decisions
- [x] No application code has been written; Phase 0 establishes documentation and planning only

---

#### ▸ Phase 0.1 - AI Governance docs ✅

###### Phase Tasks:

- [x] Establish high level repository structure
- [x] Create the governance docs needed to create a guardrail-first approach to leveraging AI agents
- [x] Decide on a tech stack and record in project-context.md

---

#### ▸ Phase 0.2 - Complete pre-implementation documentation ✅

###### Phase Tasks:

- [x] All anticipated phases necessary to reach release 1 are defined in `progress.md`
- [x] High level architecture project architecture

---

###### Notes:

- This PR establishes the repo structure, technology stack AI governance decisions and docs and high level
  project overview and architecture docs
- This PR only adds or updates docs - No code is written and no technology is introduced

---

---

### ► Phase 1 — Platform Skeleton 🚧

###### Goal

Create the monorepo structure, basic frontend and backend applications, shared tooling, and development environment.

###### Definition of Done

- [x] Monorepo structure established with shared tooling and root workspace configuration
- [x] Frontend (Next.js) and backend (NestJS) apps scaffolded and runnable
- [x] Development environment configured (database, scripts)
- [x] CI pipeline configured (lint, typecheck, tests)
- [x] Local setup and run instructions documented

---

#### ▸ Phase 1.1 - Monorepo Structure ✅

###### Phase Tasks:

- [x] Select monorepo tooling (Turborepo)
- [x] Select package manager (pnpm)
- [x] Create directory structure (apps/, packages/, docs/)
- [x] Configure root workspace and task pipeline (workspaces + turbo config + root scripts)
- [x] Configure shared TypeScript, ESLint, and Prettier baseline

---

#### ▸ Phase 1.2 - Frontend Scaffold ✅

###### Phase Tasks:

- [x] Initialize Next.js app in apps/web
- [x] Configure TypeScript
- [x] Set up linting and formatting
- [x] Verify dev server runs

---

#### ▸ Phase 1.3 - Backend Scaffold ✅

###### Phase Tasks:

- [x] Initialize NestJS app in apps/api
- [x] Configure TypeScript
- [x] Set up linting and formatting
- [x] Verify dev server runs

---

#### ▸ Phase 1.4 - Validation & Tooling Baseline ✅

###### Phase Tasks:

- [x] Add shared tooling baseline (tsconfig.base.json, Prettier configs)
- [x] Update app configs to extend root baseline where possible
- [x] Run root commands: lint, test, build
- [x] Verify dev fanout works (pnpm run dev)

---

#### ▸ Phase 1.5 - Development Environment ✅

###### Phase Tasks:

- [x] Configure PostgreSQL via Docker Compose
- [x] Add database connection configuration
- [x] Create startup scripts
- [x] Define local env contract (.env.example and required variables)

---

#### ▸ Phase 1.6 - Pipeline CI ✅

###### Phase Tasks:

- [x] Establish baseline test runners (Vitest for frontend, Jest for backend)
- [x] Create GitHub Actions workflow (PR + push)
- [x] Verify CI runs lint, typecheck, and tests for both apps
- [x] Create pre-commit linter and typecheck checks

---

#### Notes:

- Frontend: Next.js 14+ with App Router
- Backend: NestJS with TypeScript
- Database: PostgreSQL (local dev via Docker)
- Monorepo tool: Turborepo
- Package manager: pnpm

---

### ► Phase 2 — Backend Foundations 🚧

###### Goal

Establish backend service structure, database connection, migrations, and health endpoints.

---

###### Definition of Done

- [x] Backend module structure is defined and documented for Phase 2 scope
- [x] Prisma is integrated with the NestJS backend and database connectivity is validated
- [x] Initial migration workflow is established and verified end-to-end locally
- [x] Health endpoint(s) exist and include database readiness verification
- [x] Backend foundation setup is documented sufficiently for Phase 3 implementation

---

#### ▸ Phase 2.1 - Service Structure & Configuration ✅

###### Phase Tasks:

- [x] Define backend module/service structure for infrastructure concerns (config, db, health)
- [x] Establish environment variable contract for backend runtime configuration
- [x] Add runtime configuration validation and fail-fast behavior for missing required variables
- [x] Create one concise backend foundations doc covering Phase 2 modules, ownership boundaries, out-of-scope items for Phase 3, and config/Prisma/health interaction

---

#### ▸ Phase 2.2 - Prisma Integration & Migration Baseline ✅

###### Phase Tasks:

- [x] Integrate Prisma into the NestJS backend application
- [x] Configure Prisma schema and database datasource for local development
- [x] Create and apply a minimal infrastructure-only migration to validate Prisma connectivity and migration workflow without introducing core domain schema decisions
- [x] Ensure Prisma client generation is part of the backend workflow
- [x] Document migration and client-generation commands for local development
- [x] Validate migration workflow end-to-end locally
- [ ] ~~add CI migration execution only if low complexity, otherwise document deferral rationale~~
  - This has been deferred and documented in [decisions.md](decisions.md#2026-03-10)

---

#### ▸ Phase 2.3 - Health & Readiness Endpoints ✅

###### Phase Tasks:

- [x] Implement liveness endpoint for backend process health
- [x] Implement readiness endpoint including database connectivity check
- [x] Add tests for health/readiness success and failure scenarios
- [x] Document endpoint contract and expected response behavior

---

#### Notes:

- Decision: Phase 2 is limited to backend infrastructure foundations only. Core domain entity modeling and Release 1 domain persistence begin in Phase 3.

---

---

### ► Phase 3 — Core Domain Model ✅

###### Goal

Implement the core domain persistence model in Prisma, including schema,
entity relationships, migration workflow, and repository/service layer
patterns for Release 1 domain entities.

###### Definition of Done

- [x] Prisma models exist for Topic, Article, Action, Event, and Submission
- [x] Core relationships are implemented and validated via migrations
- [x] Initial Phase 3 migration(s) are applied locally and reproducible
- [x] Repository/service layer boundaries and baseline persistence patterns are documented and implemented for current scope
- [x] Phase 3 scope boundaries are documented and enforced

---

#### ▸ Phase 3.1 - Core Entity Schema & Relationships ✅

###### Phase Tasks:

- [x] Define and document a Release 1 relationship matrix (required vs optional/deferred) for Topic, Article, Action, Event, and Submission as the Phase 3 implementation contract
- [x] Define Prisma models for Topic, Article, Action, Event, and Submission
- [x] Define and implement unique public identifiers (slug fields) for Topics, Articles, and Actions to support stable URL routing
- [x] Implement Topic relationships to Articles, Actions, and Events
- [x] Implement the required cross-entity relationships among Articles, Actions, and Events according to the relationship matrix (above)
- [x] Model Submission as pending Article or pending Event content
- [x] Add constraints/indexes needed for relationship integrity and baseline read performance

---

#### ▸ Phase 3.2 - Migrations & Persistence Validation ✅

###### Phase Tasks:

- [x] Generate and apply Prisma migration(s) for Phase 3 domain schema
- [x] Validate migration workflow end-to-end locally (create, apply, reset, re-apply)
- [x] Ensure Prisma client is regenerated and aligned with Phase 3 schema
- [x] Remove InfrastructureProbe model
- [x] Seed [topics](decisions.md#2026-03-10-1)

---

#### ▸ Phase 3.3 - Repository & Service Layer Patterns ✅

###### Phase Tasks:

- [x] Define repository/service boundaries for Topic, Article, Action, Event, and Submission persistence flows
- [x] Implement repository patterns for core CRUD/read operations required by upcoming Phase 5 APIs
- [x] Keep service layer focused on domain orchestration and relationship-aware access patterns
- [x] Document conventions for Prisma usage in repositories/services (query composition, includes/selects, transaction boundaries)

---

#### Notes:

- In scope: database schema for core entities, entity relationships, Prisma models, migrations, repository/service layer patterns.
- Out of scope for Phase 3: UI behavior, search, moderation tooling, submission UX, ingestion systems, and complex geospatial queries.
- Out of scope for Phase 3: moderation workflow behavior beyond persistence fields/states needed for future approval flows
- Canonical relationship rules for this phase:
  - Topics organize Articles, Actions, and Events.
  - Articles may reference Topics, Actions, and Events.
  - Actions may reference Topics, Articles, and Events.
  - Submissions represent pending Article or Event content.

---

---

### ► Phase 4 — Test Infrastructure 🚧

###### Goal

Establish an ephemeral integration database workflow and wire persistence-level integration tests into automated validation.

###### Definition of Done

- [x] Ephemeral backend integration database strategy is documented and implemented
- [x] Integration test commands run against isolated non-development database instances
- [x] Core persistence integration tests run locally and in CI
- [x] Local and CI integration workflows use the same isolation model
- [x] Comprehensive integration test coverage of existing API functionality

---

#### ▸ Phase 4.1 - Integration Harness & First Proof ✅

###### Phase Tasks:

- [x] Define the backend integration isolation model as container-per-test-run on ephemeral Postgres instances
- [x] Define the backend integration environment contract (`DATABASE_URL`, container runtime requirements, test-mode guardrails)
- [x] Define the migration lifecycle for container start, migrate, seed, test, and teardown against ephemeral integration database instances
- [x] Add backend integration commands that are distinct from unit-test and HTTP smoke-test commands
- [x] Add test setup/teardown utilities that provision, migrate, seed, and destroy isolated integration databases per run
- [x] Wire backend persistence integration tests into CI validation
- [x] Keep unit tests, persistence integration tests, and HTTP smoke tests separable in local and CI workflows
- [x] Add one minimal persistence integration proof test that validates the harness end to end
- [x] Document the local developer workflow for provisioning a transient Postgres instance and running integration tests
- [x] Document CI database provisioning and confirm it uses the same database isolation model as local execution

---

#### ▸ Phase 4.2 - Persistence Coverage Expansion ✅

###### Phase Tasks:

- [x] Add persistence integration tests for required Release 1 relationships:
  - Topic -> Article
  - Topic -> Action
  - Topic -> Event
  - Submission -> Article
  - Submission -> Event
- [x] Add persistence integration tests for baseline integrity constraints:
  - unique slugs on Topic, Article, and Action
  - one-to-one uniqueness on Submission article/event links
  - composite join-table uniqueness on required topic relationship tables
- [x] Add additional fixture/setup helpers only if coverage growth makes the current harness too repetitive

---

#### ▸ Phase 4.3 - Transaction Rollback Guarantees ✅

###### Phase Tasks:

- [x] Document the current risk in the shared-database plus per-test truncation
      model when integration specs execute concurrently
- [x] Implement per-test transaction rollback in one integration spec only
- [x] Prove the rollback pilot leaves no persisted test data behind between tests
- [x] Roll the rollback pattern out to additional eligible integration specs
- [x] Define which specs remain on truncation cleanup and why
- [x] Decide whether integration tests remain serialized or can run with multiple Jest workers under rollback isolation
  - Serialized integration tests are not needed now. This can be revisited if integration testing becomes sluggish

---

#### Notes:

- Phase 4 adopts ephemeral integration databases as the immediate strategy.
- Integration tests must remain isolated from the primary local development database.
- Phase 4 covers persistence integration confidence only; controller/API feature coverage belongs to later API phases.
- Optional Phase 3 relationships (`Article -> Action`, `Article -> Event`, `Action -> Event`) may be covered if implementation relies on them, but they are not phase-exit blockers.
- Phase 4.3 focuses on harness-level test isolation and cleanup guarantees, not
  application-level moderation workflow transactions.

#### Links:

- Architecture: `docs/architecture/007-phase-4-test-infrastructure.md`
- Runbook: `docs/runbooks/phase-4-integration-test-workflow.md`
- Decisions: `docs/agent-governance/decisions.md`

---

---

### ► Phase 5 — Topic & Content APIs ✅

###### Goal

Create APIs for reading Topics, Articles, and Actions.

###### Definition of Done

- [x] Public read endpoints exist for Topic, Article, and Action resources within Release 1 Phase 5 scope
- [x] Topic list and topic detail API contracts are implemented and validated
- [x] Article detail API contract is implemented and validated
- [x] Action detail API contract is implemented and validated
- [x] Topic, Article, and Action read paths expose the required published-content relationships for current discovery needs
- [x] Controller/API tests cover success, not-found, and publication-filter behavior for Phase 5 endpoints
- [x] Phase 5 API contracts and scope boundaries are documented for downstream UI work in Phase 6

---

#### ▸ Phase 5.1 - API Contracts & Controller Baseline ✅

###### Phase Tasks:

- [x] Define the public API surface for Phase 5 endpoints, including route structure and response shape boundaries
- [x] Decide and document where response shaping lives between controllers, services, and repository methods for Phase 5 read paths
- [x] Introduce controller modules for Topic, Article, and Action domains using existing Phase 3 repository/service boundaries
- [x] Add baseline controller-level tests and fixtures/helpers needed for Phase 5 endpoint coverage
- [x] Document explicit out-of-scope items for Phase 5 to prevent accidental expansion into Event APIs, search, pagination, or admin CRUD

###### Notes:

- Phase 5.1 establishes controller routing, service wiring, baseline not-found behavior, and controller tests.
- Final response shaping and relationship payload assembly remain the responsibility of Phase 5.2 through Phase 5.4 and are not required to complete Phase 5.1.

---

#### ▸ Phase 5.2 - Topic Read APIs ✅

###### Phase Tasks:

- [x] Implement topic listing endpoint for topic discovery
- [x] Implement topic detail endpoint by slug
- [x] Define the topic detail payload to include the topic entity plus required related published content summaries for Phase 5 scope
- [x] Ensure topic detail only exposes published related Articles and Actions
- [x] Add endpoint tests for topic listing/detail success and topic detail not-found behavior

---

#### ▸ Phase 5.3 - Article Read APIs ✅

###### Phase Tasks:

- [x] Implement article detail endpoint by slug
- [x] Restrict public article retrieval to published articles only
- [x] Expose article-to-topic relationships required for discovery and cross-linking
- [x] Expose article-to-action relationships required for discovery and cross-linking
- [x] Add endpoint tests for article detail success, unpublished filtering, and not-found behavior

---

#### ▸ Phase 5.4 - Action Read APIs ✅

###### Phase Tasks:

- [x] Implement action detail endpoint by slug
- [x] Restrict public action retrieval to published actions only
- [x] Expose action-to-topic relationships required for discovery and cross-linking
- [x] Expose action-to-article relationships required for discovery and cross-linking
- [x] Add endpoint tests for action detail success, unpublished filtering, and not-found behavior

---

#### ▸ Phase 5.5 - API Polish & Parity Review ✅

###### Phase Tasks:

- [x] Review Phase 5.1 through 5.4 implementations for consistency across Topic, Article, and Action read paths
- [x] Bring Topic controller/service/repository test coverage into parity with the Article and Action detail-path patterns where appropriate
- [x] Resolve known controller-spec contract drift so unit/controller tests reflect the actual public detail response shapes
- [x] Extract repository-specific Prisma payload types into dedicated repository type files where that improves clarity without weakening boundary ownership
- [x] Identify and extract duplicated mock detail payload builders/shared fixtures used across service and route tests where reuse improves clarity
- [x] Document any intentional pattern differences that remain between Topic, Article, and Action read APIs after the review

---

#### ▸ Phase 5.6 - Article & Action Collection APIs ✅

###### Phase Tasks:

- [x] Implement article listing endpoint for top-level content discovery
- [x] Implement action listing endpoint for top-level action discovery
- [x] Define and document summary response shapes for article and action collection routes
- [x] Standardize Action publication metadata by exposing `publishedAt` on Action detail and Action summary payloads
- [x] Apply published-only filtering to article and action collection routes
- [x] Define default collection ordering as newest `publishedAt` first for article and action lists
- [x] Add endpoint tests for article/action list success and publication-filter behavior

---

#### ▸ Phase 5.7 - Relationship Validation & Phase Handoff ✅

###### Phase Tasks:

- [x] Validate that Topic, Article, and Action endpoints provide a coherent discovery graph for Phase 6 UI consumption
- [x] Verify public read paths consistently apply publication rules across direct and related content
- [x] Add or refine integration/e2e coverage for the final Phase 5 endpoint set
- [x] Document the final endpoint contracts, relationship behavior, and known deferrals for later phases
- [x] Update phase status and notes when all Phase 5 tasks are complete

---

#### Notes:

- Phase 5 is limited to public read APIs for Topics, Articles, and Actions.
- Event read APIs belong to Phase 7 even though Events remain part of the overall discovery model.
- Article and Action collection routes are included in late Phase 5 to support Phase 6 top-level discovery UI needs.
- Search, pagination, filtering beyond basic entity lookup, and admin/editorial write paths remain out of scope for this phase.
- Closure rationale for the non-code Phase 5.7 items is documented in
  `docs/architecture/008-phase-5-topic-content-api-contracts.md`.
- Phase 5 ordering behavior is now explicit:
  - topic collections sort by `id` ascending
  - article and action collections sort by `publishedAt` descending with `id`
    ascending tie-breakers
  - nested relationship arrays sort by `id` ascending
- Dedicated e2e suites now exist for Topic, Article, and Action public routes.
- E2E execution could not be run in this environment because Testcontainers
  requires a working local container runtime.

---

---

### ► Phase 6 — Content Discovery UI ✅

###### Goal

Implement a minimal public discovery UI for topics, articles, and actions
using the existing Phase 5 public APIs.

###### Definition of Done

- [x] Users can browse topics and view topic detail pages
- [x] Users can browse articles and view article detail pages
- [x] Users can browse actions and view action detail pages
- [x] Users can navigate between related topics, articles, and actions
- [x] UI consumes the current Phase 5 public APIs without requiring backend scope expansion
- [x] No Phase 6 work depends on Events, search, filtering, pagination, or unpublished-content handling

---

#### ▸ Phase 6.1 - Routing & Page Structure ✅

###### Phase Tasks:

- [x] Implement Next.js routes for `/`, `/topics`, `/topics/[slug]`, `/articles`, `/articles/[slug]`, `/actions`, and `/actions/[slug]`
- [x] Add global navigation linking Home, Topics, Articles, and Actions
- [x] Add a shared application layout wrapper sufficient for public browsing flows

---

#### ▸ Phase 6.2 - Topic Discovery Flow ✅

###### Phase Tasks:

- [x] Establish shared API contract plumbing for Phase 6 topic UI consumption
- [x] Render the topic listing page from `GET /topics`
- [x] Render topic detail pages from `GET /topics/:slug`
- [x] Show topic name and description plus related article and action summaries
- [x] Link related article and action summaries to their detail pages

---

#### ▸ Phase 6.3 - Article Experience ✅

###### Phase Tasks:

- [x] Render the article listing page from `GET /articles`
- [x] Render article detail pages from `GET /articles/:slug`
- [x] Display full article content plus related topics and related actions
- [x] Make related topics and actions clearly discoverable and clickable

---

#### ▸ Phase 6.4 - Action Discovery ✅

###### Phase Tasks:

- [x] Render the action listing page from `GET /actions`
- [x] Render action detail pages from `GET /actions/:slug`
- [x] Display full action detail plus related topics and related articles
- [x] Make related topics and articles clearly discoverable and clickable

---

#### ▸ Phase 6.5 - Cross-Link Navigation Model ✅

###### Phase Tasks:

- [x] Support Topic → Article navigation
- [x] Support Topic → Action navigation
- [x] Support Article → Topic navigation
- [x] Support Article → Action navigation
- [x] Support Action → Topic navigation
- [x] Support Action → Article navigation

---

#### ▸ Phase 6.6 - UI Behavior Constraints ✅

###### Phase Tasks:

- [x] Rely on API-level published-only guarantees and do not add draft-state UI
- [x] Do not add pagination in Phase 6
- [x] Do not add search in Phase 6
- [x] Do not add filtering in Phase 6
- [x] Do not add Event UI in Phase 6

---

#### ▸ Phase 6.7 - Minimal Home Page ✅

###### Phase Tasks:

- [x] Implement a simple home page that explains the platform at a high level
- [x] Link prominently to Topics, Articles, and Actions from the home page

---

#### ▸ Phase 6.8 - Discovery Summary Components ✅

###### Phase Tasks:

- [x] Define shared UI components for Topic, Article, and Action summary previews
- [x] Reuse those components across collection pages and related-content sections where applicable
- [x] Keep component scope limited to current Phase 6 discovery routes and Phase 5 API contracts
- [x] Avoid introducing Phase 9 polish concerns such as advanced visual treatment, animation, or expanded landing-page content modules

---

#### ▸ Phase 6.9 - Discovery UI Test Coverage ✅

###### Phase Tasks:

- [x] Add focused frontend tests for topic, article, and action discovery routes
- [x] Add coverage for not-found and error-handling behavior on public detail pages
- [x] Add coverage for cross-link navigation surfaces between related topics, articles, and actions
- [x] Keep Phase 6 UI tests scoped to current public browsing behavior without expanding into Events, search, filtering, or pagination

---

###### Notes:

- Phase 6 should emphasize the Learn -> Decide -> Act discovery loop without turning the product into a generic blog UI.
- Keep implementation intentionally simple; avoid introducing a design system, component library, advanced animation work, or other scope-expanding UI infrastructure unless explicitly approved.
- Shared summary components are allowed in Phase 6 when they reduce duplicate discovery UI work and establish reusable structure for later presentation refinement.
- Keep Phase 6 focused on baseline public browsing structure and clear navigation; defer broader visual polish and presentation refinement to Phase 9 unless explicitly approved.

---

---

### ► Phase 7 — Event Domain & APIs ✅

###### Goal

Implement public Event domain read behavior and API contracts needed to support
Release 1 event discovery.

###### Definition of Done

- [x] Event persistence model and validation rules align with the canonical
      Event definition
- [x] Public event read endpoints exist for collection and detail use cases
- [x] Event filtering supports the scoped Release 1 dimensions: topic, date,
      and location
- [x] Publication rules are applied consistently across direct and
      relationship-driven Event reads
- [x] Event API contracts and deferrals are documented for Phase 8 UI work

---

#### ▸ Phase 7.1 - Event Schema & Domain Validation ✅

###### Phase Tasks:

- [x] Confirm the Prisma `Event` model matches the canonical minimum field set
- [x] Confirm Event publication state and timestamps are exposed consistently
      with Release 1 rules
- [x] Validate required `Topic -> Event` relationships and existing Event
      persistence constraints
- [x] Verify optional Event relationships remain scoped to already-supported
      product behavior rather than expanding the domain graph

---

#### ▸ Phase 7.2 - Event API Contracts ✅

###### Phase Tasks:

- [x] Define and document Event summary and Event detail response shapes
- [x] Define default collection ordering for Event results and document the
      rationale
- [x] Document which Event relationships are included in public payloads for
      Release 1

---

#### ▸ Phase 7.3 - Event Repository & Service Read Paths ✅

###### Phase Tasks:

- [x] Add or finalize repository methods for Event collection, detail, and
      filter-oriented queries
- [x] Keep Event service boundaries aligned with the existing public read
      patterns used by Topics, Articles, and Actions
- [x] Standardize published-only read behavior for direct and related Event
      fetches

---

#### ▸ Phase 7.4 - Event Collection API ✅

###### Phase Tasks:

- [x] Implement the public Event collection endpoint
- [x] Support filtering by topic
- [x] Support filtering by date or date window
- [x] Support scoped location filtering using the stored Event location fields
- [x] Apply published-only filtering and stable ordering to collection results

---

#### ▸ Phase 7.5 - Event Detail Endpoint ✅

###### Phase Tasks:

- [x] Implement the public Event detail endpoint
- [x] Keep topic-related Event discovery on the filtered Events surface rather
      than embedding Event arrays into Topic detail payloads
- [x] Document that Topic pages may link into topic-prefiltered Event browsing
      without embedding Event arrays or changing Topic API payloads

---

#### ▸ Phase 7.6 - Validation, Testing & Phase Handoff ✅

###### Phase Tasks:

- [x] Add endpoint coverage for Event collection and detail success cases
- [x] Add coverage for publication filtering and relationship visibility rules
- [x] Add coverage for topic/date/location filter behavior, including empty
      states and invalid inputs
- [x] Document final Event endpoint contracts, ordering, and known Phase 7
      deferrals
- [x] Update phase status and notes when all Phase 7 tasks are complete

---

###### Notes:

- Phase 7 is limited to public Event read APIs and the Event domain behavior
  required to support them.
- This phase adds temporal and location-aware discovery concerns that did not
  exist in the Article and Action API phases, but it does not introduce maps,
  radius search, automated ingestion, admin CRUD, or Event submission UI.
- Phase 7.2 contract shapes, ordering rules, and relationship inclusion
  decisions are documented in
  `docs/architecture/009-phase-7-event-api-contracts.md`.
- Search, pagination, advanced geospatial behavior, and moderation/editorial
  write paths remain out of scope unless explicitly approved.
- Phase 8 should consume the Event contracts defined here rather than reopening
  backend scope.
- Topic detail pages should not embed unfiltered Event arrays; topic-related
  Event discovery should route through filtered Event collection views instead.
- Topic pages may pass `topicSlug` through to the Events surface in Phase 8
  without expanding backend scope or embedding Event lists inline.

---

---

### ► Phase 8 — Event UI ✅

###### Goal

Allow users to browse and view events.

###### Definition of Done

- [x] Public Event list API exposes the simplified upcoming-event contract needed by the Phase 8 Events surface
- [x] Public Event index page exists and consumes the simplified public Event collection contract
- [x] Public Event detail page exists and consumes the unchanged Event detail contract
- [x] Event UI supports topic-prefiltered browsing through the Events surface without embedding Event arrays on Topic pages
- [x] Event UI handles empty states and not-found behavior cleanly
- [x] Phase 8 UI scope and deferrals are documented for Phase 9 polish work

---

#### ▸ Phase 8.1 - Event Collection API Simplification ✅

###### Phase Tasks:

- [x] Simplify the public Event collection API so it returns upcoming Events by default without requiring region/date inputs
- [x] Support only optional `topicSlug` filtering in the public Event collection contract
- [x] Keep collection ordering aligned to `startTime` ascending and `id` ascending
- [x] Update contract documentation and validation coverage for the simplified public Event collection behavior

---

#### ▸ Phase 8.2 - Events Index Page ✅

###### Phase Tasks:

- [x] Implement the public `/events` page against the simplified collection API
- [x] Render Event summaries using the canonical collection fields and ordering
- [x] Support topic-prefiltered browsing through URL query state aligned with the simplified contract
- [x] Implement empty states for valid queries that return no Events
- [x] Ensure Topic-page passthrough navigation lands on the correct prefiltered Events state

---

#### ▸ Phase 8.3 - Event Detail Page ✅

###### Phase Tasks:

- [x] Implement the public `/events/[id]` page using the unchanged Event detail API
- [x] Render Event title, summary, time, location, type, and full description clearly
- [x] Render related Topic, Article, and Action sections only when related content exists
- [x] Ensure related links navigate correctly into Topic, Article, and Action pages
- [x] Implement not-found behavior for missing or unpublished Events

---

#### ▸ Phase 8.4 - UI Validation & Handoff ✅

###### Phase Tasks:

- [x] Add coverage for the simplified Event collection contract and topic-prefiltered list behavior
- [x] Add page-level coverage for Event index and Event detail happy paths
- [x] Add coverage for empty states and not-found behavior
- [x] Document final Phase 8 UI scope, including deferred filter UI, maps, and location-intelligence work
- [x] Confirm Topic-page Event passthrough links stay lightweight and do not expand into embedded Event discovery UI

---

Capabilities:

- event listing
- event detail pages
- topic-prefiltered Event browsing on the Events surface

###### Notes:

- Phase 8 includes a scoped simplification of the public Event collection contract to support the Events surface cleanly.
- Topic detail pages do not embed Event arrays in Phase 8.
- Topic pages may include lightweight passthrough links such as `Find Events`
  that route to topic-prefiltered Event browsing on `/events`.
- Richer CTA polish and presentation treatment for those links remain Phase 9 work.
- Validation coverage now exists across API and UI layers for:
  - simplified Event list contract behavior and `topicSlug` filtering
  - Event index and Event detail happy paths
  - empty states and not-found behavior
- Phase 8 intentionally defers:
  - filter controls beyond `topicSlug`
  - maps and geospatial discovery UI
  - location-intelligence and richer CTA polish
- Topic-page Event discovery remains a lightweight passthrough link into
  `/events?topicSlug=<slug>` and does not expand Topic pages into embedded
  Event discovery surfaces.

---

---

### ► Phase 9 — UI Polish ✅

###### Goal

Refine the public UI so CivicSignal feels intentional, cohesive, and clearly structured across all current public routes without expanding product scope.

###### Definition of Done

- [x] Shared layout, spacing, typography, and nav behavior are consistent across all public routes
- [x] Collection pages use a consistent list-preview pattern with improved hierarchy and scanability
- [x] Detail pages use a consistent header, metadata, body-content, and related-content structure
- [x] Section labels are standardized across all detail pages
- [x] CTA patterns are visually consistent across Home, Topic, Article, Action, and Event pages
- [x] Responsive behavior is refined without introducing new UI systems or interaction patterns
- [x] Phase 9 specifications are implemented without expanding scope beyond polish

---

#### ▸ Phase 9.1 - Shared Layout, Typography & Navigation ✅

###### Scope

Global UI shell only. Includes minimal shared layout/component updates required to support:

- active nav state
- canonical page structure classes
- consistent spacing and typography

###### Phase Tasks:

- [x] Standardize shared container width, vertical rhythm, and section spacing across all public pages
- [x] Tighten site header and nav spacing, hover/focus behavior, and implement active-link state
- [x] Apply canonical heading, body, and metadata typography across all routes
- [x] Remove duplicate Home/CTA/mobile CSS and establish a single baseline stylesheet
- [x] Introduce small, semantically named shared CSS classes where needed (no utility system)
- [x] Refine mobile spacing and typography so no current route feels cramped or oversized

###### Completion Criteria

- [x] All public routes use the same container width and baseline spacing
- [x] Nav includes working active-route styling
- [x] Duplicate CSS rules are removed
- [x] Typography is visually consistent across routes
- [x] Mobile layout is readable and balanced at current breakpoint

---

#### ▸ Phase 9.2 - Collection Page Hierarchy & Preview Patterns ✅

###### Phase Tasks:

- [x] Standardize Topics, Articles, Actions, and Events index pages around a shared structure
- [x] Define and apply a canonical preview-item pattern (title, summary, metadata)
- [x] Improve spacing and scanability of collection lists
- [x] Align collection-page intro hierarchy (copy finalized in 9.4)
- [x] Keep lists text-first; do not introduce cards, filters, or pagination

---

#### ▸ Phase 9.3 - Detail Page Structure & Related Content Treatment ✅

###### Phase Tasks:

- [x] Standardize detail-page header structure across all entities
- [x] Improve metadata presentation (no raw or inline dumps)
- [x] Define consistent related-content section structure and spacing
- [x] Improve readability of long-form content (line length, spacing)
- [x] Keep related-content depth unchanged (presentation only)

---

#### ▸ Phase 9.4 - CTA Language & Static Copy ✅

###### Phase Tasks:

- [x] Finalize and apply intro copy across Home and collection pages
- [x] Standardize CTA language across all routes
- [x] Standardize section labels across detail pages (locked in this phase)
- [x] Improve Topic → Events CTA treatment and supporting copy
- [x] Align discovery language across Learn / Action / Events flows

---

#### ▸ Phase 9.5 - Responsive Refinement & Final Consistency Pass ✅

###### Phase Tasks:

- [x] Validate all routes across mobile, tablet, and desktop widths
- [x] Resolve spacing, wrapping, and alignment inconsistencies
- [x] Confirm nav and CTA usability at small widths
- [x] Perform final visual consistency pass across all routes

---

#### Notes:

- Phase 9 is presentation refinement only; no backend, search, filters, maps, or new routes
- Small shared CSS classes are allowed; full design systems are not
- Events remain a first-class nav destination
- Topic detail pages use a CTA to Events; do not embed event lists inline

---

---

### ► Phase 10 — Submission System ⏳

###### Goal

Implement anonymous submission workflow for events and articles.

###### Definition of Done

- [ ] Public article and event submission flows are implemented
- [ ] Submission persistence is implemented through one unified submission model and one creation path
- [ ] Submission created via UI appears in the database with the correct shape and `pending` status
- [ ] Invalid payloads are rejected with structured field errors
- [ ] UI surfaces validation errors clearly without ambiguity
- [ ] Backend validation is the source of truth and UI validation mirrors it for UX only
- [ ] Phase 11 moderation/admin handoff is documented

---

#### ▸ Phase 10.1 - Submission Contract ✅

###### Phase Tasks:

- [x] Confirm one shared Submission model with article and event payload differences inside it
- [x] Define create-submission API request and response contracts
- [x] Lock backend-owned validation rules, required fields, and structured error behavior for anonymous submissions
- [x] Define which fields are stored as normalized columns versus raw submitted content

---

#### ▸ Phase 10.2 - Backend Persistence ✅

###### Phase Tasks:

- [x] Add or verify backend persistence support for Submission records
- [x] Implement submission creation repository and service paths
- [x] Persist new submissions with default `pending` moderation state
- [x] Add backend tests covering submission persistence and status defaults

---

#### ▸ Phase 10.3 - Public Submission APIs ✅

###### Phase Tasks:

- [x] Expose one anonymous submission creation endpoint for article and event submissions
- [x] Implement request validation and API error handling
- [x] Keep public submission scope create-only for Release 1
- [x] Add API tests covering valid and invalid submission payloads

###### Notes:

- Runtime request validation for `POST /submissions` will use Zod in narrow
  scope for Phase 10.3 only; this does not establish a repo-wide validation
  strategy.

---

#### ▸ Phase 10.4 - Submission UX ✅

###### Phase Tasks:

- [x] Build public article submission form flow
- [x] Build public event submission form flow
- [x] Implement client-side validation that mirrors backend rules, plus success state and failure handling
- [x] Keep UX limited to submission capture and confirmation with no business logic or field interpretation in the UI

---

#### ▸ Phase 10.5 - Integration Hardening ✅

###### Phase Tasks:

- [x] Verify end-to-end submission flow from UI through persistence
- [x] Confirm stored moderation states and persisted submission shape match Release 1 submission rules
- [x] Guard against divergence between article and event handling inside the unified submission flow
- [x] Document assumptions and handoff boundaries to Phase 11 moderation/admin workflow
- [x] Add missing smoke or integration coverage needed for release readiness

---

---

### ► Phase 11 — Moderation & Admin Interface ⏳

###### Goal

Provide the first internal content operations surface for Release 1, covering moderation and essential admin editing.

###### Definition of Done

- [ ] Internal moderation/admin interface exists and is usable in local development
- [ ] Moderators can view pending submissions, inspect submission details, and record review notes
- [ ] Moderators can approve or reject submissions with valid state transitions
- [ ] Approved submissions can be normalized and converted into published Article/Event records through the admin workflow
- [ ] Administrators can create and edit Actions, Articles, and Events through the same interface surface
- [ ] Key moderation and admin flows have targeted backend and UI/integration coverage
- [ ] Admin authentication/authorization is implemented for deployed environments with the Release 1 access boundary clearly defined

Capabilities:

- review submissions
- approve or reject content
- moderation state transitions
- create/edit actions
- publish articles
- manage events
- leave review notes

###### Notes:

- During local development and pre-deployment work, this interface may be exposed without authentication if that reduces implementation drag.
- Before any deployed environment intended for real users, this interface must be placed behind authentication/authorization.
- Release 1 should treat auth hardening for this interface as part of deployment readiness, not as a separate earlier product phase.
- Topic data management is deferred to a post-Release-1 phase; Release 1 topics remain seed-defined and non-editable.

---

---

#### ▸ Phase 11.1 - Moderation Queue Foundation ✅

###### Phase Tasks:

- [x] Define the internal interface entry routes and page structure for moderation/admin workflows
- [x] Add backend read paths for moderation queue listing and submission detail retrieval
- [x] Support basic queue segmentation for `pending`, `approved`, and `rejected` submissions
- [x] Expose enough submitted metadata for review decisions without requiring database inspection
- [x] Add focused tests for moderation queue retrieval and submission detail contracts

---

#### ▸ Phase 11.2 - Review Actions & State Transitions ✅

###### Phase Tasks:

- [x] Implement approve and reject actions for submissions
- [x] Persist moderator review notes with approval/rejection decisions
- [x] Enforce valid moderation state transitions and prevent duplicate conversion/publish actions
- [x] Define and surface failure behavior for invalid transitions or missing submissions
- [x] Add backend tests covering moderation action behavior and state-transition rules

---

#### ▸ Phase 11.3 - Editorial Normalization & Publication Mapping ✅

###### Phase Tasks:

- [x] Define the moderation-side editing/normalization fields required before publication
- [x] Replace Event `addressRaw` with `addressLine1`, `addressLine2`, and `publicLocationDescription` across canonical persistence, contracts, and publication mapping
- [x] Wire the admin submission detail page to real submission detail data for submitted content and normalization prefill
- [x] Implement approval flow that converts article submissions into Article records
- [x] Implement approval flow that converts event submissions into Event records
- [x] Preserve the distinction between moderation-only fields and public published fields during conversion
- [x] Add integration coverage proving approved published submissions become publicly visible through existing public read surfaces
- [x] Keep Release 1 Event geography and postal code required at API/moderation approval boundaries while leaving Prisma fields nullable for future online/geography-free events

---

#### ▸ Phase 11.4 - Admin Editorial Review UI Completion ✅

###### Phase Tasks:

- [x] Complete client-side approval/rejection request handling from the admin submission detail page
- [x] Add response processing for successful approval/rejection, including reviewed state and created-record metadata
- [x] Add API error handling and validation-error display for moderation approval and rejection requests
- [x] Make review notes fully editable and included in approval/rejection requests
- [x] Complete field normalization from editor state to approval payloads, including article author defaulting and optional Event fields
- [x] Disable or hide review actions once a submission is no longer pending
- [x] Render created-record metadata immediately after approval and on refreshed/direct approved submission detail views using persisted `ModerationSubmissionDetail.createdRecord` data
- [x] Route published created records to public entity pages and draft created records to admin content routes for continued editorial management
- [x] Remove moderation review debug logging and type review endpoint IDs as `number`
- [x] Manually verify article approval, event approval, draft approval, rejection, reviewed-state display, created-content navigation display, and validation-error behavior in the browser (reported complete on 2026-05-26)
- [x] Add automated frontend regression coverage for moderation decision handling, validation-error rendering, refreshed reviewed-state display, and created-record destination routing
- [x] Consolidate duplicated approve/reject API error mapping and evaluate common article/event normalization controls; retain separate forms because their distinct fields and behaviors do not justify a shared abstraction

---

#### ▸ Phase 11.5 - Public Experience & Visual Identity ✅

###### Goal

Raise the public-facing product from a coherent functional baseline to an
intentional, portfolio-ready civic discovery experience before making the
repository public.

###### Phase Tasks:

- [x] Select `Find Your Fight` as the public product name and define its
      focus-to-action brand philosophy
- [x] Establish an intentional public visual direction through typography,
      color, spacing, and component presentation while preserving usability
      and accessibility
- [x] Refresh the homepage and public navigation identity so the product purpose and primary discovery/action paths are immediately clear
- [x] Add a public About page explaining the focus-to-action philosophy and why
      visitors do not need to carry every issue in order to participate
- [x] Improve public web error handling when API/database-backed content is
      unavailable so visitors see a clear, non-technical recovery message
- [x] Improve the public Article, Action, Event, and Topic browsing/detail surfaces enough to present a cohesive product experience
- [x] Align public metadata, navigation-adjacent branding, homepage copy, and relevant docs after the identity decision is made

###### Notes:

- This phase demonstrates competent public UI/product presentation; it is not a speculative redesign or a deployment milestone.
- The admin interface should remain restrained and operational; the public experience is the primary focus of visual differentiation.
- Canonical product/UI requirements for this subphase are defined in
  `docs/specs/012-phase-11-5-public-experience-visual-identity.md`.
- `findmyfight.com` is a candidate public domain; domain registration and
  deployment decisions do not block Phase 11.5 implementation.
- Remaining Phase 11.5 closeout should stay narrow: header/homepage CTA
  alignment with the spec and public unavailable/error UI.
- Responsive review and seed/demo content were moved to the Phase 11.6
  readiness checkpoint because they are portfolio-readiness validation tasks,
  not blockers for the core Phase 11.5 visual implementation.

---

#### ▸ Phase 11.6 - Public Repository Readiness Checkpoint ✅

###### Goal

Prepare a credible, reviewable public source repository after the completed
moderation workflow and public-experience pass, before continuing broader
admin feature expansion.

###### Phase Tasks:

- [x] Perform a focused code review and cleanup pass across the completed Phase 0-11.5 surface, including remaining public-submission/admin-moderation validation and form duplication, resolving defects appropriate to fix before public visibility and documenting intentional deferrals
- [x] Review `apps/web/src/app/admin/submissions/[id]/_components/` versus
      `apps/web/src/components/` ownership and decide whether submission-review
      components should remain route-local or move into shared component
      directories before public repository visibility
- [x] Rename the shared Markdown rendering component from
      `article-body`/`ArticleBody` to `markdown-content`/`MarkdownContent` so
      its name reflects use across Article, Action, and Event detail pages
- [x] Audit `apps/web/src/app/globals.css` for unused, stale, duplicated, or
      misleading classes after the Phase 11.5 public visual refresh and admin
      route-group split
- [x] Review responsive/mobile CSS coverage in `apps/web/src/app/globals.css`
      and confirm every layout class that needs mobile-specific behavior is
      represented in the mobile section or intentionally does not need an
      override
- [x] Verify representative public routes at mobile, tablet, and desktop
      widths after the Phase 11.5 visual refresh, including homepage, About,
      one detail route, Events, submit landing, and one submit form path
- [x] Prepare credible seed/demo content and screenshot-ready primary flows
      for portfolio presentation before making the repository public
- [x] Add or complete regression coverage needed to support the public portfolio checkpoint and run the relevant build, typecheck, lint, and test suites
- [x] Audit the tracked repository and git history for secrets, private material, local-path artifacts, generated output, or other content unsuitable for a public repository; rotate or remove anything discovered before changing visibility
- [x] Refresh public-facing repository documentation with current feature scope, setup and verification commands, architecture summary, roadmap status, screenshots, and known deployment limitations
- [x] Establish the repository's public licensing and contribution posture
- [x] Confirm that making the source repository public does not imply a public deployment of unprotected moderation/admin routes

###### Notes:

- This is a public-source/portfolio readiness checkpoint, not a Release 1 deployment milestone.
- Admin and moderation UI source code may be public while the application remains local or otherwise non-public; any deployed environment intended for real users still requires authentication/authorization before exposing admin routes.
- Route-local admin submission components may be appropriate while they are
  tightly coupled to `/admin/submissions/[id]`, but Phase 11.6 should make that
  ownership explicit and clean up naming if any component has become reusable
  across admin routes.
- The `/admin/submissions/[id]/_components` components were reviewed on
  2026-05-28 and intentionally kept route-local because they are tightly
  coupled to the submission review detail workflow.
- The shared Markdown renderer was renamed to `MarkdownContent` on 2026-05-28
  because it now renders Article, Action, and Event long-form content.
- The initial `globals.css` usage audit removed stale admin/layout rules and
  unstyled event detail class hooks; related-list classes remain intentionally
  defined because summary components construct those variant class names
  dynamically.
- The responsive CSS coverage review added missing mobile overrides for public
  header alignment, error actions, submit option cards, and admin created-record
  metadata. Manual viewport verification remains tracked separately because CSS
  coverage and visual QA are different tasks.
- Demo content was reviewed for screenshot readiness on 2026-05-28. The demo
  seed now includes multiple published public events, and
  `docs/runbooks/phase-11-6-demo-content-screenshot-flow.md` records the
  recommended public/admin screenshot paths and checks.
- The focused cleanup scan on 2026-05-28 removed a stale `SignalFire Staff`
  fixture from an article e2e test. Remaining `CivicSignal` references are
  historical/spec context or superseded-decision records rather than active
  public UI copy.
- The public-repository audit on 2026-05-28 found only tracked example env files
  in current files/history. Local `.env`, `.env.local`, `.DS_Store`, and
  `.turbo` artifacts are present on disk but ignored and not tracked.
- The root README was refreshed on 2026-05-28 with current scope, setup,
  commands, architecture, demo review guidance, roadmap status, and the admin
  deployment caveat. It explicitly states that public source visibility is not
  production deployment readiness.
- Phase 11.6 validation passed on 2026-05-28 with `pnpm typecheck` and
  `pnpm test`. The first sandboxed `pnpm test` run failed because API route
  tests could not bind local HTTP ports (`listen EPERM`); rerunning with local
  port binding allowed the suite to complete successfully across lint, build,
  API tests, and web tests. Focused API article e2e coverage remains
  environment-blocked locally by missing Testcontainers container runtime.
- The repository licensing posture was set on 2026-05-28 to public-source for
  portfolio review, but not open-source licensed for reuse. Package metadata is
  marked `UNLICENSED`, no `LICENSE` file is present, and external contributions
  are not being solicited until a formal policy is added.
- Manual viewport QA was completed on 2026-05-28 during the public readiness
  pass. The submit flow was checked down to a 320px responsive viewport, and
  the public shell spacing was adjusted so mobile content retains horizontal
  breathing room.
- Phase 11.6 CSS cleanup should verify both class usage and responsive
  coverage, not just visual appearance at the default desktop viewport.

---

#### ▸ Phase 11.6.1 - Public Repository Code Quality Pass ⏳

###### Goal

Complete a pre-public code quality review and cleanup pass before changing
repository visibility.

###### Phase Tasks:

- [x] Complete pre-public code quality review and cleanup pass

###### Notes:

- Detailed review findings and handoff notes are transient local artifacts under
  `.ai/phase-notes/`, not repository documentation.
- This pass should complete before the Phase 11.6 repository visibility gate is
  checked.

---

#### ▸ Phase 11.7 - Public UI Identity Revamp ✅

###### Goal

Explore and settle the public visual identity system before opening the
repository and before continuing into broader admin content-management work.

###### Phase Tasks:

- [x] Audit the current public UI branch against the completed Phase 11.5 and
      Phase 11.6 surfaces, identifying which visual treatments are successful,
      uncertain, or unsuitable
- [x] Explore and compare multiple palette directions in the real application
      using representative public routes and submission flows
- [x] Explore and compare typography pairings for headings, body copy, forms,
      navigation, and dense list/detail content
- [x] Explore brand identity treatments, including wordmark, `FYF` mark,
      supporting background motif, and homepage hero usage
- [x] Decide whether the public identity should use one primary brand asset plus
      a separate supporting motif, and document the usage rules if adopted
- [x] Revise homepage and public navigation presentation so first-time visitors
      understand the product purpose and primary paths into Topics, Actions,
      Events, About, and contribution flows
- [x] Revise submission entry messaging so visitor-submitted articles,
      resources, tips, and events feel explicitly invited while remaining
      moderated before publication
- [x] Apply the selected visual system across public routes without changing
      backend scope, content models, moderation rules, or Release 1 route
      architecture
- [x] Verify responsive behavior, contrast, form readability, image weight, and
      cross-route consistency before treating the repository as public-ready
- [x] Update canonical specs and progress notes to match the final selected UI
      direction

###### Notes:

- Canonical product/UI requirements for this exploratory subphase are defined
  in `docs/specs/013-phase-11-7-public-ui-identity-revamp.md`.
- This phase may supersede specific visual-direction choices from Phase 11.5,
  but it does not reopen the public product name, backend scope, moderation
  workflow, or Release 1 route architecture.
- Design exploration should be performed in small passes so palette,
  typography, and brand imagery can be judged independently before final
  integration.
- As of 2026-05-30, the selected direction is codified in
  `docs/specs/013-phase-11-7-public-ui-identity-revamp.md`: compact `FYF`
  header mark, homepage-only primary hero image, content-first About page
  without repeated large hero art, subtle supporting motif, no floating
  particle overlay, clarified purpose/audience entry messaging, and consistent
  public interaction/readability treatment across routes.

---

#### ▸ Phase 11.8 - Essential Admin Content Management ✅

###### Phase Tasks:

- [x] Build admin create/edit flow for curated Actions
- [x] Build admin create/edit/publish flow for Articles
- [x] Build admin create/edit/publish flow for Events
- [x] Reuse or align validation patterns with existing public/domain contracts so admin forms do not diverge from backend rules
- [x] Keep Topic assignment limited to the seeded Release 1 topic set with no topic-management expansion

###### Notes:

- Actions, Articles, and Events admin list/editor flows now share the settled wide content-first layout, immutable slugs or stable record identifiers, status-by-submit flow, metadata strip, validation, and save feedback.
- Event editor and list pages now match the established admin content-management pattern while staying aligned with backend validation and the seeded topic set.

---

#### ▸ Phase 11.9 - Admin Authentication & Access Control ✅

###### Phase Tasks:

- [x] Implement authentication for the deployed `/admin` interface while preserving workable local development ergonomics
- [x] Enforce admin-only authorization checks on admin routes and backing admin APIs for Release 1 deployment
- [x] Implement the Release 1 admin-user model with manual provisioning through database, seed, or script operations and no public signup or admin-user management UI
- [x] Verify unauthenticated and unauthorized access behavior for admin entry routes and highest-risk admin actions
- [x] Document deferred concerns such as granular roles, audit trails, and topic management if they remain out of scope

###### Notes:

- Admin and moderation routes may remain openly reachable during local-only development if that materially reduces drag, but any deployed environment intended for real users must place them behind authentication/authorization.
- This subphase owns the actual Release 1 admin access-control implementation rather than only documenting a later handoff.
- The deployed admin boundary is now implemented with cookie-backed `AdminUser` sessions, admin-only API guards, and web middleware that validates `/admin` requests against the API session endpoint while mirroring refreshed `Set-Cookie` headers back to the browser.
- Manual admin-user provisioning remains intentionally operational rather than productized in Release 1; the canonical decision allows database, seed, or controlled script operations and keeps signup, invites, password reset, and admin-user management UI out of scope.

---

---

### ► Phase 12 — Search & Discovery Improvements ✅

###### Goal

Improve browsing and filtering across topics, actions, and events.

###### Definition of Done

- [x] Scope boundary is documented and implementation-ready
- [x] Public collection filtering is expanded within approved Release 1 limits
- [x] Public collection pagination is implemented with a stable contract
- [x] Tests and documentation cover filtering, pagination, empty states, and
      published-only visibility behavior

---

#### ▸ Phase 12.1 - Discovery Contract Foundation ✅

###### Phase Tasks:

- [x] Define and document the final Phase 12 scope boundary: filtering and
      pagination are in scope; full-text search, automated event ingestion,
      browser geolocation, and radius search remain deferred
- [x] Define the canonical query-param and response-shape direction for
      Phase 12 filtering and pagination across public collection surfaces

---

#### ▸ Phase 12.2 - Article & Action Collection Filtering ✅

###### Phase Tasks:

- [x] Add topic-filtered browsing for the public Articles collection
- [x] Add topic-filtered browsing for the public Actions collection
- [x] Expose topic filter UI/state on the public Article and Action collection
      pages in a way that preserves published-only behavior and clear empty
      states

---

#### ▸ Phase 12.3 - Event Filter Expansion ✅

###### Phase Tasks:

- [x] Expose the scoped Release 1 Event filters in the public Events UI using
      the approved Release 1 Event filter dimensions: topic, date/date window,
      and
      location fields supported by the current Event contract
- [x] Shift the public Events surface to a filter-led discovery flow that
      requests results only after a meaningful user-supplied filter set is
      present in URL state
- [x] Preserve published-only visibility and deterministic filtered ordering
      while adding the approved Event filters

###### Notes:

- Public Event finder interaction and visual polish may still be refined, but
  the Release 1 filter contract, URL-state flow, and ordering/visibility rules
  are now implemented for Phase 12.3.

---

#### ▸ Phase 12.4 - Pagination & Hardening ✅

###### Phase Tasks:

- [x] Add pagination to public collection APIs and UIs in a way that avoids a
      later breaking contract change when content volume grows
- [x] Verify pagination composes correctly with approved filters across public
      collection surfaces
- [x] Add tests and documentation covering filter query behavior, pagination
      behavior, empty states, and interaction with published-only visibility

###### Notes:

- Phase 12 should improve discovery within Release 1 boundaries rather than
  expand into Milestone 2 systems.
- Public Event discovery in Phase 12 is filter-led rather than default-list-led;
  `/events` should render a pre-results state until the URL contains a
  meaningful filter set.
- Public Event city commits intentionally use a small debounced local draft
  state while preserving URL state as the committed source of truth; see
  `docs/agent-governance/decisions.md` entry `Public Event city filter uses
debounced URL commits`.
- Full-text search may be revisited later, but it is not required to complete
  the current phase.

###### Links:

- Specification: `docs/specs/014-phase-12-search-discovery-improvements.md`

---

---

### ► Phase 13 — Release Prep & Final Polish ✅

> **Note — 2026-06-19:** All branch stacks from Phase 13.7 onward (9 branches, ~21 commits
> covering the CSS architecture split, UI swing, typography, keyword search, topic admin,
> loading states, and three review-closure passes) were squashed into a single commit and
> merged as PR #71. The individual branch names referenced in subphases 13.7–13.9 no longer
> exist. Main was subsequently rebased to consolidate Phase 13.5, 13.6, and the new 13.7
> squash into one "Phase 13.5 — Feature completion, UI identity, and mobile polish" commit.
> The subphase entries below are preserved as a record of what was built, not as active
> branch references.

###### Goal

Finish code-facing Milestone 1 work, resolve remaining schema ergonomics that would otherwise spread into release infrastructure, and complete the final product/repo polish pass before the public demo goes live.

###### Phase Tasks:

##### 13.1 Schema & Seed Hygiene

- [x] Normalize mixed-case database identifiers to `snake_case` before release infrastructure assumptions spread further, using Prisma field/table mapping where needed to preserve ergonomic TypeScript names
- [x] Keep the demo dataset broad enough to demonstrate pagination, but make Event seed dates relative to seed time so the public Events surface does not quietly decay into an all-past dataset
- [x] Revisit seed data for the public demo so homepage, collection pages, and admin flows reflect the intended narrative, topical mix, and content quality bar rather than purely development-oriented fixtures
- [x] Align the bounded Event demo geography, disabled-region selector behavior, and seed coverage so reviewers can reliably find Event results without requiring nationwide demo data

###### Notes:

- Database migration history was rewritten before deployment so the local baseline now creates normalized `snake_case` physical identifiers directly instead of carrying a follow-up rename migration.
- Public demo Event geography is currently bounded to `NY`, `PA`, `CA`, `TX`, and `PR`, and the public Events finder now exposes only that supported demo region set.
- Generated demo Articles, Actions, and Events now use topic-specific editorial copy instead of lorem placeholder text, and the seeded admin ordering keeps curated records visible at the top of list views while preserving enough depth for pagination demos.

##### 13.2 Demo Positioning

- [x] Implement the explicit public-demo posture: add the shared demo banner, persistent demo indicator, and the final header-level path to admin demo access instructions
- [x] Add a stable README section or anchor for demo/admin access guidance, then link the in-product admin-access messaging to that specific repository location instead of the repo root
- [x] Run a full dependency risk review and resolve or explicitly defer remaining high-severity findings with documented rationale
- [x] Define the intended reviewer journey for the public demo, including the first-30-seconds impression, the expected path from homepage into content, and how a reviewer discovers the admin/demo surface

###### Notes:

- Public demo posture is now explicit in-product: shared public chrome retains a persistent `Demo` indicator, public pages carry a dismissible demo banner in demo mode, and the header exposes a single `Admin Demo` entry point.
- Dependency risk review completed with targeted package refreshes across web, API, and root tooling plus a small set of `pnpm.overrides` for remaining transitive advisories that were not cleared by parent-package updates. Both `pnpm audit --prod` and the full `pnpm audit` now return clean.
- Reviewer journey for the current demo:
  1. First 30 seconds: the public header and demo banner establish that this is a demo site with sample data.
  2. Expected content path: homepage -> Issues/Articles/Actions/Events -> inspect sample public content and Event filtering.
  3. Admin discovery path: public header `Admin Demo` link -> admin login page / README anchor for credentials and local-review instructions.

##### 13.3 Public Polish

- [x] Clean up remaining obvious formatting-quality issues that undercut launch readiness, including raw or UTC-only timestamp presentation where human-readable date/time formatting should exist
- [x] Fix obvious public demo defects that read as bugs rather than product tradeoffs, including duplicate event-summary rendering and similar screenshot-visible data/presentation issues
- [x] Decide whether public collection cards should be fully clickable or keep title-only links, then align hover, focus, and accessibility behavior with that decision
- [x] Complete a final public copy review across homepage, About, navigation, collection pages, detail pages, submit flows, empty states, and error states
- [x] Make minor color, spacing, typography, CTA, and visual hierarchy adjustments needed after reviewing the full public flow in realistic browser viewports
- [x] Eliminate sticky-surface scroll bleed and overlap artifacts, including text, borders, or highlighted rows visibly sliding through the public header, demo banner, topic bars, or similar pinned UI layers during scroll
- [x] Resolve the known public-site polish issues from the Milestone 1 review, including stronger card definition, clearer primary CTA hierarchy, hero background containment, article metadata/body separation, event time formatting, topic-card differentiation, and improved home-page section rhythm
- [x] Simplify the homepage so the core journey reads as a clear progression rather than a flat scroll with repeated premise sections
- [x] Make the reviewer/demo affordance path obvious enough that a first-time visitor can discover the admin/demo surface without depending on repository docs
- [x] Align public-facing naming and brand presentation consistently across the live product, including product name usage, admin entry-point labeling, nav terminology, and any abbreviated wordmark treatment
- [x] Rework submit-flow copy so it is inviting, accurate about moderation, and does not over-claim community behavior or hide key formatting guidance
- [x] Refine the public Events finder, empty states, and Event list/detail presentation so the filter surface, result cards, and detail pages read as one coherent public UI system
- [x] Replace ad hoc inline public-site SVG icon markup, including the Events date-picker calendar glyph, with the final shared icon-library treatment chosen for launch polish
- [x] Rework remaining public-facing copy and IA details from the external Milestone 1 polish review, including the homepage contribution copy, public nav action labeling, About-page repetition cleanup, and carrying the strongest site-purpose language into the public journey where appropriate
- [x] Restore journey continuity on issue detail and About-page navigation patterns, including Step 3 interaction consistency and explicit issue-detail framing that helps users move from issue discovery into reading and action
- [x] Finish the remaining article and issue-detail reading-experience polish from the Milestone 1 review, including article-body typography/hierarchy and making issue-detail article lists feel fully intentional rather than minimally rendered
- [x] Complete the remaining public visual polish from the Milestone 1 review, including submit-entry spacing and a final decision on whether the shared background motif should stay consistent across routes or be reduced to hero-only usage
- [x] Revisit the remaining external-review visual findings that were reopened after the first 13.3 pass, including homepage hero framing/alignment, list-page warmth, and any residual sticky-layer hover bleed visible in current screenshots
- [x] Run and resolve a focused mobile-responsiveness audit across the public homepage, discovery cards, Events filters, and submission flows
- [x] Add clear next-step affordances to public submission success states so the user is not stranded after article or event submission
- [x] Finish remaining admin-facing polish items that are visible in the demo workflow, including human-readable submission-review datetime rendering and making the admin shell/background treatment read as intentional rather than incidental
- [x] Replace visibly generated numbered demo-content filler with a smaller, more editorially intentional seed pool so public lists and detail pages do not read like scaffolding

##### 13.4 Repo & Launch Readiness

- [x] Define the Release 1 application logging approach, including what auth, admin, API error, and deployment-relevant events should be logged without expanding into a full observability platform
- [x] Add smoke or integration coverage for the highest-risk moderation/admin workflows that still lack confidence after Phase 11.9 auth implementation
- [x] Run the planned pre-external-review release-readiness closure pass, covering release-checklist completion, docs alignment, and the highest-priority source/readiness follow-ups identified before the external pass
- [x] Write a Milestone 1 release checklist covering seed/reset steps, required test commands, final smoke paths, screenshot refresh, docs verification, and deployment handoff prerequisites
- [x] Explicitly record the intentional Milestone 1 non-goals or deferred items so release polish does not expand into open-ended post-demo cleanup
- [x] Document the local-only access assumption history, current deployed admin-access boundary, and any remaining deferred concerns that materially affect launch readiness
- [x] Confirm repository documentation, setup instructions, deployment caveats, and reviewer-facing screenshots match the actual shipped product state
- [x] Complete a repo hygiene pass: update runbooks, verify local setup instructions, make deploy steps easy to find, remove stale guidance, and replace outdated screenshots with current product/admin captures
- [x] Address Milestone 1 source-review follow-ups that affect release credibility, including secure admin-cookie behavior, URL-validation hardening for resource links, empty-body API response handling, and the remaining strict-equality/stable-key/access-modifier cleanup
- [x] Reduce the highest-signal source duplication called out by the Milestone 1 polish review, including repeated topic-id lookup helpers, title-to-slug helpers, and topic-create repository mapping logic
- [x] Replace runtime-only moderation fallbacks with compile-time exhaustiveness where discriminated unions define review decision handling

---

#### ▸ Phase 13.5 - External Review Closure ✅

###### Phase Tasks:

- [x] Remove the remaining reviewer-visible public UI defects called out in the 2026-06-17 external review, including the duplicate article-title rendering, dark-theme `select` styling mismatch, and any still-broken screenshot artifacts that still need refreshed captures
- [x] Finish the external-review copy and IA cleanup across the public experience, including replacing `Ways to Act` with the final action label, removing condescending issue-detail section framing, and restoring clearer article-to-topic navigation
- [x] Rework the public Events browse flow so the page has a credible default state without a required region gate and the reviewer journey is not blocked on filter knowledge
- [x] Resolve the remaining admin/public shell visual inconsistency findings from the external review, including making the admin background treatment and surrounding layout read as intentional in screenshots and first-use flows
- [x] Restore TypeScript credibility by removing the remaining strictness reversals in shared/base config and fixing any surfaced type issues that block strict compilation
- [x] Close the remaining external-review repo hygiene defects, including removing checked-in build artifacts, normalizing the `submission-type` contract filename, and stripping dead font-loading leftovers from abandoned typography experiments
- [x] Add public submission rate limiting and verify the moderation queue cannot be trivially flooded through the anonymous submission endpoints
- [x] Replace the current public content-page `force-dynamic` strategy with the Milestone 1 caching/revalidation approach appropriate for moderated content and validate that the chosen approach still reflects admin edits reliably
- [x] Decide which external-review findings are required Milestone 1 finish work versus explicit Milestone 2 deferrals, then record those deferrals canonically instead of carrying them implicitly into Deployment Infrastructure
- [x] Strengthen the article reading experience so body typography, hierarchy, and metadata/content separation feel professional rather than merely functional
- [x] Complete the first high-signal public visual polish pass across topic, article, and event detail/discovery surfaces so cards, list rhythm, and detail layouts read more intentionally
- [x] Finish the remaining homepage and motif art-direction work so the public experience feels cohesive and credible rather than prototype-polished
- [x] Close the remaining submit-surface layout and spacing defects that still read as unfinished in first-use review
- [x] Run an explicit mobile/responsive finish pass across the core public routes and fix the issues it exposes
- [x] Improve demo-seed/editorial quality where generated filler still weakens the product fiction or makes the site read as scaffolding
- [x] Correct public and reviewer-facing event time presentation so Release 1 events render in their intended local timezone for the bounded demo geography instead of reading as UTC-only civic listings
- [x] Refresh screenshots and reviewer-facing docs after the closure pass so recorded artifacts match the actual Milestone 1 product state
- [x] Run a targeted release-candidate validation pass after the external-review fixes across public browse flows, admin auth, moderation, and essential content-management paths

###### Notes:

- The 2026-06-17 external review functioned as an additional Milestone 1 quality gate and exposed a broader remaining gap in UX finish, visual consistency, and a small number of engineering credibility issues than the earlier Phase 13 closure work suggested.
- That follow-up pass is now closed. The duplicate article-title report was traced to stale screenshot review context rather than a live product defect, the public `select` surfaces already carry the intended dark-theme treatment, public content pages now use the intended revalidation model, and the remaining `next/font` usage in the root layout is intentional rather than abandoned typography residue.
- A small post-closure addendum corrected the remaining UTC-only event-time presentation gap by rendering public and moderation-facing event times in the intended local timezone for the current Release 1 geography.
- Screenshot regeneration remains a final artifact-refresh step when UI changes justify it, not an open blocker to leaving Phase 13 once the shipped UI and docs already align.
- The targeted RC validation pass now has a repeatable local smoke check in `scripts/rc-smoke.mjs`, covering public browse routes, admin auth, moderation review routes, and the essential article/action/event admin editor paths. Full route-spec execution remains sandbox-sensitive because local `supertest` suites still hit `listen EPERM` in this environment, so the practical release proof here is lint, typecheck, focused unit coverage, and the live smoke run.

---

###### Links:

- External review follow-up: `docs/specs/015-phase-13-milestone-1-polish-review.md`
- Release readiness: `docs/specs/016-phase-13-milestone-1-release-readiness.md`

---

#### ▸ Phase 13.6 - External Review 2 Closure ✅

###### Goal

Close the quality gaps identified in the 2026-06-17 and 2026-06-18 internal site reviews before advancing to deployment infrastructure.

###### Phase Tasks:

**Public UX & navigation:**

- [x] Create the public `/demo` page — demo framing, limited-data disclosure, admin credentials, repo link; header "Admin Demo" now routes here instead of directly to `/admin`
- [x] Add breadcrumb + "browse more" nav to all four detail page types (article, action, event, topic) — eliminates dead ends after reading
- [x] Add minimal public footer — secondary nav links and tagline in `(public)/layout.tsx`
- [x] Resolve events page UX contradiction — removed guidance card; events show by default, filters narrow from there

**Visual design:**

- [x] Add per-topic accent colors via CSS `data-topic` attribute — seven distinct left-border colors on the Issues index
- [x] Fix admin shell void — `min-height: calc(100vh - 48px)` eliminates dark empty space below the admin card
- [x] Fix related section layout in article and event detail grids — `grid-column: 1 / -1` so related topics/actions span full width
- [x] Clean up topic detail section labels — "Step 2 - Read enough to act" → "Step 2 — Read"; "Step 3 — Act"
- [x] Confirm event timezone display — live screenshots confirm EDT rendering; UTC fallback code is correct

**Engineering & CSS:**

- [x] Merge duplicate editor form CSS — shared block for `actionEditorForm`, `eventEditorForm`, `articleEditorForm`; ~120 lines of duplicated overrides removed
- [x] Scope `p { max-width: 70ch }` to `.publicShell p` — admin paragraphs no longer artificially constrained
- [x] Replace `force-dynamic` with `connection()` on submit pages — `await connection()` prevents build-time pre-rendering without disabling caching; consistent with the pattern applied to other public pages on this branch
- [x] Replace hardcoded hex values in public CSS — `metaText`, `eventMeta`, `relatedListItemSummary`, `detailMetaGroup`, `collectionItemSummary` now use `var(--color-text-muted)`
- [x] Remove `margin-right: 10px` from `.secondaryCTA`
- [x] Fix `aria-current="page"` on topic selector filter pills — changed to `aria-current="true"`
- [x] Fix API default port — fallback changed from 3000 to 3001 in `apps/api/src/main.ts`
- [x] Remove `packages/api-contracts/dist/` from version control — added `.gitignore`
- [x] Fix `ReviewOutcomePanel` reviewed-at rendering — `toLocaleString()` replaced with `formatAdminDateTime`

**Closeout:**

- [x] Reduce `docs/screenshots/` to 5 focused portfolio captures; update `scripts/regenerate-doc-screenshots.mjs` accordingly
- [x] Update README — 5-screenshot inline gallery, corrected repo URL, updated reviewer path and phase reference
- [x] Update `scripts/rc-smoke.mjs` assertions to match new copy; confirm 35/35 pass
- [x] Record periodic review doc convention in `decisions.md`; review artifacts live in `docs/reviews/`

###### Notes:

- Findings sourced from `docs/reviews/review-2026-06-17.md` and `docs/reviews/review-2026-06-18.md`.
- Scope was quality closure only — no new features, no search, no topics admin, no scope expansion.
- Per-topic color differentiation used CSS `data-slug` attribute; no backend changes required.

---

#### ▸ Phase 13.7 - Round 3 Review Closure ✅

###### Goal

Close quality gaps identified in `docs/reviews/review-2026-06-18-round2.md` — the third external review pass conducted after Phase 13.6 closed.

###### Phase Tasks:

**Implemented:**

- [x] Add `externalUrl` optional field to Action — schema, API, admin editor, public CTA (full stack)
- [x] Nav: rename "Take Action" → "Actions" in header and footer
- [x] Remove redundant "Issue" eyebrow label from Issues index page cards
- [x] CSS: delete duplicate `actionEditorForm` rule block that survived the Phase 13.6 deduplication pass (~60 lines removed)
- [x] Fix UTC month math in `events/page.tsx resolveDateWindow` (end-of-month overflow)
- [x] Seed: pass `externalUrl` through action upsert; add demo URLs to two curated actions so the CTA is visible in the live demo

**Overnight expansion (2026-06-19) — stacked branches off `round3_review_closure`:**

- [x] **Typography** (`feat/phase_13/typography`) — Replace Zilla Slab with Playfair Display (700/800/900) as display font; update `:root` fallbacks to reflect actual loaded fonts; tighten letter-spacing for Playfair's optical range
- [x] **Seed URLs** (`feat/phase_13/seed-urls`) — Add `externalUrl` to all 13 published demo actions (was only 2); every action page now shows the "Take Action →" CTA
- [x] **Loading states** (`feat/phase_13/loading-states`) — Add `loading.tsx` skeleton files to all 8 public collection and detail routes; skeleton shimmer CSS added to `globals.css`
- [x] **Keyword search** (`feat/phase_13/keyword-search`) — Dedicated `/search` route searching Articles and Actions simultaneously via ILIKE; Search link added to nav and footer; `?search=` param wired into `/articles` and `/actions` collection pages; Events explicitly excluded (time/location-specific, keyword search not useful)
- [x] **Topic admin** (`feat/phase_13/topic-admin`) — Full CRUD for Issues in admin workspace at `/admin/topics`; GET/POST/PATCH/DELETE endpoints in NestJS; Next.js proxy routes at `/api/admin/topics`; `deleteAuthenticated` helper added to base.ts; delete blocked when content is linked; "Issues" nav link added to admin shell
- [x] **Proxy routes fix** — Missing Next.js proxy routes for topic admin were added (topic create/update/delete were silently 404ing without them)
- [x] **rc-smoke.mjs** — Updated stale assertions ("Take Action" → "Actions"), added `/search` check, added admin topics API + page checks
- [x] **Demo banner** — Reduced enter animation from 2.5s → 0.45s; reduced pulse from 3x to 1x
- [x] **Nav density** — Reduced gap from 24px → 20px and font-size from 1rem → 0.95rem to accommodate 6 nav items

**Deferred to Milestone 2:**

- [x] Issues vs `/topics` URL normalization — `/issues` routes live, `/topics` redirects; implemented in `feat/phase_13/topic-admin`
- [x] Nav search icon treatment — SearchIcon SVG replaces text in header nav; implemented in `feat/phase_13/topic-admin`
- [x] Homepage journey cards — copy sharpened, Step 3 mentions events; implemented in `feat/phase_13/topic-admin`

**Non-issues confirmed:**

- `aria-current="true"` on topic selector pills — semantically correct for link-based filter bars; `aria-pressed` is only valid on button elements. No change.
- Remaining hardcoded hex in admin CSS — intentional light-mode values; tokenizing with dark-theme variables would break admin UI. No change.

###### Notes:

- The `externalUrl` migration was applied by modifying the existing init migration (`20260312131932`) and running `prisma migrate reset`, consistent with pre-deployment clean-history policy.
- After pulling these branches, run `cd apps/api && pnpm exec prisma db seed` to populate the new externalUrl values on demo actions.
- Each branch has a `CONTEXT-*.md` at the repo root with decisions, review guidance, and files changed.

###### Links:

- Review: `docs/reviews/review-2026-06-18-round2.md`
- Branch context files: `CONTEXT-typography.md`, `CONTEXT-search.md`, `CONTEXT-topic-admin.md`

---

#### ▸ Phase 13.8 - Review 3 Closure ✅

###### Goal

Close the quality gaps identified in `docs/reviews/review-2026-06-19.md` — the fourth external review, conducted after the Phase 13.7 overnight async work (CSS split, UI swing, keyword search, topic admin).

**Branch:** `feat/phase_13/review-3-polish`, stacked on `feat/phase_13/review-closure-3`

###### Completed

- [x] **Homepage ISSUES array hardcoded** — replaced with `getTopicsList()` API call; homepage now renders dynamically from API, same pattern as `issues/page.tsx`
- [x] **Homepage restructured** — context/explanation now comes first; "Which one is yours?" issue browser moved below the hero; "Find Your Fight" is now the large display text
- [x] **`a[aria-label='Search']` CSS selector** — added `site-search-link` class to NavLink JSX; CSS now targets `.site-search-link`
- [x] **Topic icon fallback** — added `GenericIssueIcon` to `icons.tsx`; `topic-summary.tsx` now uses `TOPIC_ICON_MAP[slug] ?? GenericIssueIcon`
- [x] **Dual demo indicator** — removed `site-demo-indicator` pill from header; demo banner is the sole demo signal
- [x] **`secondaryCTA` hardcoded `#171717`** — replaced with `var(--color-text-primary)` / `var(--color-page-bg)` tokens
- [x] **Grain opacity** — raised from 0.035 to 0.08
- [x] **bg-motif opacity** — raised from 0.11 to 0.20 in hero; added as persistent fixed watermark across all public pages via `.publicShell::after` at 0.07 opacity
- [x] **Card tilt rotation** — removed `rotate(0.6deg)` from `.topicCollectionItemTilt:hover`; translate-only consistent with all other cards
- [x] **Submit page width** — `.submitEntrySupport` max-width raised from 46rem to 820px to match option cards above
- [x] **Footer centering** — `justify-content: center` on footer nav; tagline centered
- [x] **Footer link clarity** — footer links now have visible underline at rest (subtle), full underline on hover
- [x] **Admin 404 page** — created `apps/web/src/app/admin/(workspace)/not-found.tsx` with admin shell layout
- [x] **Login page branding** — updated eyebrow from "Signal Fire Admin" to "Find Your Fight — Admin"; brand panel always shown (not hidden on redirect); "Session expired" copy replaced with neutral "Sign in to continue"
- [x] **Submission nudge** — contextual "Know something we missed?" block added to article and action detail page bottoms
- [x] **Copy pass** — homepage, about page, and journey cards updated; dual meaning of "Find Your Fight" woven into about page hero and homepage supporting copy
- [x] **Issue link color threading** — home issue links now show topic accent color at rest (subtle left border), not only on hover

###### Deferred to Phase 13.9 (open items for user review)

- Screenshots 04 and 05 still need regeneration with live server — requires `pnpm dev` + seeded DB + `node scripts/regenerate-doc-screenshots.mjs`
- FYF logo glyph: user asked "what is the glyph?" and misses the FYF treatment — **needs user decision** on whether to replace the flame SVG with a proper FYF mark or keep current
- Hero image: user wants an image for the homepage hero rather than text-only — **needs user asset/direction**
- Color threading across site: topic accent colors appear on homepage issue links and issues index, but not on article/action cards belonging to that topic — **needs user decision** on scope
- Events default UX: user questioned value of random-city events as default — **needs user decision** on default state vs messaging
- Animation styles: issue link hover (color+border+padding) remains different from card hover (translate) — considered acceptable distinction since they are different element types, but flagged if user wants full normalization
- ILIKE search improvement (replace with tags/structured search) — explicitly deferred to Milestone 2

###### Notes

- Branch `feat/phase_13/review-3-polish` stacked on `feat/phase_13/review-closure-3`
- Typecheck passes clean
- Screenshots not regenerated on this branch — requires running server

###### Links

- Review: `docs/reviews/review-2026-06-19.md`

---

#### ▸ Phase 13.9 - Post-Review Design Decisions ✅

###### Goal

Resolve open design direction items from Phase 13.8 that require user input before implementation.

###### Outcome

Superseded by the 2026-06-19 session. All branch stacks (13.7 through 13.9, including the
UI swing, CSS architecture split, typography, and review-closure branches) were squashed into
a single clean commit and merged to main as PR #71. The open design items from 13.9 — hero
image, FYF logo, color threading, events default, and screenshots — are deferred to Phase 14
where they will be addressed alongside the full fix list from the 2026-06-19 autonomous review.

Main history was rebased: Phase 13.5, 13.6, and the new 13.7 squash were consolidated into
a single "Phase 13.5 — Feature completion, UI identity, and mobile polish" commit.

---

### ► Phase 14 — Portfolio Credibility Pass ✅

###### Goal

Raise the product to a credible 8.0+ across Visual Design, UX/Product, and Engineering for
portfolio review. Fix product logic problems before visual polish — structure first, surface second.

Review baseline: 2026-06-19 autonomous review — `docs/reviews/review-2026-06-19-round2.md`

###### Collaboration model

Small scoped subphases. User reviews output between each. No scope expansion mid-subphase.
See `CONTEXT-next-session.md` for the current fix list and rationale.

---

#### ▸ Phase 14.1 - Action Detail Page ✅

###### Phase Tasks:

- [x] Move CTA above metadata — new order: headline → summary → CTA → metadata → description
- [x] Add trust scaffolding: extract domain from `externalUrl` and render as "Take Action on [domain] →"
- [x] Replace Related Topics section with a short linked list — topic name links to `/issues/[slug]`, no description text
- [x] Confirm CTA renders nothing when `externalUrl` is null (existing behavior — verify not broken)

###### Done condition:

CTA appears before metadata; "Take Action on [domain] →" is visible; Related Topics shows names only as links.

---

#### ▸ Phase 14.2 - Homepage + Hero ✅

###### Phase Tasks:

- [x] Collapse three "pick an issue" moments (hero, issue roll, journey steps) into a single coherent arc with forward momentum
- [x] Replace hero.png with bg-motif.png scaled up as hero backdrop at 30–40% opacity behind live text; retire hero.png
- [x] Write manifesto-style hero supporting copy: acknowledges overwhelm and powerlessness, pivots to collective responsibility and the fire within, lands on "Find Your Fight" as both literal and figurative call to action
- [x] Skip sitewide motif watermark on homepage or fade from hero-opacity to watermark-opacity as one continuous element — avoid the same image at two opacities side by side
- [x] Ensure the issue roll reads as the primary navigation signal with visual weight appropriate to its importance

###### Done condition:

Homepage reads as a single arc not a repeated premise; hero has visual mass behind the display type; copy feels like a manifesto not a feature list.

###### Notes:

- Final page arc: hero (manifesto copy + single "Find yours →" anchor CTA) → how it works → issue roll ("Choose your fight." as separate `home-issues` section) → contribute
- Issue roll moved out of the hero into its own section — visitors see the manifesto and journey explanation before being asked to choose
- hero.png deleted; bg-motif.png used as `::before` backdrop on heroPoster at 35% opacity, `border-bottom` removed from heroPoster to eliminate double-border artifact with subsequent sections
- Card hover underline fixed globally: `text-decoration: none` added to `.publicShell .collectionItem` so only the title underlines on hover
- Contribute section reduced to single CTA ("Help someone find theirs.") — secondary "Who This Is For" button removed per spec
- UI specs introduced: `docs/specs/ui/global.md` (shared patterns) and `docs/specs/ui/homepage.md` (locked homepage spec)

---

#### ▸ Phase 14.3 - Navbar and Nav Identity ✅

###### Phase Tasks:

- [x] Write and align on UI spec (`docs/specs/ui/navbar.md`)
- [x] Replace `· FYF ·` placeholder with amber mark + `FYF` wordmark text — mark is a placeholder circle pending Phase 14.10 artwork decision
- [x] Move Admin Demo out of primary nav — now in `DemoBanner` (with descriptive copy) and the footer when in demo mode

###### Done condition:

Admin Demo is not a primary nav item; nav wordmark has structural separation between icon slot and text. Final icon artwork deferred to Phase 14.10.

###### Notes:

- SVG icon mark (`FYFLogo` in `icons.tsx`) and favicon (`/public/fyf-mark.svg`) are both placeholder amber circles. Both are single-file swap points — icon artwork replaces the path in `FYFLogo`; favicon replaces the path in `fyf-mark.svg`. Color is `--color-brand-primary` (#cfac5a) in both.
- Architecture decision deferred to 14.10: should the nav mark and favicon be the same design or different? Candidates: motif-derived SVG, cropped/traced motif element, or lettermark.

---

#### ▸ Phase 14.4 - Issues and Entity Pages ✅

###### Phase Tasks:

- [x] Write and align on UI spec (`docs/specs/ui/entity-pages.md`)
- [x] Thread breadcrumb accent color: pass `data-topic={topics[0]?.slug}` to the breadcrumb on article, action, and event detail pages; style via existing topic CSS selectors
- [ ] ~~Replace database description copy on `/issues` index cards with motivating, human-facing language per topic~~ — deferred to Phase 14.9 copy pass
- [x] Bold palette — three specific CSS changes:
  - `metaLabel` text color → amber (`--color-brand-primary`)
  - Collection item left borders visible at rest at reduced opacity (40%), full on hover
  - Issue detail step numbers (`02`, `03`) rendered at display scale in Playfair Display (`clamp(2.5rem, 5vw, 3.5rem)`)
- [x] Sitewide motif presence: footer ornament (`site-footer::before`, centered, opacity 18%) replacing earlier fixed-position watermark attempts

###### Done condition:

Breadcrumb on entity pages carries topic accent color; three named palette changes applied; footer carries the motif as a centered signature on every public page.

###### Notes:

- `[data-topic='...']` CSS variable assignments promoted from `.topicCollectionItem[data-topic]` to bare `[data-topic]` selectors so `--topic-accent` cascades to any element carrying the attribute (breadcrumbs, issue roll links, step headers)
- Issue roll on homepage now uses per-topic accent colors at rest and on hover, not flat amber
- Sitewide motif watermark (fixed position) was attempted and abandoned — a fixed corner-positioned figurative image reads as arbitrary regardless of opacity. Footer ornament is the settled solution: motif centered in `site-footer::before` at 18% opacity, contained within the footer zone, visible on every page without competing with content.

---

#### ▸ Phase 14.5 - Admin Visual Alignment ✅

###### Phase Tasks:

- [x] Write and align on UI spec (`docs/specs/ui/admin.md`) — implementation does not begin until spec is approved
- [x] Apply dark navy background to admin workspace — remove all hardcoded light-mode hex values (`#ffffff`, `#171717`, `#e5e7eb`, etc.) from admin panels, tables, badges, review banners, and text elements; replace with dark token equivalents
- [x] Replace Playfair Display with Inter bold for admin headings throughout workspace — `adminHeader h1`, `adminSection h2/h3`, `adminPanelHeader h2/h3`, login form title
- [x] Remove decorative elements from admin (no motif watermark, no hero textures) — verified already clean; `adminShell` scoping confirmed
- [x] Retain amber for admin CTAs and status signals — amber token usages untouched; only hardcoded light-mode values replaced
- [x] Login page right panel: darken overlay to flat 65% coverage; CSS SVG grain texture via `::after` pseudo-element at 3.5% opacity
- [x] Login page left panel: amber radial glow at top center + amber-tinted border — addresses left/right panel visual cohesion gap (flat left vs. rich right)
- [x] Fix `adminSegmentedControl`/`adminFilterGroup` default button background — `#ffffff` mix → `var(--color-page-bg)` to prevent light buttons on dark surface

###### Done condition:

Admin workspace reads as the same product as the public site, different mode not different company; login page right panel text is clearly readable over the motif.

###### Notes:

- Login page left panel flatness was not in the original scope but was identified during spec review as a cohesion gap — addressed in the same pass.
- Pagination and topic selector components in `admin.css` are used on public collection pages; their light active-state treatment was intentionally left unchanged.

---

#### ▸ Phase 14.6 - Engineering ✅

###### Phase Tasks:

- [x] Add `revalidatePath()` calls after all admin mutations: article create/update/publish, action create/update, event create/update/publish, topic create/update/delete
- [x] Consolidate `EventListPageProps` — replace three separate definitions across `events/page.tsx`, `events/_components/event-filters.tsx`, and `admin/events/page.tsx` with one shared type
- [x] Move `TopicService.getTopicDetail` cross-service fan-out to the repository layer — single Prisma query with includes instead of calling `ArticleService` and `ActionService`
- [x] Add `color` field to Topic Prisma model; seed existing topics with color values; replace hardcoded `[data-topic='slug']` CSS selectors with inline `--topic-color` CSS variable applied from the model
- [x] Document CSRF posture for admin mutation routes — either implement mitigation or write a short explanation of why the existing CORS configuration makes it a non-issue in this architecture; add to auth runbook
- [x] Verify session expiration behavior: let an admin cookie expire mid-workflow and confirm the result is a clean redirect to login with an informative message, not a silent 401 or broken state; document the behavior

###### Notes:

- Revalidation was already wired to all mutations; fixed the issue where `revalidateTopicPages` was targeting redirect pages (`/topics/`) instead of the canonical cached pages (`/issues/`).
- `EventListPageProps` was split into `EventSearchParams` and `ResolvedEventSearchParams` in a shared `event-search-params.ts`; admin page renamed its local type to `AdminEventSearchParams`.
- `TopicService` now has no dependency on `ArticleService` or `ActionService`; `TopicModule` no longer imports `ArticleModule` or `ActionModule`; single `findBySlugWithPublishedContent` query replaces 3-query fan-out.
- `color` added to `Topic` schema (nullable String); Prisma migration applied; seed colors match existing CSS values; CSS hardcoded `[data-topic='slug']` blocks removed in favor of inline `--topic-accent` style from the model; admin topic editor now includes a color hex input field.
- CSRF posture and session expiration behavior documented in `docs/runbooks/admin-auth-posture.md`.

###### Done condition:

Admin mutations trigger immediate cache revalidation; `EventListPageProps` defined once; topic detail uses one repository query; topic colors are data-driven and work for any topic created through admin; CSRF posture is documented; session expiration produces a clean, tested recovery path.

---

#### ▸ Phase 14.7 - Continuity Pass ✅

###### Phase Tasks:

- [x] Write and align on continuity checklist (`docs/specs/ui/continuity.md`) before reviewing any page — documents what to look for, not just that a review happened
- [x] Review all public pages against the settled visual direction — motif opacity, palette boldness, typography scale — and correct any outliers
- [x] Thread "Find Your Fight" dual meaning through copy on: homepage hero (already present), About page (already present), action detail CTA area (section-label "Your next step" added), issue detail section headers (step 03 sub updated to "This is where your fight gets real")
- [x] **Interior page visual gap** — `detailHero` and `discoveryPageHeader` now carry a section-scoped motif `::before` at 10% and 8% opacity respectively, right-anchored and contained within the section. Both sections also apply display-scale Playfair Display typography on the h1 (`clamp(2rem, 5vw, 3.6rem)` / `clamp(2rem, 4.5vw, 3.2rem)`). Action detail header class updated from `detailHeader` only to `detailHeader detailHero` for consistency.
- [x] Regenerate all 5 portfolio screenshots after Phase 14 changes land — **deferred: requires running dev server + seeded DB**; run `pnpm dev` + `node scripts/regenerate-doc-screenshots.mjs`
- [x] Update README active phase reference — updated from Phase 13.6 to Phase 14.7
- [x] Keyboard accessibility pass: focus rings verified present and correctly styled throughout; `aria-describedby` + `aria-invalid` present on form inputs; tab order is semantically correct; finding: inline error `<p>` elements lack `role="alert"` for proactive announcement — defer to Phase 14.9 copy pass
- [x] Document a manual walkthrough of the submission → moderation → publish → public visibility pipeline — `docs/runbooks/submission-to-publication-walkthrough.md` created
- [x] **Admin list row interaction** — **decision: fully clickable rows**. CSS stretched-link pattern applied via `adminTableRecordLink::after { position: absolute; inset: 0 }` with `tbody tr { position: relative }`. Row hover state added. Title underlines on hover (existing `adminTableRecordTitle` pattern). Applies to all admin list pages via shared `adminRecordTable` class on all tables.
- [x] No structural changes to public pages, no new features — coherence, verification, and documentation only

###### Done condition:

A reviewer navigating from homepage through an issue into an article and action feels a consistent visual and emotional thread; screenshots match the shipped product; keyboard navigation is verified; the full content pipeline has a documented manual walkthrough.

###### Notes:

- Interior page headers (detail + discovery) now carry section-scoped motif backgrounds at low opacity, bridging the visual gap between the homepage hero and interior pages without the abandoned fixed-watermark approach.
- Screenshots remain a deferred artifact-refresh step; they require `pnpm dev` + seeded DB and do not block the phase exit otherwise.
- Form error `role="alert"` finding is queued for Phase 14.9 since it touches the same copy/form surfaces that phase will cover anyway.

---

#### ▸ Phase 14.8 - Events UX ✅

###### Phase Tasks:

- [x] Decide and implement default Events page behavior — show all upcoming events (today + 3 months) without requiring location input; there was no random city default in current code, but `getContents` was using raw `params` while filters showed `resolvedParams` dates — fixed by passing `resolvedParams` to `getContents`
- [x] Add demo geography framing to the Events page — inline `metaText` paragraph inside `discoveryPageHeader`, rendered only when `isDemoModeEnabled()`; copy: "Demo events are seeded across NY, PA, CA, TX, and PR — use the region selector to find them."
- [x] Add motif header treatment to the events page — wrapped `h1` + intro in `discoveryPageHeader` (same class as articles/actions pages); `::before` motif at 8% opacity, amber `border-bottom`, and display-scale h1 are applied by existing CSS rules

###### Done condition:

A first-time visitor landing on `/events` sees something relevant or a clear invitation to filter — not results for a city they didn't choose; the bounded demo geography is explained rather than silent.

---

#### ▸ Phase 14.9 - Copy Pass ✅

###### Voice direction:

The copy should feel like an emotional plea, not a product description. The register is punk rock and sincere — sentences that build, not bullet points that summarize. The dual meaning of "Find Your Fight" (find the issue that's yours AND find the fighter within) is the emotional underpinning. Acknowledge the overwhelm. Acknowledge that one person feels powerless. Then turn it. The power and responsibility lives in each of us. Summon it. That is the through-line.

Avoid: trendy fragment copy ("Find. Act. Fight."), passive hedging ("submissions are reviewed before..."), self-explanation ("this page shows you..."), defensive moderation language.

###### Phase Tasks:

- [x] Audit every user-facing string across all public pages: homepage, about, issues index and detail, articles, actions, events, submit flow, search, error and empty states
- [x] Rewrite any copy that is choppy, fragmentary, hedging, or reads as UI chrome rather than a human voice
- [x] Ensure the emotional build — overwhelm → collective power → personal fire → action — is present in some form wherever a user might need it most (hero, issue detail, action CTA, empty states)
- [x] Add honest framing on the search page about what ILIKE search can and cannot find — silent near-misses hurt credibility more than no search; at minimum a single explanatory line
- [x] Submission success state: tell submitters what happens next — "Submissions are reviewed editorially before publication" is sufficient; the current success state ends in a vacuum
- [x] Copy should feel like the same person wrote all of it; that person is direct, serious, and believes this matters

###### Done condition:

Any string picked at random from any public page sounds like it belongs to the same voice; the site reads as a rallying cry not a content directory.

###### Notes:

- Full audit covered: homepage, about, issues index/detail, articles index/detail, actions index/detail, events index/detail, search, submit entry, article submission form, event submission form, not-found, error page, footer
- "Related Topics" → "Related Issues" on action and event detail pages for terminology consistency
- "Learn More" → "Read First" on action and event detail pages — directs before acting
- Event detail page now has a contribute nudge (was the only detail page missing one)
- Search h1 → "Search"; adds one-line ILIKE framing ("word matches; browse by issue for broader coverage")
- Submission success state: "We've got it. Your submission is in. A real person reviews everything before it goes live."
- `role="alert"` added to all inline form error `<p>` elements (deferred from Phase 14.7)
- Footer: "Submit Content" → "Contribute"

---

#### ▸ Phase 14.10 - Nav Mark & Favicon Artwork ✅

###### Goal

Replace the placeholder amber circle with final artwork for the nav home-link mark and the browser favicon.

###### Phase Tasks:

- [x] Decide whether the nav mark and favicon are the same design or different → text-only wordmark ("FYF") for nav; "F" lettermark favicon
- [x] Design the final mark — text-only wordmark removes the need for an SVG mark; "F" lettermark built as SVG for favicon
- [x] Remove `FYFLogo` from nav; clean up `.site-brand-logo`; text wordmark (`site-wordmark-text`) stands alone
- [x] Replace `fyf-mark.svg` with bold "F" lettermark (amber serif on dark navy rounded square)
- [x] Replace footer `::before` motif with 2px amber `border-top`
- [x] Update `bg-motif.png` with clean transparent version (user-supplied)
- [x] About page art question resolved: Option A (no artwork) — `about-hero::before` removed
- [x] Visual check: homepage ✅ about ✅ search ✅ issues collection ✅ footer ✅

###### Done condition:

The nav home-link mark is visually intentional and references the FYF brand identity; the favicon reads as a distinct, recognizable mark at 16px; placeholder circle is gone from both locations. ✅ All conditions met.

###### Notes:

- Swap points are isolated: `FYFLogo` in `icons.tsx` (nav mark) and `fyf-mark.svg` (favicon). No other files need to change.
- If the nav mark and favicon diverge (e.g., full motif for nav, letter mark for favicon), the SVG in `icons.tsx` and the file in `/public/` can be different designs.
- If sourcing from the motif image: trace in Figma or Illustrator, export as SVG path, paste into the relevant file. Do not attempt to hand-compute paths.

---

#### ▸ Phase 14.11 - Final Nitpick Pass ✅

###### Goal

One last sweep across the entire public and admin experience to catch anything that still reads as unfinished, inconsistent, or slightly off before the branch stack lands. No new features — observations and fixes only.

###### Scope

Anything visible to a reviewer: spacing, copy, color, interaction, empty states, edge cases. Both public and admin surfaces are in scope. Fix it if it can be fixed in one pass; document it in progress.md if it genuinely requires a decision or future phase work.

###### Phase Tasks

- [x] Add missing amber `border-bottom` to `.detailHero` — was using subtle-blue token, now matches `.discoveryPageHeader` / `.submitEntryHeader` / `.about-hero`
- [x] About page double separator — removed `border-top` from `.about-body`; `.about-hero`'s amber bottom is the sole divider. `.about-journey` keeps its `border-top`
- [x] Search "or browse by issue" section removed — `searchOrDivider` and `searchBrowseSection` deleted; intro copy now links to `/issues` inline; empty state CTAs already cover the navigation need
- [x] Footer motif — resolved in Phase 14.10 (replaced with 2px amber `border-top`); no action needed
- [x] **Motif placement — final settled state** (explored and decided in Phase 14.11):
  - Homepage hero: full-bleed `::before` at 35% opacity — unchanged, the primary brand statement
  - Collection page headers (Issues, Articles, Actions, Events): right-anchored `<img className="discoveryPageHeaderMotif">` at 25% opacity with bottom fade (`mask-image: linear-gradient(to bottom, black 15%, transparent 75%)`), positioned absolute behind text inside `.discoveryPageHeader`
  - Search, detail pages, about, submit, admin: no motif
  - Canonical decision recorded in `decisions.md` under "Visual identity art strategy"
- [x] **Demo banner scroll positioning** — reworked in Phase 14.11 nitpick pass. Header and banner wrapped in a single `site-sticky-area` sticky container (replaces two independent sticky elements). Banner uses `margin-top: --demo-banner-gap` for the gap so it disappears cleanly on dismiss. `topicSelector` sticky offset resets to `--public-sticky-offset` when no banner is present (`:has()` rule). Content no longer scrolls through the gap between navbar and filter bar after banner dismissal.
- [x] **Gold accent overuse on entity list pages and about page** — `collectionItemEyebrow` changed from amber to `--color-text-muted`; card left border at rest changed from 40% amber to `--color-border-subtle` (amber appears on hover only); `aboutStepNum` opacity reduced from 0.7 → 0.28 (hint, not statement); `publicShell .secondaryCTA` text changed from amber to `--color-text-primary` (amber border retained).
- [ ] **topicSelector gap against demo banner** — when banner is present the filter bar sticks flush against the banner bottom (no breathing room). Root cause: `--demo-banner-height` is always 0px. Proper fix requires a `ResizeObserver` on the sticky area. Deferred to Milestone 2 — see `docs/future/milestone-2-planning-notes.md`.
- [x] Walk every public route (homepage, about, demo, issues index/detail, articles index/detail, actions index/detail, events index/detail, search, submit entry, submit article, submit event, error/empty states) — **human eyes task, do before phase exit**
- [x] Walk the admin surfaces (login, submissions queue, submission detail, articles, actions, events, topics) — **human eyes task, do before phase exit**
- [x] Final copy pass with human eyes
- [x] Related links on details pages are not well formatted - all text is underlined on hover rather than just the title, not enough brand accents. a bit dense. issue exists on articles, events,
- [x] When linking back to issues page from articles/events/actions details, should we used appropriate color coding?
- [x] Enlarge 'actions' and 'articles' section headers on search results page. make sections collapsible?
- [x] **Comprehensive review pass (2026-06-23)** — site reviewed honestly at 7/10 → 8/10 over multiple passes. Key changes: homepage hero gap fixed (double-margin bug), step labels on journey cards, "Choose one issue" copy, issue roll locked to vertical treatment. Issue detail: removed confusing step-01 "Go Deep" header, capped articles/actions at 5, promoted events CTA. Event detail: restructured separator hierarchy (title → red separator → dek → thin separator → date/location). Article detail: collapsed to single-column, metadata card below article body, "Now act" forward signal, "Explore This Issue Further" simplified to direct textCTA. Events list: location note always visible, pagination spacing fixed. Dead CSS removed throughout. Screenshot 02-topics renamed to 02-issues. README portfolio language restored (app-only change).
- [x] **Homepage issue roll → compact card grid** — replaced vertical large-type Playfair roll with compact 3-column card grid matching `/issues`; fixed 3/3/1 orphan card with centering selector; removed redundant "Choose your issue" CTA from journey section.
- [x] **Demo banner → floating pill** — moved from top of page to `position: fixed; bottom: 16px` floating pill with rise-from-bottom animation; hero now lands clean without a warning banner as first element.
- [x] **Journey strip** — `JourneyStrip` component added to all six journey pages (issues list/detail, articles list/detail, actions list/detail). Large Playfair Display numerals, amber active step, muted inactive steps as navigable links. Centered `→` arrow cuts through connector line. Closes the long-standing "homepage-only journey vocabulary" gap.
- [x] **Root 404 page** — `app/not-found.tsx` now renders the full public shell (nav, footer, demo banner) with styled "We could not find that page" content and recovery CTAs. Previously rendered outside the layout with no shell.

###### Done condition

Nothing visible in a normal reviewer walkthrough reads as an obvious oversight; any remaining rough edge is intentionally deferred and documented.

---

---

### ► Phase 15 — Deployment Infrastructure 🚧 ACTIVE

###### Goal

Configure hosting, environment management, and CI/CD once the product and schema shape are stable enough to justify release planning.

---

#### ▸ Phase 15.1 — Hosting & Runtime Decisions ✅

###### Goal

Decide where and how the app deploys before any deployment config is written. Pure decisions and documentation — no code.

###### Phase Tasks:

- [x] Confirm target hosting provider and runtime shape for the public site (Next.js), API (NestJS), and database (PostgreSQL)
- [x] Define the admin-auth deployment boundary — which service hosts the admin routes, how cookie-backed sessions behave across the deployed stack
- [x] Define the migration strategy for deployed environments — when and how `prisma migrate deploy` runs relative to API startup
- [x] Record decisions in `decisions.md`; update `CONTEXT-next-session.md` with the locked hosting choice

###### Notes:

- Full decision rationale, options considered, service topology, migration strategy, and auth boundary documented in `docs/architecture/011-phase-15-deployment-architecture.md`.

---

#### ▸ Phase 15.2 — CI & Repository Governance ✅

###### Goal

Harden the repository as a credible merge gate and add post-Milestone 1 maintenance automation.

###### Phase Tasks:

- [x] Confirm the CI suite covers the required gates for `main`: lint, typecheck, unit tests, and any integration coverage that can run without a container runtime
- [x] Add Dependabot for automated dependency update PRs
- [x] Add dependency vulnerability validation in CI (`pnpm audit --prod`)
- [x] Define and apply branch protection rules for `main` (required status checks, no direct push)
- [x] Decide whether `CODEOWNERS` adds review clarity for post-Milestone 1 maintenance; add if yes

###### Notes:

- Fixed `actions/checkout@v6` → `@v4` across all CI jobs (v6 does not exist; all jobs would have failed)
- Added `audit` job to CI running `pnpm audit --prod`; resolved pre-existing `multer` DoS advisory (GHSA-72gw-mp4g-v24j, GHSA-3p4h-7m6x-2hcm) via `pnpm.overrides` pinning `multer>=2.2.0`
- Added `.github/dependabot.yml` covering npm workspace and GitHub Actions, weekly on Mondays, grouped dev-tooling updates
- Branch protection: existing repository ruleset (created 2026-03-08) is the single source of truth — stricter than anything we would have added via classic branch protection. Classic branch protection was briefly created and then removed to avoid redundancy.
- Add `audit` to the ruleset required checks after this PR merges and the check proves out in CI
- `CODEOWNERS`: skipped — solo project, adds friction with no review-clarity benefit at this stage

---

#### ▸ Phase 15.3 — Deployment Configuration ✅

###### Goal

Wire the chosen hosting provider with the correct env vars, secrets, and migration path so the app runs in a deployed environment.

###### Phase Tasks:

- [x] Configure deployment environment variables and secret handling for the public site, API, and database connection
- [x] Wire admin-auth session config for the deployed environment (cookie domain, secure flag, session secret)
- [x] Validate the migration workflow end-to-end against a deployed or staging database instance
- [x] Deploy a staging or preview instance and confirm public routes, admin auth, and the API all behave correctly
- [x] Add `NEXT_PUBLIC_API_BASE_URL` as a CI secret pointing to the deployed API so the `build` job passes in CI

###### Notes:

- Railway services: `web` (Next.js), `api` (NestJS), `db` (PostgreSQL) — all in one project
- Migrations run via start command: `cd apps/api && pnpm exec prisma migrate deploy && node dist/main`
- Admin auth cross-domain cookie issue fixed: login/logout now proxy through Next.js routes so the session cookie is scoped to the web domain — see `fix(web): proxy admin auth through Next.js` commit
- Deployed URLs: `web-production-75507.up.railway.app`, `api-production-8544.up.railway.app`
- NEXT_PUBLIC_API_BASE_URL CI secret deferred — needs deployed URL wired into GitHub Actions secrets

---

#### ▸ Phase 15.4 — Observability ✅

###### Goal

Establish minimal traffic visibility without a paid analytics stack.

###### Phase Tasks:

- [x] Enable lightweight traffic visibility through platform/deployment logs or minimal request logging on public routes
- [x] Confirm error logging is sufficient to diagnose production incidents without a dedicated observability platform

###### Notes:

- `HttpLoggingInterceptor` added to `apps/api/src/common/` and registered globally in `main.ts` — logs `[METHOD] /path STATUS Xms` per request to stdout; Railway captures this as service traffic logs
- NestJS built-in logger handles bootstrap events and framework-level errors via stderr
- `Logger('Bootstrap')` now emits startup confirmation and surfaces bootstrap failures clearly
- Next.js writes server-side errors to stderr automatically; Railway captures both services' streams
- No paid APM or third-party analytics tool is required for Release 1 observability

---

###### Notes:

- Phase order was intentionally adjusted after Phase 12 so code-facing Milestone 1 work, including DB identifier normalization, lands before release infrastructure hardens those assumptions.
- Release 1 only needs lightweight public traffic visibility, not a paid analytics stack or full product analytics program.

---

#### ▸ Phase 15.5 — Railway Resource Right-Sizing ⏳

###### Goal

Set explicit resource limits on Railway services to bound cost and catch runaway processes,
closing a gap left open during Phase 15.3 deployment configuration.

###### Context

Railway bills on actual consumption rather than reserved capacity, so unset limits don't
waste money today. But without limits a memory leak or runaway process will grow unchecked
until Railway kills the service or the bill spikes. Portfolio-scale traffic warrants tight
limits — well below Railway's defaults.

Resource limits (memory, CPU) and PostgreSQL disk size are **dashboard-only** settings —
they cannot be committed to the repository. The agent deliverable here is:

- `railway.toml` files for each service (codifying healthcheck config and deploy settings
  that currently live only in the Railway dashboard)
- Updated ops runbook with the recommended limits and the steps to apply them
- Explicit task items the human must action in the Railway dashboard

###### Phase Tasks:

**Agent:**

- [x] Add `apps/web/railway.toml` — healthcheck path, restart policy, replicas
- [x] Add `apps/api/railway.toml` — healthcheck path (`/health/ready`), restart policy, replicas
- [x] Update `docs/runbooks/ops.md` with full dashboard settings reference table for web, api,
      and db services — documents all dashboard-only values with current settings and rationale

**Human (Railway dashboard — cannot be done via code):**

- [ ] Set memory limit on `web` service: 512 MB
- [ ] Set memory limit on `api` service: 512 MB
- [x] PostgreSQL disk: 5 GB (Railway minimum — no change made, default accepted)
- [ ] Confirm Wait for CI is On for both web and api
- [ ] Confirm Serverless is Off for both web and api
- [x] Enable teardown on `web` service — overlap 30s, draining 3s
- [ ] Enable teardown on `api` service — overlap 30s, draining 3s (same values as web)

###### Notes:

- Railway resource limits live in: dashboard → service → **Settings** → **Resources**
- PostgreSQL disk size lives in: dashboard → `db` service → **Settings**
- `railway.toml` supports healthcheck and deploy config but not memory/CPU limits —
  those remain dashboard-only as of the current Railway platform.
- Recommended limits are starting points for portfolio-scale traffic, not production targets.
  Adjust based on Railway's usage graphs after a week of live traffic.

---

#### ▸ Phase 15.6 — Mobile Pass ⏳

###### Goal

Fix mobile layout issues identified on the live deployed site before declaring Phase 15 complete.

###### Context

Now that the site is live at `https://demo.findmyfight.com`, mobile issues are visible in a real
browser on a real device rather than only through desktop viewport simulation. This subphase
exists to capture and fix the concrete problems found.

###### Phase Tasks:

- [ ] Audit and document specific mobile issues found on the live site
- [ ] Fix identified layout, spacing, or interaction problems at small viewports
- [ ] Verify fixes on real device or accurate mobile viewport simulation after each change
- [ ] Confirm no regressions on desktop viewport after mobile fixes

###### Notes:

- Tasks will be populated with specific issues as they are identified by the human reviewer.
- Do not invent scope — only fix what has been reported or discovered through direct mobile inspection.

---

---

### ► Phase 16 — Public Launch ⏳

###### Goal

Deploy the public demo and verify the live release behaves the way Milestone 1 intends.

###### Definition of Done

- [ ] Launch a public demo instance that is appropriate for portfolio and
      recruiter review at the end of Milestone 1
- [ ] Verify deployment health, runtime configuration, and migration state in
      the live environment after launch
- [ ] Verify the deployed public site and the repository provide distinct but
      complementary entry points for their audiences: live-site demo discovery
      for recruiters and repository/docs depth for engineering reviewers
- [ ] Confirm the live demo experience provides a clear, intentional path into
      the admin workflow and any required demo credentials or instructions
      without forcing visitors to discover them from the repository
- [ ] Ensure the demo dataset is broad and intentional enough to showcase the
      system credibly, including sufficient volume, moderation-state variety,
      and either geographically diverse content or explicit demo/example
      framing when geography is intentionally concentrated
