# 115) Server-Side Invalidation Needs a Server-Side Write Boundary

## The rule

If cache invalidation uses server-only APIs like `revalidatePath`, the write
must pass through a server-side boundary that can call those APIs.

## What that means

A browser calling an external API directly cannot itself invoke
`revalidatePath(...)` in the Next app.

To invalidate cached Next pages after a write, you need a server-side step in
the Next app, such as:

- a route handler
- a server action
- another server-only execution path

## Why it mattered here

Admin editors in this repo were originally calling the API directly from the
browser.

That meant:

- the API write succeeded
- but the Next app had no server-side hook to invalidate public pages

The fix was to route admin writes through internal Next route handlers under
`app/api/admin/...`, then have those handlers:

1. proxy the write to the API
2. call `revalidatePath(...)`
3. return the upstream response to the browser
