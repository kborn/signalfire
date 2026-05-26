# Phase 11 - Moderation And Admin Interface Spec

## Goal

Define the Release 1 internal moderation and admin interface in enough detail
that engineering does not need to infer route structure, page hierarchy, field
order, primary actions, or state behavior.

This document is the canonical product and UI contract for Phase 11.

It expands:

- `docs/specs/moderation-workflow.md`
- `docs/specs/009-phase-10-submission-spec.md`
- `docs/agent-governance/progress.md`

It does not expand Release 1 scope beyond the existing Phase 11 boundary.

---

## 1. Scope Boundary

Phase 11 includes:

- moderation queue listing
- submission detail review
- approve and reject actions
- moderator review notes
- editorial normalization before publication
- conversion of approved submissions into published Article or Event records
- admin create/edit flows for Actions, Articles, and Events

Phase 11 does not include:

- deployed-environment auth implementation
- granular role systems
- topic management
- audit history tooling
- notifications
- automated enrichment such as slug generation, parsing, or AI rewriting

---

## 2. Interface Model

Release 1 uses one internal interface surface for moderation and admin content
management.

### Route namespace

Use `/admin` as the internal route prefix.

### Required Phase 11 routes

- `/admin`
- `/admin/submissions`
- `/admin/submissions/[id]`
- `/admin/actions`
- `/admin/actions/new`
- `/admin/actions/[slug]`
- `/admin/articles`
- `/admin/articles/new`
- `/admin/articles/[slug]`
- `/admin/events`
- `/admin/events/new`
- `/admin/events/[id]`

### Interface sections

The internal interface contains four primary sections:

1. dashboard entry
2. moderation queue
3. curated content management
4. create/edit forms

### Navigation requirements

Internal navigation must expose:

- `Submissions`
- `Actions`
- `Articles`
- `Events`

Do not add Topic management in Release 1.

---

## 3. Shared Page Rules

All admin pages should feel like one coherent internal tool surface rather than
public-site pages with ad hoc forms.

### Shared top-level page order

Every Phase 11 page should use this structure:

1. page header
2. page-level success or error state when present
3. primary action row when applicable
4. main content area

### Layout rules

- use a simple internal-app layout
- prioritize scanability over marketing-style presentation
- use one main content column per page, with optional secondary metadata panels
  only on submission detail pages
- avoid decorative cards wrapping the entire page
- keep repeated lists tabular or dense-list oriented rather than editorial
  card grids

### Loading rules

Pages must distinguish:

- initial loading
- loaded empty state
- loaded populated state

Phase 11 may use simple loading copy or lightweight skeletons. It does not
require elaborate placeholders.

### Mutation success behavior

After a successful mutation:

- stay on the current page
- show an inline success banner near the top of the page
- update visible state immediately when practical, including status and relevant
  timestamps

Do not auto-redirect after successful mutations in Phase 11.

### Timestamp rules

Use consistent timestamp treatment across the interface:

- show a human-readable local timestamp in the UI
- backend may additionally carry ISO timestamps in API responses
- `submitted timestamp` means when the submission was created
- `reviewed timestamp` means when approval or rejection was recorded
- `updated timestamp` means the last edit time for the content record

### Status vocabulary

Use the existing canonical statuses only:

- Submission moderation: `pending`, `approved`, `rejected`
- Publish state for Actions, Articles, and Events: `draft`, `published`

Do not introduce extra statuses such as `archived`, `in_review`, `scheduled`,
or `needs_revision` in Phase 11.

### Topic rules

- topics remain selected from the seeded topic set
- topics are assignable in admin forms
- topics are not editable or creatable in admin
- topic selection uses multi-select checkbox lists in Phase 11

## 4. `/admin` - Entry Page

### Purpose

Provide one internal landing page with clear paths into moderation and content
management.

### Page composition

#### Section 1 - Header

- H1: `Admin`
- dek: `Review submissions and manage published content`

#### Section 2 - Moderation overview

Show simple moderation counts with pending submissions as the primary work
queue and approved/rejected submissions as secondary history views:

- pending submissions count, visually emphasized
- approved submissions count, visually secondary
- rejected submissions count, visually secondary

Pending should link to the matching filtered submissions view. Approved and
rejected may also link to matching filtered submissions views, but they should
not be presented as equally urgent work queues.

Do not add charts or analytics.

#### Section 3 - Content management overview

Show compact rows or panels for the admin-managed content areas:

1. `Actions`
2. `Articles`
3. `Events`

Each row or panel should include:

- label
- one-sentence explanation
- link or CTA into that section

The content management overview should make the broader admin surface visible
without making Actions, Articles, or Events feel like moderation work queues.

---

## 5. `/admin/submissions` - Moderation Queue

### Purpose

Provide a scan-friendly queue view for all submission records.

### Segmentation model

The queue must support three segments:

- `Pending`
- `Approved`
- `Rejected`

Default segment: `Pending`

### Filtering

Phase 11 requires only these filters:

- status segment
- submission type: `article`, `event`

Do not add search, sort-builder UIs, assignee filters, or saved views.

### Row fields

Each queue row must show:

- submission title
- submission type
- submission type badge
- current moderation status
- submitted date
- submitter name when present, otherwise `Anonymous`
- submitter email when present

### Row actions

Each row links to its detail page at `/admin/submissions/[id]`.

Do not allow approve or reject directly from the list in the first Phase 11
spec. Review decisions belong on the detail page.

### Empty states

Use direct, low-friction empty states:

- no pending submissions
- no approved submissions
- no rejected submissions
- no submissions matching the current type filter

Use a consistent empty-state pattern:

- headline
- one-sentence explanation
- optional CTA when useful

---

## 6. `/admin/submissions/[id]` - Submission Review

### Purpose

Provide the canonical moderation review surface for a single submission.

### Top-level layout

Use a single review workflow column with operational submission metadata near
the top of the page.

### Header requirements

Show:

- `Back to submissions` link
- submission title
- submission type
- moderation status
- submitted timestamp
- submitter name when present, otherwise `Anonymous`
- submitter email when present
- submission id
- reviewed timestamp when present

### Main column section order

Render sections in this order:

1. submitted content
2. editorial normalization
3. review notes
4. decision actions

### Section 1 - Submitted content

This section displays the raw submitted data in read-only form.

#### Article submission fields

Render in this order:

1. title
2. summary
3. article content
4. topics
5. supporting links
6. credited author when present

#### Event submission fields

Render in this order:

1. title
2. summary
3. event description
4. event type
5. start time
6. end time
7. location name
8. street address when present
9. city
10. region
11. country
12. postal code
13. website when present
14. contact email when present
15. topics

### Section 2 - Editorial normalization

This section contains the editable fields that will become the published record
if the submission is approved.

The normalization form must start prefilled from the submission data.

Raw submission data must remain visible separately from normalization fields.

Normalization edits do not persist independently in Phase 11.

They are saved only as part of a successful approval action.

#### Article normalization fields

Render in this order:

1. title
2. summary
3. content
4. topics
5. status

Rules:

- topic selection uses a multi-select checkbox list
- status defaults to `published` on approval flow
- only `draft` and `published` are valid values
- article author is derived from submitted credited author when present
- article author defaults to `anonymous` when submitted credited author is missing
- slugs are system-generated on create
- slugs are immutable after creation in Phase 11
- no manual slug field is required by this spec

#### Event normalization fields

Render in this order:

1. title
2. summary
3. description
4. event type
5. start time
6. end time
7. location name
8. street address when present
9. city
10. region
11. country
12. postal code
13. website when present
14. topics
15. status

Rules:

- topic selection uses a multi-select checkbox list
- status defaults to `published` on approval flow
- only `draft` and `published` are valid values

Required Event normalization fields:

- title
- event type
- start time
- location name
- city
- region
- country
- postal code
- topics

Optional Event normalization fields:

- summary
- description
- end time
- street address
- website
- status

### Section 3 - Review notes

Provide one notes field for moderator-entered internal notes.

Rules:

- notes are internal only
- notes may be recorded for either approval or rejection
- notes are not part of public published content

### Section 4 - Decision actions

Show action buttons based on current moderation status.

#### Pending submission actions

- `Approve and Publish`
- `Approve as Draft`
- `Reject`

Approval buttons control publish status directly:

- `Approve and Publish` forces `published`
- `Approve as Draft` forces `draft`

If a visible status field exists in the normalization form, it must reflect the
chosen approval action and must not conflict with the clicked approval button.

#### Approved submission actions

- no second approval action
- show a read-only confirmation that the submission has already been approved
- allow note edits only if implementation chooses to support them

#### Rejected submission actions

- no approve action in Phase 11
- show a read-only rejected state

Reject requires a lightweight confirmation step before submission.

### State-transition rules

- `pending` -> `approved` is valid
- `pending` -> `rejected` is valid
- `approved` -> any other state is invalid in Phase 11
- `rejected` -> any other state is invalid in Phase 11

### Failure behavior

Surface explicit inline failures for:

- submission not found
- invalid transition
- publish conversion failure
- validation failure in normalization fields

Do not silently partial-save review actions.

When multiple validation fields fail, the form may also show a top-of-form
validation summary in addition to field-level errors.

### Success behavior

After approval or rejection:

- stay on the submission detail page
- show an inline success banner near the top of the page
- update moderation status immediately
- update reviewed timestamp immediately

After approval, also show a `Created article` or `Created event` subsection in
the review outcome area with:

- the created record title
- publish status of the created record
- a contextual action link:
  - `View live page` for published records
  - `Open in admin` for draft records

The created-record link destination follows publish state:

- published records link to the public article or event detail page so a
  moderator can inspect the live result
- draft records link to the corresponding admin article or event route so
  editorial work can continue before publication

During staged implementation of Phase 11.6, an admin draft detail route may
temporarily resolve to its admin collection/fallback page until full content
editing views are complete.

---

## 7. Conversion Rules

### General rule

Approval converts the reviewed submission into a published-domain record using
the normalization fields, not the raw submission payload directly.

### Article conversion outcome

Approving an article submission creates an Article record that:

- uses normalized title
- uses normalized summary
- uses normalized content
- uses selected topics from the seeded topic set
- uses the chosen publish state

### Event conversion outcome

Approving an event submission creates an Event record that:

- uses normalized title
- uses normalized summary
- uses normalized description
- uses normalized event metadata
- uses normalized location fields
- uses selected topics from the seeded topic set
- uses the chosen publish state

### Duplicate-protection rule

Once a submission has been converted through approval, Phase 11 must prevent a
second conversion for that same submission.

---

## 8. Content Management Lists

Phase 11 needs dense management lists for Actions, Articles, and Events.

### Shared list behavior

Each content list page should provide:

- page header
- `Create` primary action
- dense row list
- content type badge when useful for scanability
- publish status per row
- edit link per row

### Required list fields

#### Actions list

- title
- action type
- status
- updated timestamp

#### Articles list

- title
- status
- updated timestamp

#### Events list

- title
- event type
- start time
- status
- updated timestamp

Do not require pagination, bulk actions, or deletion in Phase 11.

---

## 9. Action Create And Edit

### Routes

- `/admin/actions`
- `/admin/actions/new`
- `/admin/actions/[slug]`

### Form purpose

Support creation and editing of curated Actions.

### Field order

Render fields in this order:

1. title
2. summary
3. description
4. action type
5. topics
6. status

### Status behavior

- new actions default to `draft`
- admin may change status to `published`

### Topic selection

Use a multi-select checkbox list.

### Primary actions

- on create page: `Create Action`
- on edit page: `Save Changes`
- secondary action: `Cancel`

`Cancel` returns to `/admin/actions` with no extra confirmation required by
this phase.

---

## 10. Article Create And Edit

### Routes

- `/admin/articles`
- `/admin/articles/new`
- `/admin/articles/[slug]`

### Form purpose

Support creation and editing of editorial Articles.

### Field order

Render fields in this order:

1. title
2. summary
3. content
4. topics
5. status

### Status behavior

- new articles default to `draft`
- admin may publish directly

### Slug behavior

- article slugs are system-generated on create
- article slugs are immutable afterward in Phase 11
- the slug is not directly editable in the form

### Topic selection

Use a multi-select checkbox list.

### Primary actions

- on create page: `Create Article`
- on edit page: `Save Changes`
- secondary action: `Cancel`

`Cancel` returns to `/admin/articles` with no extra confirmation required by
this phase.

---

## 11. Event Create And Edit

### Routes

- `/admin/events`
- `/admin/events/new`
- `/admin/events/[id]`

### Form purpose

Support creation and editing of editorial Events.

### Field order

Render fields in this order:

1. title
2. summary
3. description
4. event type
5. start time
6. end time
7. location name
8. street address when present
9. city
10. region
11. country
12. postal code
13. website when present
14. topics
15. status

### Status behavior

- new events default to `draft`
- admin may publish directly

### Required Event fields

- title
- event type
- start time
- location name
- city
- region
- country
- postal code
- topics

### Optional Event fields

- summary
- description
- end time
- street address
- website
- status

### Topic selection

Use a multi-select checkbox list.

### Primary actions

- on create page: `Create Event`
- on edit page: `Save Changes`
- secondary action: `Cancel`

`Cancel` returns to `/admin/events` with no extra confirmation required by
this phase.

---

## 12. Shared Form Rules

These rules apply to normalization and admin create/edit forms.

### Input behavior

- labels appear above inputs
- required fields are identified in label text
- helper text appears directly below labels when needed
- field errors appear directly below the related control
- preserve entered values on validation failure

### Validation boundary

- backend validation remains the source of truth
- frontend validation mirrors required rules for usability
- topic selection must use the seeded topic set

### Save behavior

- disable primary submit action while request is in flight
- prevent duplicate submit
- keep errors in-page and in context
- show an inline success banner after successful create or edit

When multiple fields fail validation, the form may also show a top-of-form
validation summary in addition to field-level errors.

### Unsaved-change behavior

Phase 11 does not require a custom unsaved-changes warning system.

---

## 13. Explicitly Deferred

The following remain out of scope for this phase even if useful later:

- delete flows
- restore flows
- merge flows
- audit trail UI
- revision history
- role-based permissions beyond the future Phase 13 auth boundary
- topic CRUD
- moderation assignment
- comment threads
- notifications
- dashboards beyond basic queue counts

---

## 14. Acceptance Standard

Phase 11 is complete when:

- the internal `/admin` surface exists
- moderators can browse submissions by status
- moderators can inspect one submission in detail without database access
- moderators can record review notes
- pending submissions can be approved or rejected with valid one-way transitions
- approved article submissions can become Article records
- approved event submissions can become Event records
- admin can create and edit Actions, Articles, and Events
- admin forms use only seeded topics
- failure states are explicit and testable
- Phase 13 auth hardening requirements remain documented as a deployment
  boundary, not silently omitted
