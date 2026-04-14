# Phase 10.4 Public Submission Form Walkthrough

## What You Are Building

You are building the public submission entry flow for Phase 10.4:

- `/submit`
- `/submit/article`
- `/submit/event`

The intended implementation shape is:

- server-render the route pages
- fetch approved topics before rendering
- pass topics into interactive client form components
- submit both forms through the single `POST /api/submissions` API contract

This walkthrough is about repo edit order, not final styling polish.

## Files And Folders Involved

Read before editing:

- `docs/specs/009-phase-10-submission-spec.md`
- `docs/specs/010-phase-10-4-submission-ui.md`
- `docs/learnings/implementation-guides/phase-10-4-client-form-state-and-server-boundary-guide.md`
- `docs/learnings/implementation-guides/phase-10-3-zod-request-validation-guide.md`

Existing frontend files likely involved:

- `apps/web/src/app/globals.css`
- `apps/web/src/lib/api/base.ts`
- `apps/web/src/lib/api/topics.ts`

Files you will likely create:

- `apps/web/src/app/submit/page.tsx`
- `apps/web/src/app/submit/article/page.tsx`
- `apps/web/src/app/submit/event/page.tsx`
- one or more submission form components under a shared component location
- one frontend API helper for submission creation under `apps/web/src/lib/api/`

Files you will likely add tests for:

- `apps/web/src/app/submit/page.test.tsx`
- tests for the article and event route pages
- tests for the interactive form component(s)

## Edit Order

### 1. Confirm the boundary before writing code

Restate the split in concrete terms:

- route pages fetch approved topics on the server
- form components own browser interaction
- the backend remains the source of truth for validation

If your first plan fetches topics in `useEffect`, pause and ask whether that is
actually required by the spec. For this phase, it is not.

### 2. Add the route pages first

Create:

- `apps/web/src/app/submit/page.tsx`
- `apps/web/src/app/submit/article/page.tsx`
- `apps/web/src/app/submit/event/page.tsx`

What to do first:

- render headings and support copy from the Phase 10.4 UI spec
- keep the pages server-rendered
- make the chooser page link to the two form routes

Why first:

This gives the feature a visible route skeleton before form complexity starts.

### 3. Add the server-side topic fetch path

Use the existing API helper pattern as the model.

What to do:

- fetch approved topics in the article and event route pages
- pass the resulting topic list into the form component as props
- decide the page-level response for empty topics or fetch failure

Why third:

The form contract depends on topics. That dependency should be solved at the
route boundary before browser state is introduced.

### 4. Create the interactive form component boundary

Add the smallest client-side form component(s) needed.

What they should own:

- current field values
- inline validation display
- submit-pending state
- success state replacement
- request failure messaging

What they should not own:

- topic fetching
- route-level page structure
- authoritative validation rules that contradict the API

### 5. Add the submission request helper

Create a frontend API helper that sends the submission request using the shared
contract shape.

Why now:

The form should submit through one clear boundary instead of building ad hoc
`fetch` calls inline in JSX event handlers.

Keep the public contract shape aligned with:

- `packages/api-contracts/submission_type.ts`
- `docs/specs/009-phase-10-submission-spec.md`

### 6. Implement article submission first

Build the article flow before the event flow.

Why:

- fewer fields
- simpler payload shape
- easier place to prove the form-state and success/error model

What to verify:

- required fields block submit
- optional contact fields work
- success replaces the form
- failed submit preserves values

### 7. Implement event submission second

Once the article flow works, add the event-specific fields and payload mapping.

Be strict about:

- static event enum usage from shared contracts
- exact location field mapping
- optional supporting links
- optional `endDatetime`

This is where most drift risk lives, so follow the spec field order carefully.

### 8. Do a final UX and contract pass

Check:

- headings and copy match the UI spec
- `Topics` are required in both forms
- email helper text is present
- no extra required fields were invented
- `author` is not required or exposed in the public UI
- both forms still submit to one API path

## First Correct Structure

The first correct repo shape should look roughly like this:

```text
apps/web/src/app/
  submit/
    page.tsx
    article/
      page.tsx
    event/
      page.tsx

apps/web/src/components/
  submission/
    ...

apps/web/src/lib/api/
  submissions.ts
```

The exact component filenames can vary, but the responsibility split should not:

- route pages for server data loading and page structure
- client form components for interaction
- API helper for submission requests

## What "Done Enough" Looks Like For Phase 10.4

You are in a good state when:

- all three public submission routes render
- article and event forms receive approved topics from the server
- the interactive form behavior lives in a narrow client component boundary
- both forms submit through the shared API contract
- success and failure behavior matches the spec
- no client-side topic fetch was added without a real need

## Ask-When-Stuck Prompts

- Should this logic live in the server route page or inside the client form component?
- Am I preserving the one-submission-API model, or am I drifting into separate frontend systems?
- Did I prove the article flow first before taking on the more complex event flow?
- Is this validation helping UX only, or am I accidentally redefining the backend contract in the browser?
- Would this abstraction still make sense if I had to explain it clearly in a portfolio walkthrough?
