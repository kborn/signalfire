# Phase 12 Discovery Filtering And Pagination Syllabus

## Purpose

Orient the Phase 12 work so you can build public filtering and pagination
without drifting into full-text search, crawler work, or geolocation.

This syllabus is for the current canonical Phase 12 scope:

- topic filtering for Articles
- topic filtering for Actions
- public Event filter UI for existing Release 1 dimensions
- pagination for public collections

## Current Task

You are extending the public collection surfaces so they can represent larger
content sets cleanly.

Right now:

- `Articles` and `Actions` fetch everything with no filter UI
- `Events` supports only `topicSlug` query state
- none of the public collections paginate

Phase 12 is the point where those routes stop being small seed-data demos and
start acting like real collections.

## Prerequisites

Read these first:

- `docs/agent-governance/progress.md`
- `docs/specs/001-release1-scope.md`
- `docs/specs/007-phase-8-events-index.md`
- `docs/learnings/implementation-guides/phase-12-url-state-and-pagination-guide.md`
- `docs/learnings/walkthroughs/phase-12-public-discovery-walkthrough.md`

Useful current repo files:

- `apps/web/src/app/(public)/articles/page.tsx`
- `apps/web/src/app/(public)/actions/page.tsx`
- `apps/web/src/app/(public)/events/page.tsx`
- `apps/web/src/lib/api/articles.ts`
- `apps/web/src/lib/api/actions.ts`
- `apps/web/src/lib/api/events.ts`
- `apps/api/src/article/`
- `apps/api/src/action/`
- `apps/api/src/event/`
- `packages/contracts/src/`

## Modules In Practical Build Order

### Module 1: URL State For Public Collections

#### Objective

Understand why public filters and pagination inputs should live in the URL.

#### Why It Matters

If filter state is only local component state:

- refresh loses it
- links are not shareable
- server pages cannot fetch the correct data directly

Phase 12 wants server-rendered public collection pages that respond to URL
state, not a client-only filter app.

#### Key Concepts

- `searchParams` in Next App Router
- query params vs route params
- one route with many filtered states
- URL as source of truth for collection state

#### Repo-Specific Context

`apps/web/src/app/(public)/events/page.tsx` already shows the first small
version of this pattern with `topicSlug`.

Phase 12 expands that pattern to:

- `articles`
- `actions`
- richer `events` filtering
- pagination params

#### Small Concrete Example

`/articles?topicSlug=climate&page=2`

This is still one route:

- `apps/web/src/app/(public)/articles/page.tsx`

The page just renders a different collection state based on the query string.

#### Common Mistakes

- creating separate route folders for each filter
- storing page number only in local React state
- mixing unsupported future filters into the first pass

#### Short Exercise

Write down the likely Phase 12 query params before touching code:

- `topicSlug`
- page indicator
- event date/location params already supported by Release 1

### Module 2: Pagination Contract Thinking

#### Objective

Learn what pagination is actually doing and choose a stable first contract.

#### Why It Matters

Without pagination, every collection request returns everything. That works only
while the data set is tiny.

Pagination exists to answer:

- how many items do we ask for now?
- how do we ask for the next slice later?
- how does the UI know whether another page exists?

#### Key Concepts

- page size / limit
- offset/page-number pagination
- cursor pagination
- response metadata
- stable ordering

#### Repo-Specific Context

Phase 12 does not need infinite-scroll complexity. A simple page-number or
cursor-based contract with obvious next/previous or load-more behavior is
enough.

The important thing is that the API and contract gain an explicit pagination
shape now so later volume does not force a breaking redesign.

#### Small Concrete Example

If page size is `12`:

- page 1 returns items 1-12
- page 2 returns items 13-24

The UI still needs metadata such as:

- current page
- total pages or `hasNextPage`

#### Common Mistakes

- adding UI buttons before the API contract exists
- paginating without stable sort order
- hiding pagination state inside client components instead of the URL

#### Short Exercise

Describe in one sentence what the server must return besides `items` so the UI
can render pagination controls safely.

### Module 3: Thin Next API Helpers

#### Objective

Understand where filter/pagination query construction belongs in the web app.

#### Why It Matters

The page should express collection state, but helper functions should own the
boring request-shape details.

#### Key Concepts

- small API wrapper functions
- optional query params
- `URLSearchParams`
- avoid hard-coded string concatenation

#### Repo-Specific Context

Today:

- `getArticlesList()`
- `getActionsList()`
- `getEventsList(topicSlug?)`

Phase 12 will likely turn those into helpers that accept a small typed input
object and pass only supported params to the backend.

#### Small Concrete Example

The page should say:

- "fetch articles with `topicSlug` and `page`"

The helper should say:

- "build the request query string correctly"

#### Common Mistakes

- putting URLSearchParams logic directly in the JSX page
- creating one helper per tiny filter combination
- sending undefined query fields to the backend

#### Short Exercise

Sketch the input object shape you expect `getArticlesList()` to take after Phase 12.

### Module 4: Nest Collection Endpoints And Query Inputs

#### Objective

Learn how the backend should accept and apply public collection filters.

#### Why It Matters

Frontend filtering only works if the backend collection endpoint can:

- accept the right query params
- validate them
- apply them against a stable query

#### Key Concepts

- `@Query(...)` in Nest
- thin controller, real service logic
- repository query conditions
- stable ordering before pagination

#### Repo-Specific Context

Current examples:

- `apps/api/src/event/event.controller.ts`
- `apps/api/src/event/event.service.ts`

Phase 12 will likely expand the same pattern into:

- `article.controller.ts`
- `article.service.ts`
- `action.controller.ts`
- `action.service.ts`

#### Small Concrete Example

`GET /articles?topicSlug=climate&page=2`

Controller:

- read query params
- pass them as a typed object to the service

Service:

- choose the published-only query
- apply optional topic filter
- apply stable ordering
- apply pagination

#### Common Mistakes

- putting database query construction directly in the controller
- paginating without defining the sort order first
- adding out-of-scope search logic because "we already have query params"

#### Short Exercise

List the three layers that should each have one job in a paginated collection
request.

### Module 5: Empty States And Filtered States

#### Objective

Learn how empty states change once filters and pagination exist.

#### Why It Matters

"No items exist at all" and "no items match this filter" are different user
messages.

Phase 12 adds more URL states, so it also adds more meaningful empty states.

#### Key Concepts

- unfiltered empty state
- filtered empty state
- "no more pages" vs "no results"

#### Repo-Specific Context

The events page already distinguishes:

- no events at all
- no events for a topic

Phase 12 should extend that level of thought to:

- articles by topic
- actions by topic
- event location/date combinations
- pagination edge cases

#### Small Concrete Example

These are different states:

- `/articles` with zero total items
- `/articles?topicSlug=climate` with zero matches
- `/articles?page=3` after filters changed and page 3 is now out of range

#### Common Mistakes

- using one generic empty message everywhere
- forgetting to reset to page 1 when filter state changes
- rendering pagination controls with no results

#### Short Exercise

Write one empty-state sentence for:

- no actions yet
- no actions for a selected topic

## Recommended First Implementation Step

Before writing code, decide the Phase 12 request/response shape on paper:

1. which public query params each collection supports
2. which pagination style Release 1 should use
3. what metadata the API contract returns with `items`

That decision should happen before editing pages, because the page, helper,
controller, service, repository, and tests all depend on it.

## Vocabulary

- `searchParams`: query-string values on a Next page
- `query param`: value after `?` in the URL
- `page size`: how many records one response returns
- `offset`: how many records to skip before reading the next slice
- `cursor`: a bookmark that says where the next slice should begin
- `stable ordering`: deterministic sort order so pagination does not shuffle
  items between requests

## Suggested Next Learning Docs

- `docs/learnings/implementation-guides/phase-12-url-state-and-pagination-guide.md`
- `docs/learnings/walkthroughs/phase-12-public-discovery-walkthrough.md`
