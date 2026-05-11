# Phase 11.2 Review Actions Guide

This guide explains the concepts behind Phase 11.2 before you wire the code.
Phase 11.2 is about moderation decisions, not publication editing. Keep the
approval-time conversion details small until Phase 11.3 expands normalization.

## What Phase 11.2 Is Building

Phase 11.2 adds the backend behavior for:

- approving a pending submission
- rejecting a pending submission
- saving moderator review notes with the decision
- rejecting invalid state transitions
- preventing a submission from being converted or reviewed twice
- returning clear failures for missing submissions and invalid actions

The admin UI may expose the actions, but the main Phase 11.2 risk is backend
state correctness.

## Mental Model

Think of review actions as domain commands.

A command is different from a plain update because it has rules:

- the submission must exist
- the submission must currently be `PENDING`
- the action must be one of the allowed review decisions
- review notes must be persisted with the decision
- `reviewedAt` must be set at the same time as the decision
- approval must not create duplicate published-domain records

That logic belongs in the service workflow. Controllers should parse requests
and return responses. Repositories should persist data. The service should own
the moderation rules.

## Moderation Status Rules

Release 1 moderation status values are:

- `PENDING`
- `APPROVED`
- `REJECTED`

Valid Phase 11.2 transitions:

- `PENDING` to `APPROVED`
- `PENDING` to `REJECTED`

Invalid Phase 11.2 transitions:

- `APPROVED` to anything else
- `REJECTED` to anything else
- repeated approval
- repeated rejection
- approving a submission that already has a converted target record

The UI can hide invalid buttons, but the API still must enforce the rules.

## Review Notes

Review notes are internal moderation metadata. They should be stored on the
submission record with the decision.

Use the existing `reviewNotes` and `reviewedAt` fields on `Submission`.

For Phase 11.2, do not create a separate review-history model unless canonical
scope changes. Full audit/history tooling is explicitly outside the current
Release 1 requirement.

## Approve vs Reject

Reject is the smaller workflow:

1. Load the submission.
2. Confirm it is `PENDING`.
3. Save `status = REJECTED`.
4. Save `reviewNotes`.
5. Save `reviewedAt`.
6. Return the updated moderation detail.

Approve has the same state-transition rules, but it also touches publication
conversion. The Phase 11 canonical UI spec says approval creates a published
domain record and duplicate conversion must be prevented.

For Phase 11.2, keep the approve service boundary ready for conversion even if
the richer normalization work lands in Phase 11.3. Do not design approval as a
thin status update that will need to be thrown away.

## Transaction Boundary

Approval should be transactional.

The risky sequence is:

1. Create the target Article or Event.
2. Mark the submission as `APPROVED`.
3. Link the submission to the created target record.

If one step succeeds and another fails, the database can end up lying about
what happened. Use a repository method or Prisma transaction that commits the
conversion and submission update together.

Reject can be a single update, but it should still guard the transition in the
write path.

## Duplicate Protection

Duplicate protection should not rely only on the UI.

Use both:

- service checks before taking action
- database-backed persistence rules where the schema already supports them

The current schema has one-to-one links from `Submission` to `Article` and
`Event` through unique `articleId` and `eventId` fields. Approval should refuse
to run if either converted target link already exists.

## Failure Behavior

Use explicit failures:

- missing submission: not found
- invalid transition: bad request or conflict
- validation failure: bad request
- conversion failure: fail the whole action

Do not partially save a review decision if conversion fails.

For the UI, keep the failure inline on the submission detail page. Do not
redirect the moderator away from the review context.

## Contract Shape

The shared contracts should describe the request and response shape for review
actions.

The likely request shape is:

- decision: approve or reject
- review notes
- publish target for approval when needed
- normalized fields when approval conversion is implemented

The likely response shape is the updated moderation submission detail plus any
created-record metadata required by the UI.

Keep the contract small enough for Phase 11.2. Do not pull in all Phase 11.4
admin create/edit fields.

## Tests To Prioritize

Backend tests should prove:

- pending submission can be rejected
- rejection persists notes and reviewed timestamp
- pending submission can be approved through the service boundary
- approving or rejecting a missing submission fails clearly
- approving an already approved submission fails
- rejecting an already rejected submission fails
- approval does not run twice for a converted submission
- conversion and submission status update are atomic

Controller tests should stay lighter:

- route calls the service with parsed input
- invalid request body fails
- service errors become expected HTTP failures

## Scope Boundary

Do not add:

- authentication or authorization hardening
- topic management
- review-history tables
- bulk moderation actions
- deletion
- search or pagination improvements

Those are outside Phase 11.2 unless the canonical docs are changed first.
