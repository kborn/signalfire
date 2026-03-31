# Phase 9.1 Client Components For Active Nav Guide

## Concepts To Understand Now

For this Phase 9.1 task, you only need a narrow slice of the client-component
model:

- server components are still the default in the Next App Router
- `'use client'` marks a file that must run in the browser
- browser-only routing hooks require a client component
- a small client component can live inside a server-rendered layout
- this does not mean the whole page or app has become client-rendered

## Plain-Language Explanations

### What a client component is

A client component is a React component file that begins with `'use client'`.

That directive tells Next:

- this component needs browser-side React behavior
- this component can use client-only hooks and interactivity
- this component can be rendered from a server component above it

Think of it as an escape hatch for UI that depends on browser state.

### Why the active-nav case is different from plain links

A plain nav can stay server-rendered because it only outputs static links.

An active nav is different because it needs to know which route is currently
open. In practice, that means the nav needs access to the current pathname.

If the cleanest way to get that pathname is a browser routing hook, then that
small nav component becomes a valid client-component use case.

### Why this is not scope creep

This repo's existing guidance is already:

- server components by default
- client components only when browser-only behavior is needed

That is exactly what is happening here.

The task is still:

- render the overall shell in `layout.tsx`
- keep the nav text-first and simple
- add semantic active-link behavior

The task is not:

- move page fetching into the browser
- add client-side state management for the app
- redesign routing around client rendering

### When `'use client'` is justified here

For this specific task, `'use client'` is justified if the component needs one
of the browser-aware routing APIs to determine the current route.

The critical question is:

- can this shared layout logic know the current route cleanly on the server?

If not, a tiny client nav component is the correct move.

### What stays server-side

Even if the nav links move into a client component, all of this can remain
server-first:

- the root `layout.tsx`
- route pages
- server data fetching
- public page rendering structure

The browser-only part is just the route-aware nav behavior.

## Tiny Worked Examples

### Example 1: The boundary idea

Server side:

- root layout renders header, main shell, and a child nav component

Client side:

- nav component reads the current pathname
- nav component compares pathname to each nav item
- nav component adds `aria-current="page"` to the matching link

### Example 2: The decision test

Ask:

- does this component only render static structure and links?

If yes:

- keep it server-side

Ask:

- does this component need browser route state to decide which link is active?

If yes:

- a tiny client component is justified

### Example 3: The wrong reason to use a client component

This would be a weak reason:

- "I want to use a client component because it feels more React-like."

This would be a good reason:

- "I need browser route state to set the semantic active-link attribute."

## How This Appears In The Repo Today

Current repo state:

- `apps/web/src/app/layout.tsx` owns the shared shell and nav markup
- `apps/web/src/app/globals.css` already has the nav selectors
- active-link semantics are not implemented yet

What this task likely changes:

- `layout.tsx` stays the shared server layout
- the nav links may move into a small dedicated component
- that dedicated component may need `'use client'`

## Implementation Shape To Aim For

The clean implementation shape is usually:

1. keep `layout.tsx` responsible for shared shell structure
2. extract the nav link list into a dedicated component
3. make only that dedicated nav component client-side if route-aware logic needs it
4. keep styling in `globals.css`
5. verify only the current route gets `aria-current="page"`

This keeps the browser-only logic isolated instead of spreading `'use client'`
across the app.

## Common Mistakes

- putting `'use client'` on `layout.tsx` just because one small child needs it
- moving page fetching into the browser to solve a nav-highlighting problem
- treating `aria-current` as a custom app flag instead of a semantic attribute
- adding local state when the route pathname is the real source of truth
- styling an active nav state without also marking it semantically

## Tiny Rules Of Thumb

- start server-first
- move the smallest possible boundary to the client
- use `'use client'` because a browser-only feature is required, not because the
  component feels interactive
- if only one child needs browser state, keep the parent layout server-side
- if the current pathname decides the UI, the component reading it may need to
  be client-side
