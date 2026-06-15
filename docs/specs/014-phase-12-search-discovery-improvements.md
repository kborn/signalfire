# Phase 12 Search & Discovery Improvements

## Purpose

Define the approved Release 1 boundary for Phase 12 discovery improvements so
API and UI work can extend current browsing behavior without expanding into
deferred search or geospatial systems.

## Canonical Scope Boundary

Phase 12 improves discovery within the existing public Topics, Articles,
Actions, and Events surfaces.

This phase is limited to:

- topic-filtered browsing for public Article collections
- topic-filtered browsing for public Action collections
- public Event filters aligned to existing Release 1 Event fields
- pagination for public collection APIs and UIs
- tests and documentation covering filter, pagination, empty-state, and
  published-only visibility behavior

This phase does not introduce a new discovery model. Topics remain the primary
cross-content discovery anchor, with Articles, Actions, and Events serving as
entry points into the same issue-driven browsing flow.

## In Scope

### Articles

Approved collection additions:

- `GET /articles` may accept an optional topic filter keyed by topic slug
- article list UI may expose a topic filter control backed by URL query state

Rules:

- responses remain published-only
- default collection ordering remains the existing canonical ordering unless a
  later canonical contract explicitly replaces it
- no new ranking or relevance behavior is introduced

### Actions

Approved collection additions:

- `GET /actions` may accept an optional topic filter keyed by topic slug
- action list UI may expose a topic filter control backed by URL query state

Rules:

- responses remain published-only
- default collection ordering remains the existing canonical ordering unless a
  later canonical contract explicitly replaces it
- no new ranking or relevance behavior is introduced

### Events

Approved public Event filtering is limited to the existing Release 1 discovery
dimensions already implied by canonical scope:

- topic
- date or date-window inputs
- supported location fields from the current Event contract

Rules:

- Event filtering must stay compatible with the current Event data contract in
  `docs/architecture/009-phase-7-event-api-contracts.md`
- location filtering is field-based, not proximity-based
- date filtering narrows the public collection surface but does not change the
  underlying Event ordering model
- Event UI controls should reflect these scoped filters only
- the public `/events` page is filter-led in Phase 12 and should not render a
  default broad Event result set before the user supplies a meaningful filter
  set

### Pagination

Pagination is approved for public collection APIs and their corresponding UIs:

- Topics, if pagination is needed for consistency
- Articles
- Actions
- Events

Rules:

- pagination must be introduced with a stable contract shape intended to avoid
  a later breaking change as content volume grows
- pagination must compose cleanly with approved filters
- pagination must preserve published-only visibility behavior
- empty result pages caused by valid filters or page navigation are expected
  states and must be handled explicitly

## Out Of Scope

The following remain deferred beyond Phase 12:

- full-text search
- autocomplete
- relevance ranking
- saved filters or personalized recommendations
- browser geolocation
- radius, proximity, or map-based search
- automated Event ingestion or external Event crawling
- contract changes that require a new Event location model
- tagging systems, taxonomy expansion, or non-Topic discovery pivots

## API Contract Guidance

Phase 12 implementation should extend existing public collection endpoints
rather than introduce parallel search endpoints.

Preferred direction:

- keep REST collection routes as the public discovery surface
- add optional query params only for approved filter dimensions
- add pagination metadata in a durable way across collection resources

Phase 12 should not add:

- `/search`
- query syntaxes that bundle unrelated filters into one opaque string
- alternate endpoints dedicated only to filtered Topic discovery

## Canonical Query Param Direction

Phase 12 should use explicit, resource-appropriate query params rather than a
generic filter blob.

Approved public collection query params:

### `GET /articles`

- `topicSlug` optional
- `page` optional
- `pageSize` optional

### `GET /actions`

- `topicSlug` optional
- `page` optional
- `pageSize` optional

### `GET /events`

- `topicSlug` optional
- `startDate` optional
- `endDate` optional
- `region` optional
- `city` optional
- `page` optional
- `pageSize` optional

Direction and rules:

- `topicSlug` remains the canonical topic filter key across public collection
  surfaces
- Event date filtering should use inclusive date-window semantics through
  `startDate` and `endDate`
- when `startDate` is omitted, the collection defaults to the current time
- when `endDate` is omitted, the collection defaults to three calendar months
  after the resolved `startDate`
- Event location filtering should use current contract-aligned broad fields,
  not raw address search and not geographic proximity
- for the filter-led public `/events` page, results should only be requested
  after a meaningful filter set is present; the Release 1 minimum rule is a
  `region` value, with `city`, `startDate`, and `endDate` acting as optional
  refinements
- `page` is a 1-based positive integer
- `pageSize` is an optional positive integer chosen from a small, server-owned
  allowed set
- unsupported, malformed, or duplicate query params should resolve through one
  shared validation posture across public collection APIs rather than each route
  inventing its own behavior

Phase 12 should not introduce:

- `q`
- `search`
- `sort`
- `lat`, `lng`, `radius`
- nested filter keys such as `filters[topic]`
- route-specific aliases for the same concept

## Canonical Response Shape Direction

Phase 12 pagination should use one shared collection envelope direction across
public collection APIs.

Preferred response shape:

```json
{
  "items": [],
  "page": 1,
  "pageSize": 12,
  "totalItems": 0,
  "totalPages": 0
}
```

Field rules:

- `items` contains the same summary resource shape already defined by the
  underlying collection contract for that resource
- `page` echoes the resolved current page
- `pageSize` echoes the resolved current page size
- `totalItems` is the total published result count after filters are applied
- `totalPages` is derived from `totalItems` and `pageSize`

Additional direction:

- filtered and unfiltered collection routes should use the same envelope shape
- empty results should return `200 OK` with `items: []`, not `404`
- filtering changes which rows are eligible; it does not change the summary item
  shape for Articles, Actions, or Events
- pagination metadata should describe the filtered result set actually queried
- Topics may remain unpaginated unless implementation pressure makes parity
  necessary; if Topics become paginated, they should adopt this same envelope

## Validation Direction

Phase 12 implementation should keep public collection validation predictable.

Preferred direction:

- invalid query-param types or invalid numeric pagination inputs return
  `400 Bad Request`
- supplied Event date bounds should resolve against the same default upcoming
  window posture used by the public collection route:
  - `startDate` alone narrows the lower bound and defaults `endDate` to three
    calendar months later
  - `endDate` alone narrows the upper bound while `startDate` defaults to the
    current time
- unknown `topicSlug` values used as filters should return an empty collection,
  not `404`, because the route itself still exists as a collection surface
- page requests beyond the available result set should return `200 OK` with an
  empty `items` array and accurate pagination metadata
- unpublished content must remain invisible in both filtered counts and
  returned collection items

## UI Guidance

Public discovery UI work in this phase should:

- expose only the approved filter controls for each collection
- persist filter and page state in the URL
- allow the Events page to withhold API requests until the URL contains the
  minimum filter state chosen for the public Event finder flow
- render clear empty states when no published results match the current query
- avoid introducing sort builders, advanced search forms, or map interfaces

## Testing And Documentation Expectations

Phase 12 completion requires coverage for:

- filter query behavior on public collection APIs
- pagination behavior and metadata
- combinations of filters with pagination
- published-only visibility under filtered and paginated reads
- empty states in public collection UIs

## Relationship To Prior Canonical Docs

This phase refines, but does not override, prior canonical constraints:

- `docs/specs/001-release1-scope.md` defines the Release 1 Event filter
  dimensions as topic, date, and location
- `docs/architecture/003-architecture-intent.md` keeps Release 1 discovery on
  conventional REST filtering/pagination and excludes advanced geospatial
  behavior
- `docs/architecture/008-phase-5-topic-content-api-contracts.md` remains the
  base public Topic, Article, and Action API contract
- `docs/architecture/009-phase-7-event-api-contracts.md` remains the base
  public Event contract and ordering model, except where Phase 12 explicitly
  refines the public Event collection from default browse behavior into a
  filter-led finder flow
