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
