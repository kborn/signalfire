# Phase 12 URL State And Pagination Guide

This guide explains the framework and API concepts that matter immediately in
Phase 12: URL-driven public filtering, collection pagination, and how Next and
Nest should divide the work.

Relevant canonical context:

- `docs/agent-governance/progress.md` defines the active Phase 12 scope
- `docs/specs/001-release1-scope.md` defines Release 1 filter boundaries
- `docs/specs/007-phase-8-events-index.md` shows the existing query-backed
  Events pattern

## Concepts To Understand Now

- why collection state belongs in the URL
- how `searchParams` works on Next server pages
- what pagination metadata the UI needs
- the difference between page-number and cursor pagination
- why stable sort order matters before pagination
- where query parsing belongs in Next and Nest

## Plain-Language Explanations

### URL state is the public collection contract

For a public collection page, the URL is not just an address. It is also the
state of the screen.

Examples:

- `/articles`
- `/articles?topicSlug=climate`
- `/articles?topicSlug=climate&page=2`

These are not three different pages in the folder tree. They are three states
of the same route:

- `apps/web/src/app/(public)/articles/page.tsx`

This matters because a collection state should be:

- refresh-safe
- shareable
- bookmarkable
- server-renderable

That is why filter and pagination state belong in the query string instead of
only in local client state.

### `searchParams` is how a Next server page reads the URL query

In the App Router, a page can receive query-string values through
`searchParams`.

Phase 12 already has one small example:

- `apps/web/src/app/(public)/events/page.tsx`

That page reads `topicSlug` and fetches a filtered collection on the server.

Phase 12 likely extends the same idea to:

- article topic filtering
- action topic filtering
- event date/location filters
- pagination state

The important mental model:

- route folder decides the page
- query params decide the current collection state on that page

### Pagination is just "which slice of a stable list do I want?"

People often hear "pagination" and picture UI buttons first. The buttons are
the least important part.

Pagination starts with one question:

- how do we ask the server for one stable slice of a larger ordered list?

That means the backend must know:

1. what the stable ordering is
2. how large one slice should be
3. how the client asks for another slice

If the ordering is unstable, pagination breaks.

Example:

- request 1 returns newest 12 articles
- request 2 returns the next 12 articles

This only works if "newest" is defined consistently, such as:

1. `publishedAt desc`
2. then `id asc`

### Page-number pagination vs cursor pagination

You do not need to master every pagination strategy for Phase 12. You need a
working first mental model.

#### Page-number / offset style

The client asks for:

- `page=1`
- `page=2`

The server computes:

- skip `(page - 1) * pageSize`
- take `pageSize`

Why it is easy:

- simple to understand
- simple to test
- simple to render previous/next buttons

Tradeoff:

- less efficient for very large datasets
- can drift more under heavy writes

For Release 1 public discovery, this may be perfectly acceptable.

#### Cursor style

The client asks for:

- "give me the next page after this last seen record"

That usually looks like:

- `after=<cursor>`

Why it is stronger:

- better for larger or fast-changing datasets
- avoids large offsets

Why it is harder for a beginner:

- the cursor shape must be encoded/decoded
- next/previous behavior is less obvious
- the contract is less intuitive than page numbers

For Phase 12, page-number pagination may be the better teaching and delivery
choice unless you already know you want a cursor contract.

### The UI needs metadata, not just `items`

Right now the public list responses return:

- `items`

That is not enough for pagination.

The UI also needs metadata such as some combination of:

- current page
- page size
- total items
- total pages
- has next page
- has previous page

Without metadata, the UI cannot safely decide whether to render:

- `Next`
- `Previous`
- `Page 2 of 5`
- `Load more`

### Build query strings in helpers, not in JSX

Your page component should describe collection state, not hand-build URL
strings inline.

Today the helpers are tiny:

- `getArticlesList()`
- `getActionsList()`
- `getEventsList(topicSlug?)`

Phase 12 should likely move toward a small typed input object.

Example shape:

```ts
type ArticleListParams = {
  topicSlug?: string;
  page?: number;
};
```

Then the helper owns turning that into request params.

This keeps the page code focused on:

- reading `searchParams`
- normalizing values
- rendering the correct state

### The backend controller should stay thin

In Nest, the controller should not become the place where all pagination logic
lives.

A healthy split is:

- controller: read query params
- service: apply public rules and orchestration
- repository: perform the database query

That keeps each layer easier to test.

### Filter changes should usually reset pagination

One easy bug:

1. user is on page 3
2. user applies a topic filter
3. page 3 of that filtered set is empty
4. UI looks broken

In most collection UIs, changing filters should reset page state back to page
1 unless there is a strong reason not to.

That is not a Next rule. It is just a practical collection rule.

## Tiny Worked Examples

### Example 1: Read filter and page from `searchParams`

```tsx
type ArticleListPageProps = {
  searchParams?: Promise<{
    topicSlug?: string;
    page?: string;
  }>;
};

export default async function ArticleListPage({ searchParams }: ArticleListPageProps) {
  const params = (await searchParams) ?? {};
  const page = Number(params.page ?? '1');
  const topicSlug = params.topicSlug;

  return <h1>{topicSlug ? `Articles for ${topicSlug}` : `Articles page ${page}`}</h1>;
}
```

Important idea:

- `page` arrives as a string from the URL
- the page should normalize it before passing it deeper

### Example 2: Build request params safely

```ts
type ArticleListParams = {
  topicSlug?: string;
  page?: number;
};

export async function getArticlesList(params: ArticleListParams = {}) {
  const requestParams = new URLSearchParams();

  if (params.topicSlug) {
    requestParams.set('topicSlug', params.topicSlug);
  }

  if (params.page && params.page > 1) {
    requestParams.set('page', String(params.page));
  }

  const query = requestParams.toString();
  const endpoint = query ? `articles?${query}` : 'articles';

  return await makeRequest(endpoint);
}
```

Important idea:

- include only supported, normalized params
- keep the helper small

### Example 3: Basic page-number response shape

```ts
type PaginatedListResponse<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};
```

Important idea:

- the UI can now render controls based on response facts instead of guesses

### Example 4: Filter change resets page

If the user is on:

- `/articles?page=3`

and then selects topic `climate`, the next URL should usually become:

- `/articles?topicSlug=climate`

not:

- `/articles?topicSlug=climate&page=3`

Important idea:

- keep collection states valid and unsurprising

## How This Appears In The Repo Today

Current public collection pages:

- `apps/web/src/app/(public)/articles/page.tsx`
- `apps/web/src/app/(public)/actions/page.tsx`
- `apps/web/src/app/(public)/events/page.tsx`

Current public API helpers:

- `apps/web/src/lib/api/articles.ts`
- `apps/web/src/lib/api/actions.ts`
- `apps/web/src/lib/api/events.ts`

Current public collection controllers/services:

- `apps/api/src/article/article.controller.ts`
- `apps/api/src/article/article.service.ts`
- `apps/api/src/action/action.controller.ts`
- `apps/api/src/action/action.service.ts`
- `apps/api/src/event/event.controller.ts`
- `apps/api/src/event/event.service.ts`

What the repo already teaches:

- public pages stay server-first
- list helpers are thin wrappers
- events already prove the URL-query pattern with `topicSlug`

What Phase 12 likely adds:

- typed query inputs for article/action/event list requests
- response metadata for paginated collections
- shared or parallel pagination types in `packages/contracts`
- filter UI controls or links that map directly to URL state
- tests for query behavior and pagination behavior

## Tiny Rules Of Thumb

- If the value changes collection state, it probably belongs in the URL.
- If the UI needs to know whether another page exists, the API must say so.
- Decide sort order before implementing pagination.
- Keep controllers thin and pages server-first.
- Reset pagination when filters change.
- Do not sneak search or crawler concerns into Phase 12.

## Ask When Stuck

- Am I designing URL state or local component state?
- Do I know the exact response metadata the UI needs?
- Have I defined a stable sort order before paginating?
- Am I adding only the filters that canonical docs already allow?
- Am I solving Phase 12, or drifting into Milestone 2?
