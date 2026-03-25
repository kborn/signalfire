# Phase 6.1 Routing and Page Structure Syllabus

## Purpose

This syllabus orients Phase 6.1 so you can build the first public browsing
structure in the Next.js app without drifting into later UI polish or backend
expansion.

## Current Task or Subtask

Phase 6.1 is the first frontend subtask of Phase 6.

You are building:

- Next.js routes for `/`, `/topics`, `/topics/[slug]`, `/articles`,
  `/articles/[slug]`, `/actions`, and `/actions/[slug]`
- global navigation linking Home, Topics, Articles, and Actions
- a shared application layout wrapper for public browsing

You are not building:

- Event UI
- search
- filtering
- pagination
- unpublished-content handling changes

## Prerequisites

Read these first:

- `docs/agent-governance/progress.md`
- `docs/specs/information-architecture.md`
- `docs/architecture/008-phase-5-topic-content-api-contracts.md`
- `apps/web/src/app/layout.tsx`
- `apps/web/src/app/page.tsx`

Know these basics before coding:

- folders under `src/app/` define routes in Next.js App Router
- `page.tsx` renders a route
- `layout.tsx` wraps routes beneath it
- `[slug]` creates a dynamic route segment

## Modules in Practical Build Order

### Module 1: Understand the route tree you are trying to create

**Objective**

Translate the Phase 6.1 task list into a concrete `src/app/` folder structure.

**Why it matters**

If the route tree is wrong, every later page and link will be built on the
wrong foundation.

**Key concepts**

- App Router file-system routing
- static route segments
- dynamic route segments
- route hierarchy

**Repo-specific context**

The web app currently has only the starter files:

- `apps/web/src/app/layout.tsx`
- `apps/web/src/app/page.tsx`

Phase 6.1 expands that into the public browsing tree used by later Phase 6
tasks.

**Small concrete example**

If you add `apps/web/src/app/topics/page.tsx`, that becomes `/topics`.

If you add `apps/web/src/app/topics/[slug]/page.tsx`, that becomes
`/topics/:slug`.

**Common mistakes**

- treating `[slug]` like a file name instead of a route segment
- creating one giant page instead of a route tree
- adding Event routes even though they are out of scope

**Short exercise**

Write out the exact folders and files Phase 6.1 needs before touching JSX.

### Module 2: Separate shared layout from page content

**Objective**

Decide what belongs in the root layout versus what belongs in each page.

**Why it matters**

Navigation and shared chrome should be defined once. Page content should stay
local to the route that owns it.

**Key concepts**

- root layout
- shared wrapper
- children rendering
- global navigation

**Repo-specific context**

`apps/web/src/app/layout.tsx` already defines the HTML shell and global CSS
import. Phase 6.1 should extend it into a public browsing layout, not replace
its purpose with route-specific content.

**Small concrete example**

Good split:

- `layout.tsx`: site header, nav, main wrapper
- `topics/page.tsx`: topics page heading and topic list area

Bad split:

- `layout.tsx`: full topic page content

**Common mistakes**

- putting route-specific headings into the root layout
- duplicating the same nav on every page
- mixing app shell work with page data decisions too early

**Short exercise**

List the 3-5 UI elements that should appear on every public page in Phase 6.1.

### Module 3: Build static pages before dynamic detail pages

**Objective**

Sequence the work so the route tree becomes stable early.

**Why it matters**

Static collection pages and navigation make it easier to verify that the
application shell works before introducing slug-based detail pages.

**Key concepts**

- route sequencing
- collection pages
- detail pages
- incremental verification

**Repo-specific context**

The Phase 6 route inventory depends on a predictable public navigation surface:

- `/`
- `/topics`
- `/articles`
- `/actions`
- `/topics/[slug]`
- `/articles/[slug]`
- `/actions/[slug]`

This structure matches the Phase 5 API handoff for the public discovery graph.

**Small concrete example**

A sensible order is:

1. root layout + nav
2. `/`
3. `/topics`, `/articles`, `/actions`
4. `[slug]` detail routes for each domain

**Common mistakes**

- starting with detail pages before the shared shell works
- combining routing work with final styling polish
- blocking on API fetch code before route files exist

**Short exercise**

Create a checklist that lets you verify each route returns a page before any
real API rendering is added.

### Module 4: Match page purpose to the information architecture

**Objective**

Make each route serve a clear discovery role instead of becoming a generic blog
screen.

**Why it matters**

Phase 6 is about Learn -> Decide -> Act navigation, not just rendering content.

**Key concepts**

- information architecture
- discovery entry points
- cross-linking intent
- page purpose

**Repo-specific context**

The canonical site sections are Home, Topics, Actions, Articles, Events, and
Submit, but Phase 6.1 only builds the public browsing routes for Home, Topics,
Articles, and Actions.

Phase 6.2-6.5 will later fill these routes with relationship-driven discovery.

**Small concrete example**

`/topics` is not just a list page. It is the primary discovery entry point into
the system, which means its structure should make topic exploration obvious.

**Common mistakes**

- treating all pages as interchangeable content lists
- giving equal weight to in-scope and out-of-scope sections
- designing around future search/filter controls

**Short exercise**

For each route, write one sentence answering: "Why would a user land here?"

### Module 5: Understand the API shapes only enough to avoid bad route decisions

**Objective**

Learn the public API surface that these pages will consume later, without
turning Phase 6.1 into a data-fetching task.

**Why it matters**

You need route names and page responsibilities to align with real backend
contracts, but Phase 6.1 does not need full rendering logic yet.

**Key concepts**

- contract-driven UI
- collection versus detail endpoints
- related content summaries

**Repo-specific context**

Phase 5 already established the public routes that Phase 6 consumes:

- `GET /topics`
- `GET /topics/:slug`
- `GET /articles`
- `GET /articles/:slug`
- `GET /actions`
- `GET /actions/:slug`

Those contracts are the boundary. Phase 6.1 should not require backend changes.

**Small concrete example**

You know `/articles/[slug]` needs to exist because the backend already exposes
article detail by slug. That is enough to set up the page file now.

**Common mistakes**

- inventing new frontend routes that do not map to the documented public APIs
- expanding scope into Events because the global IA mentions them
- trying to solve publication rules in the routing task

**Short exercise**

Match each planned frontend detail route to its existing public API endpoint.

## Recommended First Implementation Step

Replace the starter homepage and root layout with a minimal public app shell:

1. update `apps/web/src/app/layout.tsx` so it contains a shared wrapper and nav
2. replace `apps/web/src/app/page.tsx` with a real Phase 6 home page
3. create empty but valid collection routes for `topics`, `articles`, and
   `actions`
4. add the three `[slug]` detail route files after the shell is working

This gives you a stable route tree before you start Phase 6.2 data rendering.

## Vocabulary

- **App Router**: Next.js routing system based on files in `src/app/`
- **layout**: shared wrapper for a route subtree
- **page**: the UI for a specific route
- **dynamic segment**: a folder like `[slug]` that maps a URL part to a value
- **collection page**: a route that lists many records
- **detail page**: a route for one record

## Reading Checklist

- `docs/agent-governance/progress.md` Phase 6 and Phase 6.1
- `docs/specs/information-architecture.md`
- `docs/architecture/008-phase-5-topic-content-api-contracts.md`
- `apps/web/src/app/layout.tsx`
- `apps/web/src/app/page.tsx`

## Later Topics That Can Wait

- server data fetching details
- loading and error states
- component extraction
- visual polish
- Event UI
- search, filters, and pagination

## Suggested Next Learning Artifact

After this syllabus, the highest-value follow-up is:

- `implementation guide`: Next.js `layout.tsx`, `page.tsx`, and `[slug]` for
  Phase 6.1

That guide should explain the framework mechanics behind the route tree before
you start editing files.
