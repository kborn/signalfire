# Project Progress

This document tracks **phases and current status**.
It is the canonical answer to: “Where are we in the plan?”

---

| Phase                                             | Name                            | Status        |
| ------------------------------------------------- | ------------------------------- | ------------- |
| [0](#-phase-0--repo-bootstrap-)                   | Repo Bootstrap                  | ✅            |
| [1](#-phase-1--platform-skeleton-)                | Repository & Platform Skeleton  | ✅            |
| [2](#-phase-2--backend-foundations-)              | Backend Foundations             | ✅            |
| [3](#-phase-3--core-domain-model-)                | Core Domain Model               | ✅            |
| [4](#-phase-4--test-infrastructure-)              | Test Infrastructure             | ✅            |
| [5](#-phase-5--topic--content-apis-)              | Topic & Content APIs            | ✅            |
| [6](#-phase-6--content-discovery-ui-)             | Content Discovery UI            | ✅            |
| [7](#-phase-7--event-domain--apis-)               | Event Domain & APIs             | ✅            |
| **[8](#-phase-8--event-ui-)**                     | **Event UI**                    | **🚧 ACTIVE** |
| [9](#-phase-9--ui-polish-)                        | UI Polish                       | ⏳            |
| [10](#-phase-10--submission-system-)              | Submission System               | ⏳            |
| [11](#-phase-11--moderation-workflow-)            | Moderation Workflow             | ⏳            |
| [12](#-phase-12--admin-interface-)                | Admin Interface                 | ⏳            |
| [13](#-phase-13--search--discovery-improvements-) | Search & Discovery Improvements | ⏳            |
| [14](#-phase-14--deployment-infrastructure-)      | Deployment Infrastructure       | ⏳            |
| [15](#-phase-15--analytics-)                      | Analytics                       | ⏳            |
| [16](#-phase-16--release-stabilization-)          | Release Stabilization           | ⏳            |
| [17](#-phase-17--public-launch-)                  | Public Launch                   | ⏳            |

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
- [x] Document the deferral of topic-page Event entry points to Phase 9 UI
      polish work

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

---

---

### ► Phase 8 — Event UI ⏳

###### Goal

Allow users to browse and view events.

Capabilities:

- event listing
- event detail pages
- topic-prefiltered Event browsing on the Events surface

---

---

### ► Phase 9 — UI Polish ⏳

###### Goal

Refine the public product UI so the platform feels intentional, cohesive, and ready for broader user-facing evaluation.

Capabilities:

- visual polish across public browsing pages
- improved layout consistency and hierarchy
- stronger calls to action and discovery affordances
- responsive behavior refinement
- topic-page links into filtered Event discovery where useful

###### Notes:

- Phase 9 is where broader visual polish, stronger presentation treatment, and refinement beyond the Phase 6 baseline should occur.
- Topic detail pages may add lightweight calls to action such as "Find Events"
  that link into topic-prefiltered Event browsing rather than embedding Event
  cards inline.

---

---

### ► Phase 10 — Submission System ⏳

###### Goal

Implement anonymous submission workflow for events and articles.

Capabilities:

- public submission forms
- submission persistence
- moderation states

---

---

### ► Phase 11 — Moderation Workflow ⏳

###### Goal

Provide moderation queue and approval tools.

Capabilities:

- review submissions
- approve or reject content
- moderation state transitions

---

---

### ► Phase 12 — Admin Interface ⏳

###### Goal

Administrative tools for managing content.

Capabilities:

- create/edit actions
- publish articles
- manage events
- moderate submissions

###### Notes:

- Topic data management is deferred to a post-Release-1 phase; Release 1 topics remain seed-defined and non-editable.

---

---

### ► Phase 13 — Search & Discovery Improvements ⏳

###### Goal

Improve browsing and filtering across topics, actions, and events.

---

---

### ► Phase 14 — Deployment Infrastructure ⏳

###### Goal

Configure hosting, environment management, and CI/CD.

---

---

### ► Phase 15 — Analytics ⏳

###### Goal

Implement basic product analytics so the team can measure visitor volume, acquisition sources, and core discovery-to-action traffic patterns.

Capabilities:

- visitor traffic measurement
- traffic source attribution
- basic page and flow analytics across the public site
- baseline reporting to support launch decisions

---

---

### ► Phase 16 — Release Stabilization ⏳

###### Goal

Bug fixes, polish, and observability improvements.

---

---

### ► Phase 17 — Public Launch ⏳

###### Goal

Deployment verification, documentation completion, and launch readiness.
