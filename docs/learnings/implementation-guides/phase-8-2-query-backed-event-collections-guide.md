# Phase 8.2 Query-Backed Event Collections Guide

This guide explains the small Next.js concepts that matter for Phase 8.2:
reading URL query state on a server page, passing optional filters into the API
request, and keeping the UI aligned with the canonical Event collection
contract.

Relevant canonical context:

- `docs/agent-governance/progress.md` defines the Phase 8.2 scope.
- `docs/specs/007-phase-8-events-index.md` defines the `/events` page behavior.
- `docs/architecture/009-phase-7-event-api-contracts.md` defines the Event
  summary fields and collection ordering.

## Concepts To Understand Now

- `searchParams` on App Router pages
- optional query state vs required route params
- server-page fetching with a small filter object
- collection pages that stay bound to the API contract
- empty states that depend on query context

## Plain-Language Explanations

### What `searchParams` means on a page

In the Next App Router, a page can read query-string values from the URL.

For Phase 8.2, that means this route:

- `/events`

may also receive:

- `/events?topicSlug=climate`

The query string is not part of the folder path. You still have one route file:

- `apps/web/src/app/events/page.tsx`

The page reads the query value and decides whether to fetch the default Event
collection or the topic-prefiltered Event collection.

### Query state is different from route params

Route params come from the folder tree, like `[slug]`.

Examples:

- `topics/[slug]/page.tsx`
- `articles/[slug]/page.tsx`

Query state comes from the URL after `?`.

Examples:

- `/events?topicSlug=climate`
- `/events?topicSlug=education`

That means Phase 8.2 does not need a dynamic route folder just to support topic
filtering. The filter stays on the collection page.

### Optional filter does not mean "build a filter UI"

The canonical Phase 8.2 scope supports only one optional public filter:

- `topicSlug`

That does not mean:

- search input
- dropdown controls
- map filters
- location controls
- sorting controls

The page only needs to respect the query state if it is present. Topic pages
may link into that state, but Phase 8.2 does not need a separate filter UI.

### Keep the API helper thin

The current list helpers in `apps/web/src/lib/api/` are simple wrappers around
`makeRequest()`.

Phase 8.2 should keep that pattern.

A good shape is:

- `getEventsList()` for the default collection
- or one helper that accepts an optional `topicSlug`

The important idea is not abstraction. The important idea is that the page
should pass only the query state the contract allows.

### The page should trust the API ordering

The canonical Event collection ordering is:

1. `startTime` ascending
2. `id` ascending

The `/events` page should render the collection in the order received. It
should not re-sort on the frontend unless there is a proven bug in the backend
contract.

### Empty states depend on whether a valid filter was used

Phase 8.2 has two meaningful empty states:

- default collection: `No upcoming events found`
- topic-prefiltered collection: `No events found for this topic`

That means the page should first determine whether a valid `topicSlug` was
supplied, then choose the matching empty-state copy.

## Tiny Worked Examples

### Example 1: Reading `searchParams` on the collection page

```tsx
type EventsPageProps = {
  searchParams: Promise<{ topicSlug?: string }>;
};

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const { topicSlug } = await searchParams;

  return <h1>{topicSlug ? `Events for ${topicSlug}` : 'Events'}</h1>;
}
```

Important idea:
The route stays `/events`. The query string only changes the page state.

### Example 2: Pass only the supported optional filter

```ts
export async function getEventsList(topicSlug?: string) {
  const endpoint = topicSlug ? `events?topicSlug=${topicSlug}` : 'events';
  return await makeRequest(endpoint);
}
```

Important idea:
The helper stays small and only encodes the one filter the contract allows.

### Example 3: Empty state copy based on query context

```tsx
if (events.items.length === 0) {
  return <p>{topicSlug ? 'No events found for this topic' : 'No upcoming events found'}</p>;
}
```

Important idea:
The data result and the URL state together determine the correct message.

## How This Appears In The Repo Today

The existing collection pages already use the basic server-page pattern:

- `apps/web/src/app/topics/page.tsx`
- `apps/web/src/app/articles/page.tsx`
- `apps/web/src/app/actions/page.tsx`

Those pages already teach the main structure:

1. fetch collection data in the route page
2. render a page heading and short intro
3. handle the empty state
4. map the returned `items`

Phase 8.2 should stay close to that shape.

What is new in this task:

- `apps/web/src/app/events/page.tsx` must read `topicSlug` from query state
- `apps/web/src/lib/api/events.ts` must support the optional `topicSlug`
  request shape
- the Event list item must render Event-specific summary fields such as
  `startTime`, `region`, and optionally `eventType`
- Topic pages may link users into `/events?topicSlug=<slug>` instead of
  embedding Event arrays directly

What should stay the same:

- server-page fetch boundary
- no client component just for initial data loading
- simple list rendering
- empty-state-first control flow

## Tiny Rules Of Thumb

- Use route params for path segments like `[slug]`; use `searchParams` for
  collection state like `?topicSlug=climate`.
- Keep query-backed collection pages on the collection route unless the spec
  clearly requires a different path.
- Pass only supported query keys into the API helper.
- Render the collection in API order unless the canonical contract changes.
- Choose empty-state copy based on both the query context and the returned
  result.
- If adding a query param would imply new filtering UI, stop and re-check the
  phase scope.

## Pointed Questions To Ask When Blocked

- Am I trying to turn query state into a new route folder when the spec only
  calls for `/events?topicSlug=...`?
- Am I adding unsupported filters instead of respecting the one canonical
  `topicSlug` filter?
- Am I re-sorting Event data in the page even though the API contract already
  defines ordering?
- Does this page really need a client component, or can the server page fetch
  and render directly?
- Is this empty state responding to the actual query context, or is it using
  one generic message for everything?
