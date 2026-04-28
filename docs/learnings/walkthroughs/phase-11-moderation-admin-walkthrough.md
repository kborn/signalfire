# Phase 11 Moderation And Admin Walkthrough

## What You Are Building

You are building the first internal admin surface for this repo in this order:

1. `/admin` route shell
2. moderation queue
3. submission detail review
4. review actions and conversion workflows
5. create/edit flows for Actions, Articles, and Events

Do not try to build all of Phase 11 in one pass.

## Files And Folders Involved

Read before editing:

- `docs/specs/moderation-workflow.md`
- `docs/specs/009-phase-10-submission-spec.md`
- `docs/specs/011-phase-11-moderation-admin-ui.md`
- `docs/learnings/implementation-guides/phase-11-moderation-state-and-admin-form-guide.md`

Backend folders already involved:

- `apps/api/src/submission`
- `apps/api/src/action`
- `apps/api/src/article`
- `apps/api/src/event`
- `apps/api/src/topic`

Frontend folders likely involved:

- `apps/web/src/app`
- `apps/web/src/components`
- `apps/web/src/lib`

Frontend routes you will likely add:

- `apps/web/src/app/admin/page.tsx`
- `apps/web/src/app/admin/submissions/page.tsx`
- `apps/web/src/app/admin/submissions/[id]/page.tsx`
- `apps/web/src/app/admin/actions/page.tsx`
- `apps/web/src/app/admin/actions/new/page.tsx`
- `apps/web/src/app/admin/actions/[slug]/page.tsx`
- `apps/web/src/app/admin/articles/page.tsx`
- `apps/web/src/app/admin/articles/new/page.tsx`
- `apps/web/src/app/admin/articles/[slug]/page.tsx`
- `apps/web/src/app/admin/events/page.tsx`
- `apps/web/src/app/admin/events/new/page.tsx`
- `apps/web/src/app/admin/events/[id]/page.tsx`

Backend additions you will likely make:

- new submission moderation read/write endpoints
- new admin write endpoints for Action, Article, and Event modules
- tests covering queue reads, state transitions, and create/edit workflows

## Edit Order

### 1. Freeze the internal route tree first

Before building forms or actions, create the route skeleton for:

- `/admin`
- `/admin/submissions`
- `/admin/submissions/[id]`
- `/admin/actions`
- `/admin/articles`
- `/admin/events`

Why first:

Phase 11 needs one coherent internal namespace. Route sprawl gets messy fast if
you add screens ad hoc.

### 2. Build queue and detail read contracts before action buttons

In the API, define the read shapes needed for:

- moderation queue list
- submission detail page

In the web app, render those shapes plainly before adding mutation logic.

Why second:

If the list and detail contracts are unstable, every approve/reject UI decision
will churn.

### 3. Implement reject before approve

Add:

- review note persistence
- reject action
- invalid transition handling for already-reviewed submissions

Why third:

Reject is the smaller workflow. It lets you prove state-transition rules before
introducing conversion complexity.

### 4. Add the normalization form to submission detail

On the submission detail page, keep two separate blocks:

- raw submitted data
- editable normalization fields

Do not collapse them into one mixed form.

Why fourth:

The moderator needs to compare source input and publish-target output.

### 5. Implement article approval end to end

Choose one approval path first:

- article submission

Build:

- normalized article field validation
- Article record creation
- submission status update
- duplicate-conversion prevention
- confirmation through existing public Article reads

Why fifth:

One working article path gives you the pattern for the harder event path.

### 6. Implement event approval end to end

After article approval works, add the event path:

- normalized event field validation
- Event record creation
- location-field mapping
- confirmation through existing public Event reads

Why sixth:

Events have more fields and more mapping risk than Articles.

### 7. Add admin CRUD for curated Actions

Build Action create/edit first among the admin content types.

Why seventh:

Actions are curated-only and structurally simpler than Events.

### 8. Add admin CRUD for Articles

Reuse:

- internal page shell
- topic selector pattern
- status selector behavior

Why eighth:

Articles share more conceptual overlap with article-submission normalization.

### 9. Add admin CRUD for Events

Reuse the same internal page conventions, then add the fuller Event field set.

Why ninth:

Events are still the densest content form in the phase.

### 10. Finish with targeted tests and Phase 13 handoff notes

Add tests for:

- queue retrieval
- submission detail retrieval
- valid and invalid state transitions
- duplicate approval prevention
- conversion visibility through existing public reads
- one create/edit flow per content type

Also document:

- local-open-access assumption
- auth hardening requirement before deployment

Why last:

You want the tests and handoff notes to match the final workflow shape, not an
earlier draft.

## Practical Warnings

- Do not add deletion while building list pages.
- Do not add topic CRUD because topic selectors exist.
- Do not bury moderation errors in generic toast-only feedback.
- Do not couple admin auth work into the first implementation pass.
- Do not let one submission create multiple published records.

## Minimum First Milestone

If you need a tight first deliverable, stop after:

- `/admin/submissions`
- `/admin/submissions/[id]`
- pending queue read
- reject action
- article approval path

That is enough to prove the hardest architectural boundaries before broadening
into full admin CRUD.
