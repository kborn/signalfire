# Phase 11.5 Next.js Route Groups And CSS Boundaries Guide

## Why This Matters Now

Phase 11.5 gives the public application a distinct `Find Your Fight` identity:
new typography, a warm Field Guide palette, a public wordmark, and a new About
surface.

The app also contains an internal `/admin` interface. That interface should
remain restrained and operational rather than inheriting the full public brand
treatment.

The framework concept that separates those two experiences cleanly is a
Next.js App Router **route group** combined with explicit CSS wrapper
boundaries.

## The Current Problem

Today the root layout at:

- `apps/web/src/app/layout.tsx`

owns:

- the `<html>` and `<body>` elements
- public metadata
- the public navigation header
- the outer `container` and `site-main` presentation

Because every route is a descendant of the root layout, `/admin` is also
wrapped by that public header and public outer styling. The nested admin
layout can add admin UI, but it cannot remove markup already rendered by its
parent.

Plain-language rule:

> A child layout can add a shell inside its parent shell. It cannot opt out of
> the parent shell.

## The Layout Ownership You Need

Phase 11.5 needs three layout responsibilities:

| Layout        | Responsibility                                                |
| ------------- | ------------------------------------------------------------- |
| Root layout   | Required application document shell and global baseline only  |
| Public layout | `Find Your Fight` wordmark, public navigation, public styling |
| Admin layout  | Operational admin navigation and admin styling                |

That separation should look like:

```text
apps/web/src/app/
  layout.tsx
  (public)/
    layout.tsx
    page.tsx
    about/
      page.tsx
    topics/
    articles/
    actions/
    events/
    submit/
  admin/
    layout.tsx
    page.tsx
    submissions/
    articles/
    actions/
    events/
```

## What A Route Group Is

A route group is a folder whose name is wrapped in parentheses:

```text
(public)
```

It organizes layouts and files without becoming part of the URL.

| File path                      | Public URL |
| ------------------------------ | ---------- |
| `app/(public)/page.tsx`        | `/`        |
| `app/(public)/topics/page.tsx` | `/topics`  |
| `app/(public)/about/page.tsx`  | `/about`   |
| `app/admin/page.tsx`           | `/admin`   |

This is the central idea: the folder tree can express layout ownership without
changing the route the visitor sees.

## Why Not Leave The Public Shell In The Root Layout

If the public wordmark and navigation stay in `app/layout.tsx`, then the admin
interface still receives them:

```text
Root public header
  Admin internal header
    Admin page
```

That is not a styling inconvenience; it is an ownership problem. The root
layout would still be defining public product behavior for an internal route.

Instead, reduce the root layout to framework-wide behavior:

- import global CSS
- load truly shared font or reset concerns when appropriate
- render `<html>` and `<body>`
- render `children`

Then let sibling route areas own their own experience.

## How CSS Isolation Fits The Layout Split

Moving routes into `(public)` solves markup ownership. It does not by itself
prevent public CSS from affecting admin pages.

The app currently uses broadly named classes and global element selectors such
as:

- `body`
- `h1`, `h2`, `h3`
- `.page-section`
- `.pageTitle`
- `.primaryCTA`
- `.secondaryCTA`
- `.submissionControl`

Several of those classes are used in both public and admin pages. If you simply
replace their global definitions with the Field Guide design, admin pages will
change too.

Use an explicit wrapper on the public layout:

```tsx
<div className="publicShell">
  <header className="publicHeader">{/* public navigation */}</header>
  <main className="publicMain">{children}</main>
</div>
```

The existing admin layout already gives you an admin wrapper:

```tsx
<div className="adminShell">{children}</div>
```

Scope new identity-specific styling beneath `.publicShell`:

```css
.publicShell {
  background: var(--color-paper);
  color: var(--color-ink);
}

.publicShell h1,
.publicShell h2 {
  font-family: var(--font-display);
}

.publicShell .primaryCTA {
  background: var(--color-forest);
  color: var(--color-paper);
}
```

Keep only genuinely universal behavior unscoped:

```css
* {
  box-sizing: border-box;
}

a:focus-visible,
button:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 3px;
}
```

## Shared Classes Need Special Attention

The highest-risk shared classes are controls and buttons:

- admin pages currently use `.secondaryCTA`
- admin moderation forms reuse `.submissionControl`, `.submissionTextarea`,
  `.submissionCheckboxOption`, and `.submissionError`

That means you have two conservative choices:

1. Leave the existing shared baseline in place and layer new public rules under
   `.publicShell`.
2. Introduce public-specific component classes as you refresh pages, while
   retaining the old classes for admin.

For a first implementation, choice 1 is easier to validate and causes less
churn.

## Metadata Ownership

Public metadata currently lives in the root layout and names the site
`CivicSignal`. Once the root becomes neutral, place public default metadata in:

- `apps/web/src/app/(public)/layout.tsx`

That layout can own:

- title: `Find Your Fight`
- public description

The admin layout may later declare admin-specific metadata if that is useful.
It should not require a metadata refactor in order to complete the initial
layout split.

## Font Ownership

The Field Guide specification selects:

- `Instrument Serif` for public display text
- `Inter` for public body and interface text

Because those choices are part of the public identity, you can apply their
font variables or class names on `.publicShell`, rather than automatically
changing the admin interface typography.

This keeps the initial refactor honest:

- public pages receive the expressive editorial hierarchy
- admin pages remain stable unless you deliberately adjust them

## Moving Routes Does Not Change URLs

The public pages should move from:

```text
app/page.tsx
app/topics/
app/articles/
app/actions/
app/events/
app/submit/
```

to:

```text
app/(public)/page.tsx
app/(public)/topics/
app/(public)/articles/
app/(public)/actions/
app/(public)/events/
app/(public)/submit/
```

Because `(public)` is ignored in URL generation, links and API calls should
continue to use:

- `/`
- `/topics`
- `/articles`
- `/actions`
- `/events`
- `/submit`

Move colocated page tests with their corresponding route files so the route
tree and its tests stay understandable together.

## Common Mistakes To Avoid

- Creating `app/(public)/page.tsx` while leaving `app/page.tsx` in place; both
  resolve to `/` and conflict.
- Keeping the public nav in the root layout after creating a public route
  group; the admin route remains visually polluted.
- Applying paper backgrounds or display typography directly to `body`, `h1`,
  or shared CTA classes without verifying admin routes.
- Treating `/admin` as a public route only because it currently sits under the
  same root layout.
- Restyling every route before first proving that the layout split preserves
  existing URLs and behavior.

## A Safe Learning Sequence

1. Introduce `(public)` and move the public routes without altering their
   content.
2. Move public shell markup out of the root layout and into the public layout.
3. Verify `/`, `/topics`, `/submit`, and `/admin` render with the intended
   shell ownership.
4. Add `/about` inside `(public)`.
5. Apply public metadata, fonts, tokens, and wrapper-scoped Field Guide styles.
6. Refresh the homepage.
7. Extend the style patterns across public collections, details, and
   submission pages.

The first successful milestone is not a redesigned homepage. It is proving
that public and admin areas can evolve independently.
