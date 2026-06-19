# 114) Next Route Handlers Are HTTP Endpoints, Not Imported Functions

## The rule

In the Next App Router, a `route.ts` file becomes an HTTP endpoint by file-system
convention.

## What that means

If you create:

- `app/api/admin/articles/route.ts`

Next exposes:

- `POST /api/admin/articles`

You do not manually register the route and you do not usually import that file
into pages or components.

## How code actually uses it

Code uses the route by making an HTTP request to the URL.

Typical flow:

1. client component calls a helper function
2. helper uses `fetch('/api/...')`
3. Next matches the request to the `route.ts` file
4. that handler runs server-side

## Why it mattered here

The admin forms do not import the internal admin proxy route files directly.

They call `apps/web/src/lib/api/admin.ts`, which now sends browser requests to
the internal `/api/admin/...` routes.

Those route handlers then proxy the write to the API and trigger cache
invalidation on the server.
