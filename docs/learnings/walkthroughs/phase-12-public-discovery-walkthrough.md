# Phase 12 Public Discovery Walkthrough

## What You Are Building

You are building the first real public-discovery scaling pass for Release 1:

1. topic-filtered `Articles`
2. topic-filtered `Actions`
3. explicit public Event filter UI for the already-supported Release 1 Event
   dimensions
4. pagination for public collection routes
5. tests and docs that prove the new collection behavior works

Do not start by building full-text search, geolocation, or crawler plumbing.
Those are outside the current phase boundary.

## Read Before Editing

- `docs/agent-governance/progress.md`
- `docs/specs/001-release1-scope.md`
- `docs/specs/007-phase-8-events-index.md`
- `docs/learnings/implementation-guides/phase-12-url-state-and-pagination-guide.md`

## Files And Folders Involved

Current public pages:

- `apps/web/src/app/(public)/articles/page.tsx`
- `apps/web/src/app/(public)/actions/page.tsx`
- `apps/web/src/app/(public)/events/page.tsx`

Current public API helpers:

- `apps/web/src/lib/api/articles.ts`
- `apps/web/src/lib/api/actions.ts`
- `apps/web/src/lib/api/events.ts`

Current public backend feature areas:

- `apps/api/src/article/`
- `apps/api/src/action/`
- `apps/api/src/event/`

Likely contract area:

- `packages/contracts/src/`

Likely tests to add or update:

- route/controller tests under `apps/api/src/article/`, `apps/api/src/action/`,
  and `apps/api/src/event/`
- integration/e2e tests under `apps/api/test/`
- page/component tests under `apps/web/src/app/(public)/...` or adjacent test
  locations if they already exist for those routes

## The Recommended Build Order

## Step 1: Decide The Shared Collection Contract

Before editing route pages, decide the contract shape for paginated public list
responses.

You need answers to these questions:

1. Will Phase 12 use page-number pagination or cursor pagination?
2. What is the page size?
3. What metadata will every collection response include besides `items`?
4. Which collections support which filters?

Keep this decision small and explicit.

A practical first pass would likely be:

- page-number pagination
- one shared metadata shape
- topic filtering for Articles and Actions
- topic/date/location filtering for Events within existing Release 1 rules

Do not start coding until this is clear enough to describe in one paragraph.

## Step 2: Update Shared API Contracts First

After the shape is clear, update the contracts package before the pages.

Why this order matters:

- the web helpers need typed request/response shapes
- the API controllers/services need to return the new response shape
- tests need a stable target

At this stage you are likely adding:

- query input types for collection requests
- response metadata for paginated list responses
- possibly a shared generic or repeated pagination metadata type

Do not over-abstract if the first phase can stay readable with a few explicit
types.

## Step 3: Extend Article And Action Collection Endpoints

Start backend changes with the simpler collections:

- `articles`
- `actions`

Why start here:

- they are simpler than Events
- they teach the topic-filter + pagination pattern cleanly
- they help you validate the contract before touching the more complicated Event
  collection

Likely file path:

- `apps/api/src/article/article.controller.ts`
- `apps/api/src/article/article.service.ts`
- article repository files in the same feature
- `apps/api/src/action/action.controller.ts`
- `apps/api/src/action/action.service.ts`
- action repository files in the same feature

Implement in this order:

1. controller reads supported query params
2. service receives one typed options object
3. repository applies published-only query, optional topic filter, stable sort,
   and pagination slice
4. service returns the new paginated response shape

Do not add unsupported filters just because the query object exists.

## Step 4: Extend The Event Collection Endpoint Without Breaking Scope

The Events collection already has a URL-query pattern. Keep building on that
instead of replacing it.

Likely files:

- `apps/api/src/event/event.controller.ts`
- `apps/api/src/event/event.service.ts`
- event repository files in the same feature

Phase 12 should expose the existing Release 1 dimensions more fully:

- topic
- date/date window
- location fields already supported by the current Event contract

Important constraint:

- this is still not geolocation
- this is still not "events near me"
- this is still not crawler design

If you find yourself asking about radius search or map pin logic, you are out of
scope.

## Step 5: Update Web API Helpers

Once backend and contracts are shaped, update the web helper functions.

Likely files:

- `apps/web/src/lib/api/articles.ts`
- `apps/web/src/lib/api/actions.ts`
- `apps/web/src/lib/api/events.ts`

The helpers should accept a small typed params object and turn it into request
params cleanly.

A good outcome:

- pages pass normalized params
- helpers build request params
- helpers do not contain UI logic

Do not keep bolting on separate helper functions for each filter combination.

## Step 6: Update Articles And Actions Pages

After the helpers exist, update the simpler public pages first:

- `apps/web/src/app/(public)/articles/page.tsx`
- `apps/web/src/app/(public)/actions/page.tsx`

New responsibilities for those pages:

1. read `searchParams`
2. normalize supported values
3. fetch the correct filtered/paginated list
4. render filtered empty states when needed
5. render pagination controls based on response metadata

Keep these pages server-first.

Do not move the whole collection into a client component just to manage filters.

## Step 7: Update The Events Page

Then update:

- `apps/web/src/app/(public)/events/page.tsx`

This page already understands one query param. Expand it carefully.

The page should:

1. read the supported event query params
2. fetch the filtered/paginated collection
3. describe the active filter state clearly
4. render the correct empty state for that state
5. render pagination controls

Do not let the page invent unsupported Event semantics.

## Step 8: Build Small, URL-Driven Filter UI

Only after the route logic works should you add the visible UI controls or
links.

Phase 12 filter UI should be minimal and honest:

- topic filtering for Articles and Actions
- Event controls only for the allowed public dimensions
- controls that change the URL directly

Do not add:

- keyword search
- advanced sort builders
- map interfaces
- location radius behavior

The filter UI should be a thin public control surface over canonical URL state.

## Step 9: Add Tests In The Same Order

Test the simpler slices first.

Backend tests:

1. article collection with no topic filter
2. article collection with topic filter
3. article pagination metadata
4. action collection with no topic filter
5. action collection with topic filter
6. action pagination metadata
7. event collection with supported filters
8. event pagination metadata

Web tests:

1. default empty state
2. filtered empty state
3. pagination controls visible only when appropriate
4. URL state reflected in headings/supporting copy when applicable

One important regression to watch:

- filter changes should not preserve an out-of-range page number

## Step 10: Finish With Documentation, Not Before

Once code behavior is real:

1. update the relevant spec or progress note if implementation clarified a task
2. keep the learning docs accurate if the contract shape ended up different from
   the initial plan
3. note any true deferrals cleanly instead of letting half-built features
   masquerade as Phase 12

## First Correct Structure

If you get stuck on how to break the work down, use this first correct path:

1. decide pagination contract
2. update shared contracts
3. implement Articles backend
4. implement Actions backend
5. implement Events backend
6. update web API helpers
7. wire Articles page
8. wire Actions page
9. wire Events page
10. add filter controls
11. add tests
12. tighten empty-state and page-reset behavior

This order keeps the contract stable before UI work starts.

## Ask-When-Stuck Prompts

- What exact response metadata does the UI need before I can render pagination?
- Am I changing URL state or inventing client-only state?
- Am I starting with Articles/Actions first, or jumping into the hardest Event
  case too early?
- Did I define stable ordering before adding pagination logic?
- Am I still inside Phase 12, or did I just invent search/crawler/geolocation
  work?
