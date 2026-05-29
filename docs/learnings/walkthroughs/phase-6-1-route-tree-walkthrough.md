# Phase 6.1 Route Tree Walkthrough

## What You Are Building

You are building the first public browsing structure for the web app in
`apps/web`.

For Phase 6.1, the required outcomes are:

- routes for `/`, `/topics`, `/topics/[slug]`, `/articles`,
  `/articles/[slug]`, `/actions`, and `/actions/[slug]`
- shared global navigation for Home, Topics, Articles, and Actions
- a shared application layout wrapper for public browsing

This walkthrough is about repo edit order, not final styling or full API
rendering.

Historical note: this walkthrough predates the Phase 11.5 public route group
split. Current public route source now lives under
`apps/web/src/app/(public)/...`, while the paths below show the Phase 6.1
implementation-time source layout.

## Files And Folders Involved

Existing files:

- `apps/web/src/app/layout.tsx`
- `apps/web/src/app/page.tsx`
- `apps/web/src/app/globals.css`
- `apps/web/src/app/page.module.css`

Files and folders you will likely create:

- `apps/web/src/app/topics/page.tsx`
- `apps/web/src/app/topics/[slug]/page.tsx`
- `apps/web/src/app/articles/page.tsx`
- `apps/web/src/app/articles/[slug]/page.tsx`
- `apps/web/src/app/actions/page.tsx`
- `apps/web/src/app/actions/[slug]/page.tsx`

Files you will likely edit first:

- `apps/web/src/app/layout.tsx`
- `apps/web/src/app/page.tsx`
- `apps/web/src/app/globals.css`

Files you may remove or stop depending on:

- `apps/web/src/app/page.module.css`

If the new home page no longer uses it, removing that starter stylesheet is a
reasonable cleanup.

## Edit Order

### Step 1: Replace the starter app shell

Open:

- `apps/web/src/app/layout.tsx`

What to do:

- keep the root HTML structure
- keep the global CSS import
- replace starter metadata with SignalFire metadata
- add a shared page wrapper
- add global navigation using internal links
- add a `<main>` region that renders `children`

Why first:

This gives every later route the same shell and confirms your navigation model
before you add route files.

### Step 2: Replace the starter home page

Open:

- `apps/web/src/app/page.tsx`
- `apps/web/src/app/page.module.css`

What to do:

- remove the create-next-app starter content
- add a real SignalFire homepage aligned to Phase 6
- keep it simple: short mission statement and links to Topics, Articles, and
  Actions
- decide whether the old module CSS file is still useful

Why second:

The home page is part of the required route inventory and gives you a fast way
to verify the new layout works.

### Step 3: Create the three collection routes

Create:

- `apps/web/src/app/topics/page.tsx`
- `apps/web/src/app/articles/page.tsx`
- `apps/web/src/app/actions/page.tsx`

What to do:

- give each page a clear heading
- add one short explanatory sentence
- return simple placeholder structure first

Why third:

Collection pages are easier to verify than detail pages and establish the main
public navigation surface.

### Step 4: Create the three detail route folders

Create:

- `apps/web/src/app/topics/[slug]/page.tsx`
- `apps/web/src/app/articles/[slug]/page.tsx`
- `apps/web/src/app/actions/[slug]/page.tsx`

What to do:

- read the slug from route params
- render temporary placeholder content that proves the route works
- do not block on final API rendering yet

Why fourth:

Once these files exist, the full Phase 6.1 route tree is in place.

### Step 5: Make the navigation coherent

Re-open:

- `apps/web/src/app/layout.tsx`

What to do:

- verify the nav links match the exact route paths you created
- confirm Home, Topics, Articles, and Actions are always reachable
- make sure route-specific content does not leak into the shared layout

Why fifth:

This is the point where structure usually drifts. Rechecking the shell now is
faster than correcting it after data rendering begins.

### Step 6: Do a route-existence verification pass

Check:

- `/`
- `/topics`
- `/articles`
- `/actions`
- one sample slug path per detail route

What to do:

- verify each route renders something valid
- verify the shared navigation appears on each page
- verify internal links move between top-level sections

Why sixth:

You want proof that the route tree is stable before Phase 6.2 starts using real
API data.

## First Correct Structure

The first correct Phase 6.1 structure in this repo should look roughly like
this:

```text
apps/web/src/app/
  layout.tsx
  page.tsx
  globals.css
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
```

The pages do not need polished visuals yet. They do need:

- correct route placement
- clear page ownership
- shared navigation
- enough structure to support later Phase 6 work

## What “Done Enough” Looks Like For Phase 6.1

You are in a good state when:

- every required route file exists
- top-level navigation works
- the shared layout wraps every public route
- the starter Next.js homepage is gone
- detail routes prove they can read slug params
- no Event, search, filter, or pagination work has been added

## Ask-When-Stuck Prompts

- Should this UI live in `apps/web/src/app/layout.tsx` or inside one route page?
- What is the smallest valid placeholder I can return so this route exists?
- Why is this route not matching the URL I expect?
- Does this file belong under `topics/` or `topics/[slug]/`?
- Am I accidentally mixing Phase 6.1 route setup with Phase 6.2 data rendering?
