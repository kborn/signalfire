# Project Progress

This document tracks **phases and current status**.
It is the canonical answer to: “Where are we in the plan?”

---

| Phase                                                 | Name                                | Status        |
| ----------------------------------------------------- | ----------------------------------- | ------------- |
| [0](#-phase-0--repo-bootstrap-)                       | Repo Bootstrap                      | ✅            |
| [1](#-phase-1--platform-skeleton-)                    | Repository & Platform Skeleton      | ✅            |
| [2](#-phase-2--backend-foundations-)                  | Backend Foundations                 | ✅            |
| [3](#-phase-3--core-domain-model-)                    | Core Domain Model                   | ✅            |
| [4](#-phase-4--test-infrastructure-)                  | Test Infrastructure                 | ✅            |
| [5](#-phase-5--topic--content-apis-)                  | Topic & Content APIs                | ✅            |
| [6](#-phase-6--content-discovery-ui-)                 | Content Discovery UI                | ✅            |
| [7](#-phase-7--event-domain--apis-)                   | Event Domain & APIs                 | ✅            |
| [8](#-phase-8--event-ui-)                             | Event UI                            | ✅            |
| [9](#-phase-9--ui-polish-)                            | UI Polish                           | ✅            |
| [10](#-phase-10--submission-system-)                  | Submission System                   | ✅            |
| [11](#-phase-11--moderation--admin-interface-)        | Moderation & Admin Interface        | ✅            |
| **[12](#-phase-12--search--discovery-improvements-)** | **Search & Discovery Improvements** | **🚧 ACTIVE** |
| [13](#-phase-13--deployment-infrastructure-)          | Deployment Infrastructure           | ⏳            |
| [14](#-phase-14--analytics-)                          | Analytics                           | ⏳            |
| [15](#-phase-15--release-stabilization-)              | Release Stabilization               | ⏳            |
| [15.5](#-phase-155--final-public-ui-polish-)          | Final Public UI Polish              | ⏳            |
| [16](#-phase-16--final-repo--product-prep-)           | Final Repo & Product Prep           | ⏳            |
| [17](#-phase-17--public-launch-)                      | Public Launch                       | ⏳            |

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

### ► Phase 12 — Search & Discovery Improvements ⏳

###### Goal

Improve browsing and filtering across topics, actions, and events.

###### Definition of Done

- [ ] Scope boundary is documented and implementation-ready
- [ ] Public collection filtering is expanded within approved Release 1 limits
- [ ] Public collection pagination is implemented with a stable contract
- [ ] Tests and documentation cover filtering, pagination, empty states, and
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

#### ▸ Phase 12.2 - Article & Action Collection Filtering ⏳

###### Phase Tasks:

- [ ] Add topic-filtered browsing for the public Articles collection
- [ ] Add topic-filtered browsing for the public Actions collection
- [ ] Expose topic filter UI/state on the public Article and Action collection
      pages in a way that preserves published-only behavior and clear empty
      states

---

#### ▸ Phase 12.3 - Event Filter Expansion ⏳

###### Phase Tasks:

- [ ] Expose the scoped Release 1 Event filters in the public Events UI using
      the existing canonical filter dimensions: topic, date/date window, and
      location fields supported by the current Event contract
- [ ] Preserve the existing Event ordering and published-only visibility rules
      while adding the approved filters

---

#### ▸ Phase 12.4 - Pagination & Hardening ⏳

###### Phase Tasks:

- [ ] Add pagination to public collection APIs and UIs in a way that avoids a
      later breaking contract change when content volume grows
- [ ] Verify pagination composes correctly with approved filters across public
      collection surfaces
- [ ] Add tests and documentation covering filter query behavior, pagination
      behavior, empty states, and interaction with published-only visibility

###### Notes:

- Phase 12 should improve discovery within Release 1 boundaries rather than
  expand into Milestone 2 systems.
- Full-text search may be revisited later, but it is not required to complete
  the current phase.

###### Links:

- Specification: `docs/specs/014-phase-12-search-discovery-improvements.md`

---

---

### ► Phase 13 — Deployment Infrastructure ⏳

###### Goal

Configure hosting, environment management, and CI/CD.

###### Phase Tasks:

- [ ] Add repository security automation before public launch hardening, including Dependabot update PRs and dependency vulnerability validation in CI
- [ ] Define branch protection/status-check requirements for `main` and apply them across primary public-facing repositories
- [ ] Configure deployment environment variables, secret handling, and runtime wiring needed to support the chosen admin-auth implementation

---

---

### ► Phase 14 — Analytics ⏳

###### Goal

Implement basic product analytics so the team can measure visitor volume, acquisition sources, and core discovery-to-action traffic patterns.

Capabilities:

- visitor traffic measurement
- traffic source attribution
- basic page and flow analytics across the public site
- baseline reporting to support launch decisions

---

---

### ► Phase 15 — Release Stabilization ⏳

###### Goal

Bug fixes, polish, and observability improvements.

###### Phase Tasks:

- [ ] Run a full dependency risk review (direct and transitive) and resolve or explicitly defer remaining high-severity findings with documented rationale
- [ ] Define the Release 1 application logging approach, including what auth, admin, API error, and deployment-relevant events should be logged without expanding into a full observability platform
- [ ] Clean up remaining obvious formatting-quality issues that undercut launch
      readiness, including raw or UTC-only timestamp presentation where
      human-readable date/time formatting should exist
- [ ] Fix obvious public demo defects that read as bugs rather than product
      tradeoffs, including duplicate event-summary rendering and similar
      screenshot-visible data/presentation issues

---

### ► Phase 15.5 — Final Public UI Polish ⏳

###### Goal

Perform one final launch-adjacent public UI polish pass after core release
stabilization and before the final release-prep and public-launch phases.

###### Phase Tasks:

- [ ] Decide whether public collection cards should be fully clickable or keep
      title-only links, then align hover/focus affordances and accessibility
      behavior with that decision
- [ ] Complete a final public copy review across homepage, About, navigation,
      collection pages, detail pages, submit flows, empty states, and error
      states
- [ ] Make minor color, spacing, typography, and CTA adjustments needed after
      reviewing the full public flow in realistic browser viewports
- [ ] Resolve the known public-site polish issues from the Milestone 1 review,
      including stronger card definition, clearer primary CTA hierarchy, hero
      background containment, article metadata/body separation, event time
      formatting, topic-card differentiation, and improved home-page section
      rhythm
- [ ] Simplify the homepage so it does not repeat the same premise across too
      many equal-weight sections, and ensure the core journey reads as a clear
      progression rather than a flat scroll
- [ ] Decide and implement the final demo-site affordance for recruiter-style
      visitors, such as a banner or similar visible entry point that explains
      the portfolio-demo posture and directs them into the admin experience
      intentionally
- [ ] Align public-facing naming and brand presentation consistently across the
      live product, including product name usage, admin entry-point labeling,
      nav terminology, and any abbreviated wordmark treatment
- [ ] Rework submit-flow copy so it is inviting, accurate about moderation, and
      does not over-claim community behavior or hide key formatting guidance
- [ ] Verify the final public polish pass does not introduce admin UI regressions
      or conflict with the established Phase 11.5 visual identity

###### Notes:

- This phase is intentionally small. It should handle last-mile presentation
  polish before launch, not reopen product identity, route architecture, or
  core feature scope.
- The demo-site affordance should help live-site reviewers discover the admin
  workflow without depending on repository documentation, while still keeping
  the public experience coherent for ordinary visitors.
- Public copy should not lean harder on "community-powered" messaging than the
  actual Release 1 contributor experience can support.

---

---

### ► Phase 16 — Final Repo & Product Prep ⏳

###### Goal

Run the final cross-cutting verification and readiness pass before public launch.

###### Phase Tasks:

- [ ] Add smoke or integration coverage for the highest-risk moderation/admin workflows that still lack confidence after Phase 11.9 auth implementation
- [ ] Run a final focused regression pass across public and admin flows, including auth, moderation, and essential content-management paths
- [ ] Review Nest module boundaries for duplicated provider registration across feature modules and replace provider re-registration with cleaner module import/export relationships where appropriate
- [ ] Document the local-only access assumption history, current deployed admin-access boundary, and any remaining deferred concerns that materially affect launch readiness
- [ ] Confirm repository documentation, setup instructions, and deployment caveats match the actual shipped product state
- [ ] Refresh README screenshots and any reviewer-facing visual references so
      the repository matches the final public/admin experience being shipped

###### Notes:

- This phase is the final product/repository readiness gate, not a place to introduce new product scope.
- Public UI polish should remain in Phase 15.5; this phase is for confidence and readiness validation.
- Broader logging architecture should be decided before this phase, but any final backfill or verification of important operational logs should happen here as part of launch-readiness validation.

---

---

### ► Phase 17 — Public Launch ⏳

###### Goal

Deployment verification, documentation completion, and launch readiness.

###### Phase Tasks:

- [ ] Launch a public demo instance that is appropriate for portfolio and
      recruiter review at the end of Milestone 1
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
