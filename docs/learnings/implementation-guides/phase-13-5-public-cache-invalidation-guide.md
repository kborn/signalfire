# Phase 13.5 Public Cache Invalidation Guide

## What problem this solved

Public pages in the web app use cached server rendering with fallback TTL
revalidation.

That worked in the broad sense, but it had an important behavior:

- after the cache window expired, the first request could still receive stale
  content while regeneration happened in the background

That is normal stale-while-revalidate behavior, but it is not a great fit for
admin edits because editorial changes can feel one refresh behind.

## The core design decision

Keep public-page caching as the default read model, but add immediate
invalidation when admin writes succeed.

That gives two freshness mechanisms:

1. targeted invalidation after admin edits
2. TTL-based revalidation as a fallback safety net

## Why route-level `revalidate` was not enough

Route-level `revalidate` only defines the page caching policy.

It does not give the app an immediate “content changed right now” hook.

Even when the TTL is working correctly, the flow can still be:

1. page is stale
2. request serves stale content
3. background regeneration fetches fresh content
4. next request sees the update

That is why the admin-triggered invalidation path was added.

## Why the original admin write path could not invalidate

Originally, admin forms called the backend API directly from the browser.

That meant there was no Next server-side boundary where `revalidatePath(...)`
could run.

Important constraint:

- `revalidatePath(...)` is a Next server-side capability
- browser code cannot call it just because it completed a successful write

## What was implemented

Internal Next route handlers were added under:

- `apps/web/src/app/api/admin/...`

These handlers now sit between the browser admin UI and the API.

Their job is:

1. accept the browser request
2. forward the JSON payload and admin cookie to the real API
3. inspect the successful upstream response
4. invalidate affected public pages with `revalidatePath(...)`
5. return the upstream status/body to the browser

## How the request flow works now

### Before

1. admin form
2. browser fetch directly to API
3. API write succeeds
4. public page waits for normal TTL revalidation

### After

1. admin form
2. browser fetch to internal Next route like `/api/admin/articles/[slug]`
3. Next route handler runs server-side
4. handler proxies write to API
5. handler calls `revalidatePath(...)`
6. browser receives normal write response
7. next public request sees the invalidated page regenerate immediately

## Which files own the behavior

### Browser-facing admin write client

- `apps/web/src/lib/api/admin.ts`

This file now points admin writes at internal Next routes such as:

- `/api/admin/articles`
- `/api/admin/articles/[slug]`
- `/api/admin/actions`
- `/api/admin/actions/[slug]`
- `/api/admin/events`
- `/api/admin/events/[id]`
- `/api/admin/submissions/[id]/review`

### Internal route handlers

- `apps/web/src/app/api/admin/articles/route.ts`
- `apps/web/src/app/api/admin/articles/[slug]/route.ts`
- `apps/web/src/app/api/admin/actions/route.ts`
- `apps/web/src/app/api/admin/actions/[slug]/route.ts`
- `apps/web/src/app/api/admin/events/route.ts`
- `apps/web/src/app/api/admin/events/[id]/route.ts`
- `apps/web/src/app/api/admin/submissions/[id]/review/route.ts`

These are not imported into pages directly. Next exposes them automatically as
HTTP endpoints through the App Router file-system routing convention.

### Shared route-handler helpers

- `apps/web/src/app/api/admin/_lib/proxy.ts`
- `apps/web/src/app/api/admin/_lib/revalidation.ts`

`proxy.ts` forwards the write to the API.

`revalidation.ts` decides which public paths should be invalidated.

## What gets invalidated

### Article writes

- `/articles`
- `/articles/[slug]`
- related `/topics/[slug]`

### Action writes

- `/actions`
- `/actions/[slug]`
- related `/topics/[slug]`

### Event writes

- `/events`
- `/events/[id]` when published

### Moderation approval

- `/admin/submissions`
- `/admin/submissions/[id]`
- created public article or event pages/lists, depending on review outcome

## Why public reads still keep TTL revalidation

Immediate invalidation handles known edits.

TTL revalidation still matters because it provides a fallback if:

- content changes outside the admin UI
- an invalidation path is missed
- a public page remains cached longer than expected after some indirect update

So the intended production model is:

- invalidation for known writes
- TTL fallback for general safety

## Practical mental model

Use this mental model when debugging:

- public read path is cache-first
- admin write path is invalidate-on-success
- route handlers are the bridge between browser writes and Next cache control
