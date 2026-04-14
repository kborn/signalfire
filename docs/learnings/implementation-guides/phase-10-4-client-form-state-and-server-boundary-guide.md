# Phase 10.4 Client Form State And Server Boundary Guide

This guide explains the frontend concepts that matter immediately for Phase
10.4: where the page should fetch initial data, why the form itself still needs
to be interactive, and when a form library is justified.

Relevant canonical context:

- `docs/specs/009-phase-10-submission-spec.md`
- `docs/specs/010-phase-10-4-submission-ui.md`

## Concepts To Understand Now

- server-first page fetching in the Next App Router
- a small client component for interactive form behavior
- passing server-fetched data into a client child
- controlled form state for validation and submit UX
- when a form library helps and when it is just extra abstraction

## Plain-Language Explanations

### Why the page should stay server-first

The submission pages need approved topics before the form is useful.

That data is part of the initial page render, not browser-only state. So the
clean first move is:

- let the route page fetch topics on the server
- render the page with the topic options already available
- avoid a browser-side loading spinner just to get the first correct version

This keeps the initial data boundary simple and matches the existing repo
pattern used for public browsing pages.

### Why the form itself still needs a client component

The form has real browser interaction needs:

- field state
- inline validation messages
- pending submit state
- success and failure transitions
- preserving entered values after an error

Those are valid reasons to use a client component.

The correct mental model is not:

- "this feature is client-side"

It is:

- "the page is server-fetched, and the form is the small interactive client
  boundary"

### What the server-to-client handoff looks like

The route page fetches the approved topics and renders a form component.

Conceptually:

1. server page calls the topics API helper
2. server page receives the approved topic list
3. server page passes those topic values into the form component as props
4. client form manages user interaction and submission

That means the browser does not need to fetch topics after mount just to render
the form correctly.

### Why this does not mean the whole route becomes client-rendered

A client child inside a server page is still a server-first route.

The page can keep:

- server data fetching
- page-level structure
- initial render of headings and layout

Only the interactive form file needs `'use client'`.

This is the same boundary discipline used elsewhere in the repo:

- keep browser-only behavior in the smallest possible component
- do not widen the client boundary without a concrete reason

### Do you need a form library for Phase 10.4

Not by default.

The Phase 10.4 forms are large enough to require care, but not so large that a
library is automatically the best choice.

A hand-rolled form is completely reasonable here if it can clearly handle:

- current field values
- inline errors
- top-level submission errors
- submit disabling while the request is in flight
- success state replacement after submit

Using a form library is only worth it if it removes real complexity in this
repo. It is not stronger portfolio signal by itself.

For this project state, the stronger signal is:

- clean server/client boundary
- disciplined shared contract usage
- predictable form behavior
- clear tests around submission flows

### What "controlled form state" means here

Controlled form state means React state is the source of truth for the current
field values shown in the UI.

That is useful here because the form must react to:

- user typing
- validation errors
- submit attempts
- API failures
- success replacement state

You do not need an advanced state machine to achieve this. A small amount of
explicit component state is enough for the first correct implementation.

## Tiny Worked Examples

### Example 1: The boundary decision

Ask:

- is this data needed for the first page render?

If yes:

- fetch it in the server page

Ask:

- does this UI need browser interaction after render?

If yes:

- isolate that UI in a client component

### Example 2: The Phase 10.4 page shape

Conceptually:

```tsx
export default async function SubmitArticlePage() {
  const topics = await getTopicsList();

  return <ArticleSubmissionForm topics={topics.items} />;
}
```

Important idea:
The page owns initial data loading. The form owns interaction.

### Example 3: The wrong reason to add a form library

Weak reason:

- "Big forms usually use a library."

Better reason:

- "This repo already standardizes on one library and it clearly reduces boilerplate without hiding the submission contract."

## How This Appears In The Repo Today

Existing repo patterns already support the intended Phase 10.4 shape:

- `apps/web/src/app/topics/page.tsx` shows a server page fetching initial data
- `apps/web/src/lib/api/topics.ts` shows route-level API helper usage
- `apps/web/src/app/navbar.tsx` shows a narrow `'use client'` boundary for
  browser-side behavior
- `packages/api-contracts/submission_type.ts` already defines the submission
  request shape

That means Phase 10.4 does not need a new architectural model. It mainly needs
the same discipline applied to an interactive form.

## Tiny Rules Of Thumb

- If the data is needed before the page is usable, fetch it on the server.
- If only the form interaction needs the browser, keep only the form client-side.
- Start with plain React state before adding a form library.
- A form library is a tool, not a portfolio achievement by itself.
- Shared contract types should shape the request boundary, not compete with it.

## Pointed Questions To Ask When Blocked

- Does this route need browser-side fetching, or can the server page provide the initial data?
- Which exact component needs `'use client'`, and am I making the boundary wider than necessary?
- Am I adding a form library because it solves a real problem, or because it feels standard?
- Is my form state design preserving values and errors clearly after failed submission attempts?
- Am I keeping the UI aligned to the API contract instead of inventing a second ruleset in the browser?
