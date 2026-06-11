# Moderation Workflow

## Submission Lifecycle

Submitted → Pending Review → Approved / Rejected

## Moderator Actions

Moderators can:

- approve submissions
- reject submissions
- leave review notes

Approved submissions become publicly visible.

## Interface Boundary

In Release 1, moderation and essential admin editing are part of the same internal interface.

- The interface may remain openly reachable during local-only development and other non-deployed work.
- Before any deployed environment intended for real users, the interface must be protected by authentication/authorization.
- Auth hardening is a deployment-readiness requirement, not a prerequisite for beginning moderation implementation.

## Release 1 Admin Access Model

Release 1 uses a single internal user type for this interface:

- `admin`

Release 1 does not include:

- moderator/admin permission splits
- public signup
- invitation flows
- password reset flows
- admin-user management UI

Admin users may be created and managed manually for Release 1 through database,
seed, or one-off script operations. That manual operational path is sufficient
for the initial project release.

## Release 1 Phase Scope

Phase 11 covers:

- moderation queue listing
- submission detail review
- approval and rejection actions
- moderator review notes
- editorial normalization required before publication
- approval-time conversion of submissions into published records
- essential admin create/edit flows for Actions, Articles, and Events

Phase 11 does not require:

- production-ready auth before local implementation starts
- granular role systems
- topic management beyond selecting from the seeded topic set
- full audit/history tooling unless later required by implementation

## Release 1 Article Markdown Normalization

Published Article pages render the Article title from structured metadata.
Moderation and editorial normalization should therefore enforce a simple body
structure contract before publication.

Release 1 editorial rules:

- remove a top-level body H1 if it duplicates the page title
- begin the body with a lead paragraph rather than another top-level title
- use H2 for major sections
- use H3 sparingly for subsections
- prefer lists for steps, watch-fors, or resource groupings when they improve
  scanability
- keep action-oriented closing guidance explicit rather than ending abruptly
- do not rely on raw HTML in published article bodies

These rules are editorial normalization guidance for Release 1 moderation. They
do not require a separate authoring system or automated markdown rewriting.
