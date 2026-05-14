# Phase 10.4 Public Submission Form Walkthrough

## What You Are Building

You are building the public submission flow for Phase 10.4 in this order:

- `/submit` chooser page
- `/submit/article` article submission route
- `/submit/event` event submission route

The important implementation shape is:

- server route page fetches required initial data
- client form component owns browser interaction
- both forms submit to the same `POST /api/submissions` API contract

For now, the best learning path is:

1. finish the article form first
2. prove the submit flow end to end
3. reuse the same structure for the event form

Do not try to solve article and event at the same time.

## Files And Folders Involved

Read before editing:

- `docs/specs/009-phase-10-submission-spec.md`
- `docs/specs/010-phase-10-4-submission-ui.md`
- `docs/learnings/implementation-guides/phase-10-4-client-form-state-and-server-boundary-guide.md`
- `docs/learnings/implementation-guides/phase-10-4-plain-react-forms-and-validation-guide.md`

Frontend files already involved:

- `apps/web/src/app/submit/page.tsx`
- `apps/web/src/app/submit/article/page.tsx`
- `apps/web/src/app/submit/event/page.tsx`
- `apps/web/src/components/article-submission.tsx`
- `apps/web/src/app/globals.css`
- `apps/web/src/lib/api/topics.ts`

Frontend files you will likely add next:

- `apps/web/src/lib/api/submissions.ts`
- tests for the article form component
- tests for article submit success and failure behavior

Files likely involved soon after:

- `apps/web/src/components/event-submission.tsx`
- tests for the event form component

## Edit Order

### 1. Freeze the article route boundary first

Before adding real fields, confirm the split:

- `apps/web/src/app/submit/article/page.tsx` fetches approved topics
- `apps/web/src/components/article-submission.tsx` is the client form

Why first:

If this boundary is wrong, every later form decision gets messier.

### 2. Build the article form as static sections before adding state

In `apps/web/src/components/article-submission.tsx`, render the Phase 10.4
article form sections in the exact spec order:

1. Basic Information
2. Article Content
3. Supporting Links
4. Contact Information

Start by rendering:

- one semantic `<form>` element for the interactive article form
- the shared submission primitive classes from `docs/specs/010-phase-10-4-submission-ui.md`
- labels
- text inputs
- textareas
- topic checkbox list
- submit button

Do not add validation logic yet. Just get the correct visible structure on the
screen first.

Why second:

It is easier to reason about form state after the visible shape is correct.
Using the real `<form>` element now also gives you the correct place to attach
submit handling later.

### 3. Add one explicit state object for current field values

Once the static fields exist, add React state for the values the user types.

For the article form, that likely means fields for:

- `title`
- `summary`
- `content`
- `topicSlugs`
- `resourceLinks`
- `submitterName`
- `submitterEmail`

Start simple:

- strings for text fields
- string array for selected topic slugs
- string array or one textarea string for supporting links

Why third:

This is the point where the form becomes interactive, but still without network
or validation complexity.

### 4. Make each field a controlled input

After state exists, connect each input to that state:

- each input shows the current React value
- each input updates React state on change

Do not move on until you can answer:

- where does the current title live?
- where does the selected topic list live?
- what code changes those values?

Why fourth:

If you do not understand controlled inputs first, validation and submit logic
will feel random later.

### 5. Add a separate error state object

Once values are controlled, add an `errors` object.

This object should hold UI-facing validation errors such as:

- missing title
- missing summary
- missing content
- no selected topics
- invalid email format when email is present

Do not try to mirror every backend rule immediately. Start with the obvious UI
checks from the spec.

Why fifth:

The form now has enough structure for inline validation to make sense.

### 6. Add submit-time validation only

When the user clicks submit:

1. prevent the default browser submit
2. validate the current values
3. if invalid, set inline errors and stop
4. if valid, build the request payload

Do not add validation on every keystroke yet unless you find a specific reason
to do so.

Why sixth:

Submit-time validation is simpler to learn and matches the Phase 10.4 spec.

### 7. Add the frontend submission helper

Once the form can produce valid local data, create
`apps/web/src/lib/api/submissions.ts`.

That helper should:

- accept the public submission request shape
- send the request to the backend
- return the result in a predictable shape

Why now:

The form should not hide network logic inside a large JSX file.

### 8. Wire real submit behavior into the article form

Add:

- pending state
- global submit failure state
- success state replacement

The article form should now:

- block invalid submit
- preserve entered values after failure
- replace the form on success

Why eighth:

This is the first fully useful version of the Phase 10.4 article flow.

### 9. Add article-form tests before cloning the pattern to event

Test the article form for:

- rendering required fields
- topic list rendering from props
- inline errors on missing required fields
- success state after valid submit
- preserved values after failed submit

Why ninth:

You want the article pattern stable before you copy it into the more complex
event form.

### 10. Reuse the article pattern for event

Only after the article flow is stable, implement the event form with the same
shape:

- server page fetches topics
- client form owns interaction
- controlled inputs
- error object
- submit helper
- success replacement

Be stricter for event-specific details:

- event type enum from shared contract
- exact location field mapping
- `US` default for country
- optional `endTime`

## First Correct Structure

The first correct structure for the article flow should look roughly like this:

```text
apps/web/src/app/submit/article/
  page.tsx

apps/web/src/components/
  article-submission.tsx

apps/web/src/lib/api/
  submissions.ts
```

Responsibility split:

- `page.tsx`:
  server fetch for topics and route-level render
- `article-submission.tsx`:
  controlled inputs, errors, submit handler, success state
- `submissions.ts`:
  frontend API boundary for the submission request

## What "Done Enough" Looks Like For The Article Form

You are in a good state when:

- the page still fetches topics on the server
- the client form renders the correct fields in spec order
- topic checkboxes come from the `topics` prop
- the form uses controlled inputs
- submit-time validation shows inline errors
- a valid submit calls one frontend API helper
- success replaces the form
- failed submit keeps user-entered values

## Ask-When-Stuck Prompts

- Am I trying to build event complexity before proving the simpler article flow?
- Did I finish the visible form structure before adding state and validation?
- Can I point to the exact state that owns each input's current value?
- Is this validation helping the user, or am I trying to recreate the backend in the browser?
- Does this logic belong in the client form, or should it live in the route page or API helper instead?
