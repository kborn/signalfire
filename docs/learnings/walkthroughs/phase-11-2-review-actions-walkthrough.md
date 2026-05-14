# Phase 11.2 Review Actions Walkthrough

This walkthrough gives you the concrete build order for Phase 11.2. It assumes
Phase 11.1 already created the admin shell and moderation read paths.

## Read Before Editing

- `docs/agent-governance/progress.md`
- `docs/specs/moderation-workflow.md`
- `docs/specs/011-phase-11-moderation-admin-ui.md`
- `docs/learnings/implementation-guides/phase-11-2-review-actions-guide.md`
- `docs/learnings/implementation-guides/phase-11-moderation-state-and-admin-form-guide.md`

## Files Likely Involved

Backend:

- `packages/api-contracts/submission_type.ts`
- `packages/api-contracts/index.ts`
- `apps/api/src/submission/moderation-submission.controller.ts`
- `apps/api/src/submission/moderation-submission.controller.spec.ts`
- `apps/api/src/submission/submission.service.ts`
- `apps/api/src/submission/submission.service.spec.ts`
- `apps/api/src/submission/submission.repository.ts`
- `apps/api/src/submission/submission.repository.types.ts`
- `apps/api/src/submission/submission.test-fixtures.ts`

Frontend, if you wire buttons in this slice:

- `apps/web/src/app/admin/submissions/[id]/page.tsx`
- `apps/web/src/app/admin/submissions/page.tsx`
- `apps/web/src/lib/api`

## Build Order

### 1. Define the review action contract

Start in `packages/api-contracts/submission_type.ts`.

Add small types for:

- review decision
- review action request
- review action response
- created-record metadata if approval returns it in this slice

Keep names explicit. For example, prefer a moderation-specific name over a
generic `UpdateSubmissionRequest`.

Why first:

The controller, service tests, and frontend call site need one shared shape.

### 2. Add service tests for reject first

Write the expected behavior before touching controller routes.

Cover:

- a pending submission becomes `REJECTED`
- `reviewNotes` is persisted
- `reviewedAt` is set
- the returned detail reflects the new state
- missing submission throws not found
- approved or rejected submissions cannot be rejected again

Why second:

Reject proves the state-transition rule without the extra conversion work.

### 3. Add repository write methods

Add narrow repository methods for the service workflow.

You will likely need:

- find submission by id for review
- update submission as rejected
- update submission as approved
- approval transaction support when conversion is included

Do not expose a generic "update anything" repository method. The repository API
should make invalid persistence flows harder to write.

### 4. Implement the reject service workflow

In `SubmissionService`, add a moderation action method or explicit reject
method.

The method should:

1. load the submission
2. throw not found if missing
3. reject anything that is not `PENDING`
4. persist notes, `REJECTED`, and `reviewedAt`
5. return the same detail shape used by the detail page

Keep the mapping reuse simple. If the existing detail mapper works for the
updated submission, use it.

### 5. Add the controller endpoint

Add a write route under `admin/submissions`.

Reasonable options:

- `POST /admin/submissions/:id/review`
- `POST /admin/submissions/:id/reject` and a later approve route

Prefer one review route if the request body cleanly carries the decision. Use
separate routes if the approval body becomes too different from rejection.

Update controller tests for:

- valid request parsing
- invalid body behavior
- service delegation

### 6. Wire minimal UI controls

On `apps/web/src/app/admin/submissions/[id]/page.tsx`, replace the disabled
Phase 11.1 action controls with real controls only when the submission is
pending.

For rejected or approved submissions:

- do not show active decision buttons
- show the current reviewed state
- show notes as read-only unless you intentionally support note edits

For pending submissions:

- keep the review note textarea
- add a reject confirmation step
- submit to the review endpoint
- show inline success or failure

Do not auto-redirect after a mutation.

### 7. Add approval through the same service boundary

After reject works, add approval.

At minimum, approval must:

- reject missing submissions
- reject non-pending submissions
- persist notes
- set `reviewedAt`
- prevent duplicate conversion

If this slice creates Article/Event records, do it in a transaction and return
created-record metadata for the UI. If normalization is deferred to 11.3, keep
the approval code shaped so conversion can be added without replacing the
service method.

### 8. Add invalid-transition tests

Add tests that cover:

- approve approved submission
- approve rejected submission
- reject approved submission
- reject rejected submission
- approve submission with an existing `articleId`
- approve submission with an existing `eventId`

These tests are the real safety net for Phase 11.2.

### 9. Check the admin detail page behavior

Manually verify:

- pending submissions show decision controls
- rejected submissions do not show approve/reject controls
- approved submissions do not show approve/reject controls
- success stays on the detail page
- failure stays on the detail page
- status and reviewed timestamp update after success

### 10. Run focused validation

Run the targeted backend tests first.

Then run the broader validation normally used for this repo:

- backend unit tests around submission
- backend controller tests around moderation submission
- web tests if UI mutation behavior was added
- lint/typecheck if contracts changed

## Implementation Notes

Keep Phase 11.2 boring in the right places:

- one service owns moderation rules
- repository methods are narrow
- controller logic is thin
- UI reflects backend state instead of trusting local assumptions
- failed approval does not save a partial review decision

## Done Checklist

- [ ] Review action contract exists
- [ ] Reject action works for pending submissions
- [ ] Approve action uses the correct service boundary
- [ ] Review notes persist with decisions
- [ ] `reviewedAt` is set with decisions
- [ ] Invalid transitions fail
- [ ] Duplicate conversion is prevented
- [ ] Missing submissions fail clearly
- [ ] Backend tests cover transition rules
- [ ] UI surfaces success and failure inline if wired in this slice
