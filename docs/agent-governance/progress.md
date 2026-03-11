# Project Progress

This document tracks **phases and current status**.
It is the canonical answer to: “Where are we in the plan?”

---

| Phase                                             | Name                            | Status       |
|---------------------------------------------------|---------------------------------|--------------|
| [0](#-phase-0--repo-bootstrap-)                   | Repo Bootstrap                  | ✅            |
| [1](#-phase-1--platform-skeleton-)                | Repository & Platform Skeleton  | ✅            |
| [2](#-phase-2--backend-foundations-)              | Backend Foundations             | ✅            |
| **[3](#-phase-3--core-domain-model-)**            | **Core Domain Model**           | **🚧 ACTIVE** |
| [4](#-phase-4--topic--content-apis-)              | Topic & Content APIs            | ⏳            |
| [5](#-phase-5--content-discovery-ui-)             | Content Discovery UI            | ⏳            |
| [6](#-phase-6--event-domain--apis-)               | Event Domain & APIs             | ⏳            |
| [7](#-phase-7--event-ui-)                         | Event UI                        | ⏳            |
| [8](#-phase-8--submission-system-)                | Submission System               | ⏳            |
| [9](#-phase-9--moderation-workflow-)              | Moderation Workflow             | ⏳            |
| [10](#-phase-10--admin-interface-)                | Admin Interface                 | ⏳            |
| [11](#-phase-11--search--discovery-improvements-) | Search & Discovery Improvements | ⏳            |
| [12](#-phase-12--deployment-infrastructure-)      | Deployment Infrastructure       | ⏳            |
| [13](#-phase-13--release-stabilization-)          | Release Stabilization           | ⏳            |
| [14](#-phase-14--public-launch-)                  | Public Launch                   | ⏳            |

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

#### ▸ Phase 1.6 - Pipeline CI  ✅

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

### ► Phase 3 — Core Domain Model 🚧

###### Goal

Implement the core domain persistence model in Prisma, including schema,
entity relationships, migration workflow, and repository/service layer
patterns for Release 1 domain entities.

###### Definition of Done

- [ ] Prisma models exist for Topic, Article, Action, Event, and Submission
- [ ] Core relationships are implemented and validated via migrations
- [ ] Initial Phase 3 migration(s) are applied locally and reproducible
- [ ] Repository/service layer boundaries and baseline persistence patterns are documented and implemented for current scope
- [ ] Phase 3 scope boundaries are documented and enforced

---

#### ▸ Phase 3.1 - Core Entity Schema & Relationships 🚧

###### Phase Tasks:

- [ ] Define and document a Release 1 relationship matrix (required vs optional/deferred) for Topic, Article, Action, Event, and Submission as the Phase 3 implementation contract
- [ ] Define Prisma models for Topic, Article, Action, Event, and Submission
- [ ] Define and implement unique public identifiers (slug fields) for Topics, Articles, and Actions to support stable URL routing
- [ ] Implement Topic relationships to Articles, Actions, and Events
- [ ] Implement the required cross-entity relationships among Articles, Actions, and Events according to the relationship matrix (above)
- [ ] Model Submission as pending Article or pending Event content
- [ ] Add constraints/indexes needed for relationship integrity and baseline read performance

---

#### ▸ Phase 3.2 - Migrations & Persistence Validation 🚧

###### Phase Tasks:

- [ ] Generate and apply Prisma migration(s) for Phase 3 domain schema
- [ ] Validate migration workflow end-to-end locally (create, apply, reset, re-apply)
- [ ] Ensure Prisma client is regenerated and aligned with Phase 3 schema
- [ ] Add tests that validate relationship persistence and basic integrity constraints
- [ ] Seed [topics](decisions.md#2026-03-10-1)

---

#### ▸ Phase 3.3 - Repository & Service Layer Patterns 🚧

###### Phase Tasks:

- [ ] Define repository/service boundaries for Topic, Article, Action, Event, and Submission persistence flows
- [ ] Implement repository patterns for core CRUD/read operations required by upcoming Phase 4 APIs
- [ ] Keep service layer focused on domain orchestration and relationship-aware access patterns
- [ ] Document conventions for Prisma usage in repositories/services (query composition, includes/selects, transaction boundaries)

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

### ► Phase 4 — Topic & Content APIs ⏳

###### Goal

Create APIs for reading Topics, Articles, and Actions.

Capabilities:

- topic listing
- topic detail
- article retrieval
- action retrieval
- relationships between topics, articles, and actions

---

---

### ► Phase 5 — Content Discovery UI ⏳

###### Goal

Implement public browsing UI for topics, articles, and actions.

Capabilities:

- topic pages
- article pages
- action pages
- cross-linking between content

---

---

### ► Phase 6 — Event Domain & APIs ⏳

###### Goal

Implement Event persistence and APIs.

Capabilities:

- event schema
- event read APIs
- filtering by topic/date/location

---

---

### ► Phase 7 — Event UI ⏳

###### Goal

Allow users to browse and view events.

Capabilities:

- event listing
- event detail pages
- topic-related events

---

---

### ► Phase 8 — Submission System ⏳

###### Goal

Implement anonymous submission workflow for events and articles.

Capabilities:

- public submission forms
- submission persistence
- moderation states

---

---

### ► Phase 9 — Moderation Workflow ⏳

###### Goal

Provide moderation queue and approval tools.

Capabilities:

- review submissions
- approve or reject content
- moderation state transitions

---

---

### ► Phase 10 — Admin Interface ⏳

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

### ► Phase 11 — Search & Discovery Improvements ⏳

###### Goal

Improve browsing and filtering across topics, actions, and events.

---

---

### ► Phase 12 — Deployment Infrastructure ⏳

###### Goal

Configure hosting, environment management, and CI/CD.

---

---

### ► Phase 13 — Release Stabilization ⏳

###### Goal

Bug fixes, polish, and observability improvements.

---

---

### ► Phase 14 — Public Launch ⏳

###### Goal

Deployment verification, documentation completion, and launch readiness.
