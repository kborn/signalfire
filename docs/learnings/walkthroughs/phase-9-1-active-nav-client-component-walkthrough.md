# Phase 9.1 Active Nav Client Component Walkthrough

## What You Are Building

You are not rebuilding the app shell.

You are making one Phase 9.1 improvement:

- the shared nav should mark the current route semantically with
  `aria-current="page"`

The likely implementation path is:

- keep the root layout as the shared shell
- move only the route-aware nav logic into a small dedicated component

## Files And Folders Involved

You will likely work in:

- `apps/web/src/app/layout.tsx`
- `apps/web/src/app/globals.css`
- one new shared nav component file under `apps/web/src/app/` or a nearby
  shared component location that fits the current app structure

Read before editing:

- `docs/specs/008-phase-9-ui-polish-spec.md`
- `docs/learnings/implementation-guides/phase-9-1-active-nav-and-aria-guide.md`
- `docs/learnings/implementation-guides/phase-9-1-client-components-for-active-nav-guide.md`

## Edit Order

### 1. Confirm the responsibility split

Before writing anything, restate the boundary clearly:

- `layout.tsx` owns shared shell structure
- the nav component owns route-aware link rendering
- `globals.css` owns visual styling

If your plan puts route logic, browser hooks, and shell concerns all in one
place, the boundary is probably too wide.

### 2. Identify the smallest client boundary

Decide which exact component needs browser route awareness.

The goal is not "make navigation client-side."

The goal is:

- identify the smallest unit that must know the current pathname

That is usually the nav-link rendering component, not the whole layout.

### 3. Extract the nav into its own component

Move the repeated nav link markup out of `layout.tsx` into a dedicated
component.

Do this before adding route-aware behavior so the component boundary is clear
first.

Sanity check:

- `layout.tsx` should become simpler after this step
- the nav component should receive either no props or only minimal structural
  props

### 4. Add client-only behavior only where needed

Once the nav has its own file, decide whether it needs `'use client'`.

Use this test:

- if the component needs a browser routing hook to determine the current path,
  add `'use client'` there
- do not add `'use client'` higher up unless you can justify why the parent also
  needs browser-only behavior

### 5. Add current-route matching logic

For each nav item, compare:

- the current route
- the nav item's destination

Then decide:

- does this link represent the current page?

If yes:

- add `aria-current="page"`

If no:

- omit the attribute

Avoid inventing a second source of truth like manual booleans for each link.

### 6. Verify the CSS contract still matches

Once the attribute exists in the rendered markup, make sure the CSS contract is
still the same:

- `.site-nav a`
- `.site-nav a:hover`
- `.site-nav a[aria-current='page']`

If you feel tempted to add new active classes, pause and ask whether the spec
already gave you the correct hook.

### 7. Check route behavior across the full nav set

Test the shared route set from the spec:

- `/`
- `/topics`
- `/articles`
- `/actions`
- `/events`

For each route, verify:

- exactly one nav link gets the semantic current-page marker
- hover behavior still works
- the current page styling is typographic, not pill/tab-like

## First Correct Structure

The first correct structure is not about exact code. It is about separation of
responsibilities:

- server layout:
  shared shell only
- dedicated nav component:
  route-aware nav rendering
- global stylesheet:
  baseline nav styling and active-state styling

If that separation is true, you are probably on the right path.

## Ask-When-Stuck Prompts

- Does this file truly need browser-only route state, or am I moving it to the client too early?
- Is `layout.tsx` still acting like shared shell, or have I made it responsible for too much logic?
- Am I setting `aria-current="page"` only on the matching link, or am I treating it like a generic styling flag?
- Did I preserve the spec's existing nav CSS hook instead of inventing a new active class?
- Is my client boundary the smallest possible boundary for this behavior?
