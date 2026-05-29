# Phase 11.5 Public And Admin Layout Split Walkthrough

## What You Are Building

Before applying the Field Guide visual identity, separate the public route
shell from the admin route shell.

The result should be:

- public pages use a dedicated public layout that can become `Find Your Fight`
- admin pages no longer receive public navigation or brand presentation
- public URLs remain unchanged
- styling can be introduced behind a `.publicShell` boundary without
  unintentionally redesigning the admin interface

This walkthrough covers repository edit order. The canonical visual
requirements remain in:

- `docs/specs/012-phase-11-5-public-experience-visual-identity.md`

Historical note: this walkthrough was written before the split was applied.
Current public route source now lives under `apps/web/src/app/(public)/...`;
the pre-split paths below describe the phase-time starting point.

## Current Repo Shape

Relevant existing files:

- `apps/web/src/app/layout.tsx`
- `apps/web/src/app/globals.css`
- `apps/web/src/app/navbar.tsx`
- `apps/web/src/app/page.tsx`
- `apps/web/src/app/topics/`
- `apps/web/src/app/articles/`
- `apps/web/src/app/actions/`
- `apps/web/src/app/events/`
- `apps/web/src/app/submit/`
- `apps/web/src/app/admin/layout.tsx`
- `apps/web/src/app/admin/`

Current ownership issue:

- `app/layout.tsx` renders the public navigation above all routes.
- `app/admin/layout.tsx` adds the admin navigation inside that public shell.
- visual changes made at the root can therefore affect `/admin`.

## Target Route Tree

Build toward:

```text
apps/web/src/app/
  layout.tsx
  globals.css
  navbar.tsx
  (public)/
    layout.tsx
    page.tsx
    about/
      page.tsx
    topics/
      page.tsx
      [slug]/
        page.tsx
    articles/
      page.tsx
      [slug]/
        page.tsx
    actions/
      page.tsx
      [slug]/
        page.tsx
    events/
      page.tsx
      [id]/
        page.tsx
    submit/
      page.tsx
      article/
        page.tsx
      event/
        page.tsx
  admin/
    layout.tsx
    ...
```

Move any colocated tests beneath the same moved public folders.

## Edit Order

### Step 1: Create The Public Route Group

Create:

- `apps/web/src/app/(public)/`

Move these current public route entries into it:

- `apps/web/src/app/page.tsx`
- `apps/web/src/app/topics/`
- `apps/web/src/app/articles/`
- `apps/web/src/app/actions/`
- `apps/web/src/app/events/`
- `apps/web/src/app/submit/`

Include each route's colocated tests in the move.

Do not move:

- `apps/web/src/app/admin/`
- `apps/web/src/app/error.tsx`
- `apps/web/src/app/not-found.tsx`
- `apps/web/src/app/globals.css`
- `apps/web/src/app/navbar.tsx`

Reason:

- admin already has its own route namespace
- root error/not-found handling can remain shared until a public-specific
  requirement exists
- global CSS must continue to be imported by the root layout
- the nav-link helper may still be shared by public and admin navigation

Checkpoint:

- there must be only one page file resolving to `/`
- `app/page.tsx` should no longer exist once `app/(public)/page.tsx` exists

### Step 2: Reduce The Root Layout

Edit:

- `apps/web/src/app/layout.tsx`

Remove from root ownership:

- public metadata naming `CivicSignal`
- public `<header>` and public route links
- public `container` and `site-main` class assumptions

Keep root ownership:

- global stylesheet import
- `<html lang="en">`
- `<body>`
- rendering `children`

At this checkpoint, root layout should not make a visitor-facing product
decision for either public or admin pages.

### Step 3: Add The Public Layout

Create:

- `apps/web/src/app/(public)/layout.tsx`

Initially, keep the visual change small. This layout should own:

- a `.publicShell` wrapper
- the public `<header>`
- a `.publicMain` region that renders `children`
- the existing public navigation routes

You can then incrementally apply the Phase 11.5 changes in this file:

- metadata title and description
- `Find Your Fight` wordmark link
- public nav labels including `Issues` and `About`
- restrained `Submit a Resource` CTA

Reason for adding it before styling:

- you can prove that shell ownership is correct before changing the visual
  system

### Step 4: Verify Shell Separation Before Styling

Run the web app and inspect:

- `/`
- `/topics`
- `/articles`
- `/actions`
- `/events`
- `/submit`
- `/admin`
- `/admin/submissions`

Expected result:

- public routes render the public header
- admin routes render the admin header only
- the URLs have not acquired a `/public` prefix
- the public pages still fetch/render their existing content

Also run relevant frontend tests now. A layout move is easier to debug before
font, CSS, and copy changes are mixed in.

### Step 5: Add The About Route

Create:

- `apps/web/src/app/(public)/about/page.tsx`

Use the content and hierarchy requirements in the Phase 11.5 spec:

- eyebrow: `Why This Exists`
- heading: `You cannot fight everything.`
- explanation of overwhelm, focus, and participation
- links to Issues, Actions, and Events

Add `About` to the public navigation only, not to admin navigation.

### Step 6: Add Public Style Boundaries

Edit:

- `apps/web/src/app/globals.css`

Introduce Field Guide tokens, but apply product identity styling beneath the
public wrapper:

- `.publicShell`
- `.publicHeader`
- `.publicMain`
- public wordmark/nav classes

Be cautious with existing classes shared by admin:

- `.page-section`
- `.pageTitle`
- `.secondaryCTA`
- `.submissionControl`
- `.submissionTextarea`
- `.submissionError`

For the initial styling pass, either:

- retain their existing baseline and override public appearances with
  `.publicShell ...`, or
- add new public-specific classes where that is clearer

Do not replace shared global definitions first and hope admin remains intact.

### Step 7: Apply Fonts And Metadata

Edit:

- `apps/web/src/app/(public)/layout.tsx`

Apply:

- `Instrument Serif` display font to the public brand/heading surface
- `Inter` sans font to the public interface/body surface
- public metadata naming `Find Your Fight`

Keep the font application within the public wrapper unless you deliberately
want the admin typography to change.

### Step 8: Refresh The Homepage First

Edit:

- `apps/web/src/app/(public)/page.tsx`

Use the spec's required hierarchy:

1. hero: `Find Your Fight`
2. issue-first invitation
3. Actions and Events pathways
4. About philosophy prompt

Why homepage first:

- it exercises the wordmark, typography, palette, CTAs, and section rhythm in
  one visible route
- it reveals whether the Field Guide tokens work before you propagate them

### Step 9: Extend The Pattern Across Public Routes

Continue through:

- Topics/Issues collection and detail
- Articles collection and detail
- Actions collection and detail
- Events collection and detail
- public submission landing and forms

Use existing API contracts. Do not add backend work solely because a visual
idea wants unavailable metadata.

## Verification Order

### After route moves

- route URLs render as before
- public header is absent on `/admin`
- existing frontend tests pass or identified failures reflect moved test paths

### After About and public shell work

- public metadata says `Find Your Fight`
- About is reachable from public nav
- admin nav remains operational
- keyboard focus can reach every public navigation action

### After visual pass

- validate mobile `375px`, tablet `768px`, and desktop `1280px`
- validate public homepage, About, one detail path per content type, Events
  collection, and submission forms
- verify admin pages did not inherit display typography, paper marketing
  layouts, or public CTA treatment unintentionally

## Stop And Review Point

Before applying the full Field Guide CSS across every public page, stop after:

- the route group exists
- root and public layouts are split
- `/admin` no longer renders the public header
- the new About page routes correctly

That checkpoint is the right moment for review because structural mistakes are
still easy to correct and are not hidden behind a large style diff.
