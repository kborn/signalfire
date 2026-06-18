# Public Cache Invalidation

This document describes the internal Next.js admin write proxy routes that now
handle public-page cache invalidation after admin edits.

## Why this exists

Public pages use cached server rendering with fallback TTL revalidation.

That fallback behavior is fine for ordinary traffic, but it is not a good
primary freshness mechanism for admin edits because stale-while-revalidate can
leave the first post-edit refresh one request behind.

To close that gap, admin writes now go through internal Next route handlers.
Those handlers:

1. proxy the write to the API
2. preserve the admin session cookie
3. call `revalidatePath(...)` for affected public pages

## Internal write routes

These routes live under `apps/web/src/app/api/admin`.

### Articles

- `POST /api/admin/articles`
  - proxies to `POST /admin/articles`
  - used by admin article create
- `PATCH /api/admin/articles/[slug]`
  - proxies to `PATCH /admin/articles/:slug`
  - used by admin article edit

Invalidates:

- `/articles`
- `/articles/[slug]`
- `/topics/[slug]` for each topic linked to the article

### Actions

- `POST /api/admin/actions`
  - proxies to `POST /admin/actions`
  - used by admin action create
- `PATCH /api/admin/actions/[slug]`
  - proxies to `PATCH /admin/actions/:slug`
  - used by admin action edit

Invalidates:

- `/actions`
- `/actions/[slug]`
- `/topics/[slug]` for each topic linked to the action

### Events

- `POST /api/admin/events`
  - proxies to `POST /admin/events`
  - used by admin event create
- `PATCH /api/admin/events/[id]`
  - proxies to `PATCH /admin/events/:id`
  - used by admin event edit

Invalidates:

- `/events`
- `/events/[id]` when the event is published

### Moderation review

- `POST /api/admin/submissions/[id]/review`
  - proxies to `POST /admin/submissions/:id/review`
  - used by moderation approve/reject actions

Invalidates:

- `/admin/submissions`
- `/admin/submissions/[id]`
- created public article page/list when an article submission is approved
- created public event page/list when an event submission is approved

## How the UI uses these routes

The admin client now calls the internal Next routes through
`apps/web/src/lib/api/admin.ts` instead of calling the API write endpoints
directly from the browser.

That means:

- admin UI still behaves like a normal authenticated browser client
- the API remains the source of truth for writes
- Next gets a server-side place to trigger cache invalidation immediately after
  successful writes

## What does not use this layer

These remain outside the invalidation proxy path:

- public read endpoints
- admin read endpoints
- login/logout/session auth flows
- anonymous public submissions

Those paths keep their existing cache/dynamic behavior.

## Current caching model

Public content now has two freshness mechanisms:

1. immediate invalidation after admin writes via `revalidatePath(...)`
2. fallback TTL revalidation on public reads

The intended long-term posture is:

- admin edits should refresh affected public pages promptly
- TTL revalidation remains a safety net, not the primary freshness path
