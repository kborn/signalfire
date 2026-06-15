# Phase 12.4 Pagination Hardening Walkthrough

## Purpose

This walkthrough is the concrete repo edit order for implementing Phase 12.4
pagination after the earlier Phase 12 filtering work already exists.

Use this when you want the shortest sane build order for the code changes.

## Read First

- `docs/agent-governance/progress.md`
- `docs/specs/014-phase-12-search-discovery-improvements.md`
- `docs/learnings/implementation-guides/phase-12-4-public-pagination-implementation-guide.md`

## Files You Will Likely Touch

Contracts:

- `packages/contracts/src/`

API:

- `apps/api/src/article/`
- `apps/api/src/action/`
- `apps/api/src/event/`

Web:

- `apps/web/src/lib/api/articles.ts`
- `apps/web/src/lib/api/actions.ts`
- `apps/web/src/lib/api/events.ts`
- `apps/web/src/app/(public)/articles/page.tsx`
- `apps/web/src/app/(public)/actions/page.tsx`
- `apps/web/src/app/(public)/events/page.tsx`

Tests:

- API route/controller/service tests in the same feature areas
- any existing public route/page tests for the three collection pages

Seed:

- `apps/api/prisma/seed.ts`

## Recommended Build Order

### Step 1: Lock the request and response shape

Before code changes, decide:

1. default `page`
2. default `pageSize`
3. allowed `pageSize` range or set
4. shared response metadata fields

Keep this consistent across Articles, Actions, and Events.

### Step 2: Update shared contract types

Add or update:

- list request types with `page` and `pageSize`
- paginated list response types

Do this first so both API and web code compile toward one shape.

### Step 3: Implement Article pagination backend

Start with the simplest collection.

Order:

1. controller query input
2. service defaults and validation flow
3. repository filter + count + paginated fetch
4. response envelope

Validate:

- unfiltered page 1
- unfiltered page 2
- topic-filtered page 1
- out-of-range page

### Step 4: Mirror the same pattern for Actions

Do not redesign the approach. Reuse the same structure.

Validate:

- unfiltered page 1
- unfiltered page 2
- topic-filtered page 1
- out-of-range page

### Step 5: Extend Events last

Events already carry more query state, so do them after the simpler two
collections are proven.

Validate:

- region-led finder query page 1
- same query page 2
- topic + region combination
- date-window combination
- out-of-range page

### Step 6: Update web API helpers

Move helpers from simple filter-only calls to typed param objects.

Target shape:

```ts
type EventListParams = {
  topicSlug?: string;
  startDate?: string;
  endDate?: string;
  region?: string;
  city?: string;
  page?: number;
  pageSize?: number;
};
```

The helper should include only defined params.

### Step 7: Add pagination UI to Articles and Actions

For each page:

1. read `searchParams`
2. normalize `page`
3. call the helper
4. render items
5. render previous/next links
6. preserve active filter params in navigation links

Do not let navigation links drop `topicSlug`.

### Step 8: Add pagination UI to Events

Same pattern, with one extra rule:

- preserve the active finder query exactly when moving between pages

Do not let page navigation accidentally clear:

- `region`
- `city`
- `topicSlug`
- `startDate`
- `endDate`

### Step 9: Harden empty states

Check these separately:

1. no records at all
2. no filtered matches
3. page beyond result range

Do not show misleading "no content exists" copy for a valid but empty filtered
state.

### Step 10: Expand demo seed volume

Only after the contract works, make local demo seed big enough to prove it.

Minimum useful target:

1. at least two pages of Articles
2. at least two pages of Actions
3. at least two pages of Events for one realistic finder query

Placeholder lorem-ipsum body content is fine.

### Step 11: Add tests

Backend:

1. page normalization
2. invalid page input
3. invalid page size input
4. filtered count correctness
5. out-of-range page behavior

Web:

1. previous/next link rendering
2. filter params preserved in links
3. page-reset behavior when filters change
4. empty state behavior

## Important Regressions To Watch

- page links that drop active filters
- unstable ordering causing item drift between pages
- page 3 surviving after a new filter is applied
- total count ignoring the active filter set
- Events page navigation triggering a broad browse mode by accident

## First Correct Path

If you want the shortest correct sequence:

1. contract types
2. Articles backend
3. Actions backend
4. Events backend
5. web helpers
6. Articles UI
7. Actions UI
8. Events UI
9. seed expansion
10. tests
