# Phase 12.4 Public Pagination Implementation Guide

## Purpose

This guide is for the actual implementation step in Phase 12.4:
adding page-number pagination to the public Article, Action, and Event
collection flows.

Use this when the question is not "what is pagination?" but:

- how should pagination fit this repo
- what shape should the request and response take
- where should each piece of the logic live

Relevant canonical context:

- `docs/agent-governance/progress.md`
- `docs/specs/014-phase-12-search-discovery-improvements.md`
- `docs/architecture/008-phase-5-topic-content-api-contracts.md`
- `docs/architecture/009-phase-7-event-api-contracts.md`

## The Core Shape

For Phase 12.4, use explicit page-number pagination.

Request direction:

- `page`
- `pageSize`
- existing approved filters such as `topicSlug`, `region`, `city`, `startDate`,
  and `endDate`

Response direction:

```ts
type PaginatedCollection<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};
```

This is enough for:

- page heading and empty-state context
- previous/next controls
- page-number controls if you decide to show them
- tests that assert stable filtered counts

## Repo Responsibilities By Layer

### Web page

The route page should:

1. read `searchParams`
2. normalize `page` and any approved filters
3. call the API helper with one typed params object
4. render list content
5. render pagination controls from response metadata

The page should not:

- hand-build long query strings inline
- contain pagination math
- guess whether another page exists

### Web API helper

The helper should:

1. accept a typed params object
2. add only defined query params
3. call the existing request helper

Example mental model:

```ts
type ArticleListParams = {
  topicSlug?: string;
  page?: number;
  pageSize?: number;
};
```

### Controller

The controller should:

1. read query params
2. validate or normalize boundary values
3. pass one typed object to the service

Keep it thin.

### Service

The service should:

1. apply public-content rules
2. decide defaults
3. coordinate repository reads
4. return the final paginated envelope

### Repository

The repository should:

1. apply filters
2. apply stable ordering
3. apply skip/take logic
4. compute the filtered total count

This is where the actual pagination query behavior belongs.

## Stable Ordering Comes First

Do not paginate an unstable collection.

Before writing pagination code, write down the sort order for each list.

Practical pattern:

1. primary public ordering field
2. deterministic tiebreaker

Examples:

- Articles: `publishedAt desc`, then `id desc` or `id asc`
- Actions: same pattern
- Events: keep the existing canonical Event ordering model, then add a stable
  tiebreaker if needed

Without this, page boundaries can shift unpredictably.

## Defaults And Guardrails

Use small, explicit defaults.

Typical direction:

- default `page = 1`
- default `pageSize = 12`
- allow only a small set of page sizes if page size is user-controlled
- reject invalid numeric values with `400 Bad Request`

Examples of invalid input:

- `page=0`
- `page=-1`
- `page=abc`
- `pageSize=999999`

## Filter Changes Must Reset Page

If filters change, reset pagination back to page 1.

Example:

- current URL: `/articles?page=3`
- user selects `topicSlug=climate`

Next URL should become:

- `/articles?topicSlug=climate`

or:

- `/articles?topicSlug=climate&page=1`

not:

- `/articles?topicSlug=climate&page=3`

This applies to:

- topic changes
- Event date changes
- Event region/city changes

## Empty-State Rules

Pagination adds a few different empty states.

You should distinguish:

1. no content exists at all
2. no content matches the active filters
3. page is out of range for the filtered result set

Recommended handling:

- return `200 OK`
- return `items: []`
- return accurate `page`, `pageSize`, `totalItems`, and `totalPages`
- render copy that matches the active state

## The Simplest Backend Query Pattern

For a filtered collection:

1. build the `where` clause
2. count matching published rows
3. calculate `skip = (page - 1) * pageSize`
4. fetch `take = pageSize`
5. return metadata plus items

That is the core implementation loop.

## The Simplest UI Pattern

For a public route:

1. read and normalize `searchParams`
2. fetch the paginated response on the server
3. render current items
4. build pagination links that preserve active filters
5. disable or hide invalid navigation states

Good link examples:

- `/articles?page=2`
- `/articles?topicSlug=climate&page=2`
- `/events?region=NY&city=Albany&page=2`

## What Not To Add In Phase 12.4

Do not expand this work into:

- infinite scroll
- full-text search
- sort builders
- personalized ranking
- map or radius search
- client-only collection state

## Recommended Validation Checklist

Before calling the work done, verify:

1. Articles paginate with and without `topicSlug`
2. Actions paginate with and without `topicSlug`
3. Events paginate with approved finder filters
4. changing filters resets page state
5. out-of-range pages return empty `items` safely
6. unpublished content is excluded from both counts and items
7. pagination links preserve current filters
