# Phase 11 Moderation State And Admin Form Guide

## Concepts To Understand Now

- moderation state and publish state are different things
- review actions are domain actions, not just button clicks
- approval of a submission may also create a published record
- admin create/edit forms should reuse domain validation rules rather than
  inventing a parallel model

## Plain-Language Explanations

### Moderation status vs publish status

A submission uses moderation status:

- `pending`
- `approved`
- `rejected`

An Action, Article, or Event uses publish status:

- `draft`
- `published`

These are not interchangeable.

A submission can be `approved`, while the created content record may still be
saved as `draft` if the review action was "approve as draft".

### Why approval is more than a status update

For Phase 11, approval means:

1. validate that the submission is still `pending`
2. accept normalized editorial fields
3. create the target published record
4. mark the submission as approved
5. prevent the same submission from converting a second time

That is why approval belongs in a service-layer workflow rather than in a thin
controller method.

### Why raw submission data should remain visible

Moderators need to compare:

- what the submitter sent
- what will actually be published

If the UI only shows editable normalized fields, you lose the review context.

The clean mental model is:

- raw submission section = evidence
- normalization form = editorial output

### Why admin forms should match the domain model

The fastest path is not "whatever fields are convenient in the UI."

The fastest safe path is:

- use canonical fields from the domain specs
- validate them with the same backend rules used by the public domain
- keep topic selection tied to the seeded topic list

That keeps the admin surface from drifting away from the actual content model.

## Tiny Worked Examples

### Example: valid moderation transition

Input:

- submission status: `pending`
- moderator chooses `Approve and Publish`

Result:

- normalized fields are validated
- published record is created with `published` status
- submission becomes `approved`

### Example: invalid moderation transition

Input:

- submission status: `approved`
- moderator clicks another approve action

Result:

- action is rejected
- UI should show a clear invalid transition error or suppress the action

### Example: approve as draft

Input:

- submission status: `pending`
- moderator chooses `Approve as Draft`

Result:

- submission becomes `approved`
- created Article or Event record is stored as `draft`

This is why the two status systems must stay separate in your head.

## Main Implementation Shapes

### Shape 1: Moderation queue read path

You need:

- list endpoint for submissions by status
- detail endpoint for one submission
- enough returned metadata to avoid database inspection during review

This is the first implementation slice because it stabilizes the review UI.

### Shape 2: Moderation action service

You need one service workflow that owns:

- approve validation
- reject validation
- review note persistence
- conversion branching by submission type
- duplicate prevention

The service should be the place that understands whether the submission becomes
an Article or an Event.

### Shape 3: Admin create/edit forms

You need a reusable form pattern for:

- Actions
- Articles
- Events

The reusable pattern is not "one giant form component for all content."

The reusable pattern is:

- consistent page structure
- consistent validation boundaries
- consistent submit behavior
- per-entity field lists and route identifiers

## How This Appears In The Repo Today

Existing backend modules:

- `apps/api/src/submission`
- `apps/api/src/action`
- `apps/api/src/article`
- `apps/api/src/event`
- `apps/api/src/topic`

Existing frontend public routes:

- Phase-time examples used `apps/web/src/app/actions`,
  `apps/web/src/app/articles`, `apps/web/src/app/events`, and
  `apps/web/src/app/submit`
- Current public route source lives under `apps/web/src/app/(public)/...`

What Phase 11 adds conceptually:

- internal `/admin` route tree in the web app
- moderation read/write endpoints in the API
- admin write endpoints for Actions, Articles, and Events

## Recommended Approach For This Repo

Recommendation: implement Phase 11 in four slices.

### Slice 1: Queue and detail reads

Build:

- admin route structure
- submission list endpoint
- submission detail endpoint

Why first:

You need stable data shape before wiring actions.

### Slice 2: Reject workflow

Build:

- review notes persistence
- reject action
- invalid transition handling

Why second:

Reject is simpler than approve because it does not create published content.

### Slice 3: Approval and conversion

Build:

- normalization form inputs
- approve as published
- approve as draft
- article conversion
- event conversion

Why third:

This is the highest-risk workflow and deserves its own focused pass.

### Slice 4: Admin CRUD for curated content

Build:

- Actions create/edit
- Articles create/edit
- Events create/edit

Why fourth:

By this point you already understand the internal UI shell, the topic selector
pattern, and the validation boundary.

## Questions To Ask Yourself While Implementing

- Is this field part of the raw submission, the normalized output, or both?
- Am I changing moderation status, publish status, or both?
- Can this action run twice by mistake?
- Does the public content become visible through existing read surfaces?
- Did I accidentally introduce a new scope area such as topic management or
  auth?
