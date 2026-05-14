# Phase 11.3 Editorial Normalization Walkthrough

This walkthrough gives the concrete build order for Phase 11.3. It assumes
Phase 11.1 created the admin read surfaces and Phase 11.2 added review action
state-transition rules.

## Read Before Editing

- `docs/agent-governance/progress.md`
- `docs/specs/011-phase-11-moderation-admin-ui.md`
- `docs/specs/009-phase-10-submission-spec.md`
- `docs/learnings/implementation-guides/phase-11-2-review-actions-guide.md`
- `docs/learnings/implementation-guides/phase-11-3-editorial-normalization-guide.md`

## Files Likely Involved

Backend:

- `packages/api-contracts/submission_type.ts`
- `apps/api/src/submission/moderation-submission.controller.ts`
- `apps/api/src/submission/moderation-submission.service.ts`
- `apps/api/src/submission/moderation-submission.service.spec.ts`
- `apps/api/src/submission/submission.repository.ts`
- `apps/api/src/submission/submission.repository.types.ts`
- `apps/api/test/submission`
- `apps/api/test/article`
- `apps/api/test/event`
- `apps/api/test/topic`

Frontend:

- `apps/web/src/app/admin/submissions/[id]/page.tsx`
- `apps/web/src/lib/api`
- admin submission detail components if the page has been split up

## Build Order

### 1. Reconcile the canonical field list with the current contract

Start by comparing:

- `docs/specs/011-phase-11-moderation-admin-ui.md`
- `packages/api-contracts/submission_type.ts`
- `apps/api/prisma/schema.prisma`

Confirm the Article approval shape includes every field needed to create an
Article. Pay special attention to `author`: the Article model requires it.
The UI should package that value into the approval request from submitted
credited author when present, or `anonymous` when submitted author is missing.

Do the same check for Event fields, especially `addressRaw`, city, region, and
country. The Event model allows some location fields to be nullable, but the UI
spec marks `locationName`, `eventType`, `startTime`, and topics as required.

### 2. Confirm backend approval mapping

Review the approval methods in the moderation service and repository.

Article approval should map:

- normalized title to Article title
- generated slug from normalized title
- normalized summary to Article summary
- normalized content to Article content
- normalized author to Article author
- publish status to Article status
- `PUBLISHED` status to `publishedAt = reviewedAt`
- `DRAFT` status to `publishedAt = null`
- normalized topic slugs to TopicArticle records

Event approval should map:

- normalized title to Event title
- normalized summary to Event summary
- normalized description to Event description
- normalized event type to Event event type
- normalized dates to Event start/end times
- normalized location fields to Event location fields
- normalized website to Event website
- publish status to Event status
- `PUBLISHED` status to `publishedAt = reviewedAt`
- `DRAFT` status to `publishedAt = null`
- normalized topic slugs to TopicEvent records

The repository write should remain transactional and should keep duplicate
conversion protection in the write path.

### 3. Add or tighten backend validation tests

Before changing the UI, make the backend behavior explicit.

Cover Article approval:

- creates an Article from normalized fields
- links selected topics
- saves review notes and reviewed timestamp on the Submission
- links the Submission to the Article
- returns created Article metadata
- rejects unknown topic slugs
- rejects approval for an Event submission
- rejects already-reviewed submissions

Cover Event approval:

- creates an Event from normalized fields
- links selected topics
- sets optional fields to `null` when omitted
- saves review notes and reviewed timestamp on the Submission
- links the Submission to the Event
- returns created Event metadata
- rejects unknown topic slugs
- rejects approval for an Article submission
- rejects already-reviewed submissions

### 4. Add public visibility integration coverage

This is the acceptance-test layer for Phase 11.3.

For Article:

1. Create a pending article submission.
2. Approve it with normalized fields and `PUBLISHED`.
3. Assert the public article detail/list surface can see the created Article.
4. Assert topic public reads include it when linked to a topic.
5. Assert moderation-only data is not present in public response bodies.

For Event:

1. Create a pending event submission.
2. Approve it with normalized fields and `PUBLISHED`.
3. Assert the public event detail/list surface can see the created Event.
4. Assert topic public reads include it when linked to a topic.
5. Assert moderation-only data is not present in public response bodies.

Also add draft checks:

- approve Article as `DRAFT` and assert public Article reads do not expose it
- approve Event as `DRAFT` and assert public Event reads do not expose it

### 5. Build the admin normalization form

Before adding editable controls, replace any remaining placeholder submission
detail data with the real moderation detail API response for
`/admin/submissions/[id]`.

The page should use real data for:

- header metadata
- submitted content
- submitted topics
- submitted author
- submitted event metadata and location fields
- existing moderation status and reviewed timestamp

If topic checkbox options are not already available on the page, fetch the real
seeded topic list before wiring the topic controls.

On the submission detail page, keep two separate sections:

- submitted content: read-only raw submission fields
- editorial normalization: editable approval payload fields

Prefill normalization state from submitted content:

- Article title, summary, content, topics, and author if used
- Event title, summary, description, event metadata, location fields, website,
  and topics

Use seeded topics as checkbox options. The submitted topics should be checked by
default.

Do not persist normalization edits independently. They should only be sent with
the successful approval action.

### 6. Wire approval buttons to publish status

Use the same normalized form state for both approval buttons:

- `Approve and Publish` submits `publishStatus: 'PUBLISHED'`
- `Approve as Draft` submits `publishStatus: 'DRAFT'`

The request decision must match the submission type:

- article submission sends `decision: 'APPROVE_ARTICLE'`
- event submission sends `decision: 'APPROVE_EVENT'`

Keep rejection using the reject request shape. Rejection should not submit
normalization fields.

### 7. Surface created-record metadata

After approval, stay on the submission detail page and show:

- success banner
- updated moderation status
- reviewed timestamp
- created record type
- created record id
- created record publish status
- admin link to the created record when that route exists

Do not show another approve button after success.

### 8. Manually verify the workflow

Verify an article path:

- raw submitted fields remain visible
- normalized fields are editable
- approval creates the Article from normalized values
- public Article views show published records only
- repeat approval fails or is unavailable

Verify an event path:

- raw submitted fields remain visible
- normalized fields are editable
- approval creates the Event from normalized values
- public Event views show published records only
- repeat approval fails or is unavailable

### 9. Run focused validation

Start narrow:

- submission service tests
- moderation submission controller tests
- Article/Event public read integration tests touched by the new coverage
- web tests around the admin submission detail page if present

Then run the normal repo validation for changed packages:

- lint
- typecheck
- relevant test suites

## Done Checklist

- [ ] Normalization field list is reconciled with the current contract
- [ ] Article approval creates Article records from normalized fields
- [ ] Event approval creates Event records from normalized fields
- [ ] Approval uses transactional duplicate-protected conversion
- [ ] Moderation-only fields stay on Submission
- [ ] Public responses do not expose moderation-only fields
- [ ] Published approved records are visible through public read surfaces
- [ ] Draft approved records are not visible through public read surfaces
- [ ] Admin UI keeps raw submitted content separate from editable normalization
- [ ] Approval success shows created-record metadata
