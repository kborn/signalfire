# Project Context

*Last updated: 2026-03-04*

------------------------------------------------------------------------

## Purpose

This project has **dual and equally weighted goals**:

### 1️⃣ Professional & Technical Growth

This project exists to:

-   Gain hands-on experience in a **new full-stack technology stack**
    selected deliberately for skill expansion.
-   Ensure the **user writes primary implementation code**, with AI used
    for strategy, validation, and governance --- not autonomous coding.
-   Demonstrate an **AI-governed development workflow** with clearly
    defined agent roles.
-   Showcase **staff-level architectural reasoning, decision logging,
    and scope control**.
-   Produce a portfolio-grade artifact that strengthens marketability
    (including NZ-based roles).

### 2️⃣ Real-World Product Creation

This project also exists to:

-   Build a **real, usable platform**.
-   Deploy the system publicly.
-   Promote it intentionally.
-   Deliver genuine utility to real users.
-   Operate as a credible, functioning software product.

This is not a mock portfolio artifact. It is intended to be real and
used.

------------------------------------------------------------------------

## Platform Description

This project is a **Civil Action Platform** designed to help people
learn about issues, discover opportunities for participation, and take
meaningful civic action.

The platform combines **informational content** with **real-world
participation opportunities**. Its goal is to make civic engagement
more accessible by connecting knowledge with action.

While current content may lean toward particular political contexts,
the system is intentionally designed to support a broad range of civic
topics including climate change, community organizing, volunteering,
and public policy engagement.

### Core Platform Capabilities

The platform will support several categories of functionality.

#### Events
Users can discover civic events such as:

- protests or rallies
- volunteer opportunities
- town halls or public meetings
- community organizing events
- educational workshops

Events represent opportunities for real-world participation and can be
browsed or searched by **location, date, and topic**.

#### Articles and Guides
The platform will publish written content that helps users understand
issues and learn how to take action.

Examples include:

- blog-style posts
- issue explainers
- how-to guides for civic participation
- educational resources

This content provides the context that helps users understand why and
how to participate.

#### Action Resources
Some content will focus specifically on **actions people can take**,
such as:

- contacting representatives
- participating in community initiatives
- supporting organizations or campaigns
- organizing local events

These resources translate civic interest into concrete steps.

#### Event Submission
Users will be able to submit events for review so that organizers can
share opportunities with the broader community.

Submitted events will be moderated before appearing publicly.

#### Administration and Moderation
The platform includes administrative tools for:

- reviewing event submissions
- publishing or editing articles
- curating events and resources
- maintaining platform quality

### Event Sources

Events may originate from multiple sources:

- manual entry by administrators
- public event submissions
- integrations with external event APIs (future capability)

Web crawling is intentionally **not part of the MVP**, but the
architecture should allow additional ingestion methods in the future.

------------------------------------------------------------------------

## Product Positioning Constraints

-   This is **not a social media platform**.
-   It is **not optimized for monetization**.
-   It is **not engineered for hyperscale from day one**.
-   It is **not opposed to scale** --- architectural decisions should
    avoid unnecessary dead-ends.
-   It should be capable of growth if adoption occurs, but scale
    optimization is not the primary driver.

------------------------------------------------------------------------

## Success Criteria

This project is successful if:

-   The user personally implements core backend and frontend features.
-   Architectural decisions are explicitly recorded in `decisions.md`.
-   Phase progression is clearly documented in `progress.md`.
-   AI usage follows the governance model defined in `ai_usage.md`.
-   The system is publicly deployable.
-   The platform provides meaningful utility.
-   The project strengthens the user's professional positioning.

Both learning outcomes and product viability must be satisfied.

------------------------------------------------------------------------

## Non-Goals

This project is NOT:

-   A generic template repository.
-   A purely theoretical governance experiment.
-   A venture-scale startup attempt.
-   Dependent on AI-generated autonomous commits.
-   A community discussion forum with open commenting systems.

------------------------------------------------------------------------

## Strategic Constraints

-   The stack must meaningfully expand the user's current skill set.
-   The user must remain the primary implementer.
-   Political or thematic positioning must be intentional and recorded
    as a decision.
-   Scope expansion requires explicit phase definition.
-   Rewrites must archive prior versions instead of deleting them.

------------------------------------------------------------------------

## Architecture Summary

To be defined in Phase 0 after stack decision.

Architecture should reflect:

-   Clean domain boundaries
-   Clear backend/frontend separation
-   Deployment readiness
-   Reasonable scalability patterns without premature optimization

------------------------------------------------------------------------

## Technology Stack

The platform will use a modern TypeScript full-stack architecture.

#### Frontend
- Next.js
- React
- TypeScript

#### Backend
- NestJS
- TypeScript

#### Database
- PostgreSQL

#### Deployment
- TBD (likely Vercel + managed backend hosting)

### Rationale

This stack was selected to:

- maximize job-market relevance (React + TypeScript ecosystem)
- provide strong support for building modern web platforms
- allow the developer to gain experience in a new ecosystem
- support a clean separation between frontend and backend services

------------------------------------------------------------------------

### Development Tooling

Package manager: pnpm
Repository structure: monorepo (frontend + backend)

------------------------------------------------------------------------

## Canonical Documents (Read Order)

1.  `project-context.md` → orientation and authority map
2.  `ai_usage.md` → how AI tools are used and constrained
3.  `progress.md` → phases, current position, phase tasks
4.  `decisions.md` → non-negotiable architectural/workflow decisions

If documents conflict, authority flows top to bottom.

------------------------------------------------------------------------

## Repository Guardrails

-   Documentation updates must precede major architectural changes.
-   All irreversible decisions must be logged in `decisions.md`.
-   Replaced documents must be archived, not deleted.
-   Phase expansion requires updated Phase Tasks.

------------------------------------------------------------------------

## Documentation Taxonomy (Authoritative)

- `docs/agent-governance/` → AI agent governance
- `docs/architecture/` → architecture and system design
- `docs/archive/` → superseded documents
- `docs/runbooks/` → user procedure runbooks 
- `docs/specs/` → product scope and requirements


Rule: if a document is replaced or heavily reworked, archive the
previous version instead of deleting.

------------------------------------------------------------------------

## Phase Numbering Convention

Phase structure: - `Phase N` → milestone delivery - `N.x` →
implementation step inside milestone - `N[A-Z]` → post-phase capability
expansion - `N[A-Z].x` → implementation step inside expansion

Rules: - `.x` always indicates an implementation step - Lettered phases
represent expansions - Use `1A`, not `1.A`

------------------------------------------------------------------------

## Final Note

Frequent change to this document indicates missing architectural
governance elsewhere.
