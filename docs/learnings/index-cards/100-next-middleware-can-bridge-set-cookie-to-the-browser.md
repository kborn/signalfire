# Next Middleware Can Bridge Set-Cookie To The Browser

## Core Idea

If Next calls a backend during server rendering, the backend's `Set-Cookie`
header does not automatically become a browser cookie.

Middleware can solve that by:

1. making the auth check request from the Next server
2. reading the backend `Set-Cookie` header
3. writing that cookie onto the actual Next response sent to the browser

## Why This Matters

These are different request paths:

```text
Browser -> API
```

and

```text
Browser -> Next -> API
```

In the first path, the browser directly receives the API response, so browser
cookie updates work normally.

In the second path, the API response stops at the Next server unless Next
explicitly copies the cookie behavior forward.

## The Admin Auth Problem

For protected admin pages:

- the browser requests `/admin/...` from Next
- Next may call the API to validate the admin session
- the API may refresh the session cookie with a new expiration
- but the browser will not see that refreshed cookie unless Next sets it on the
  outgoing page response

Without that bridge, the server may think the session was refreshed while the
browser still holds an older cookie expiration.

## Why Middleware Is A Good Fit

Middleware runs before the admin page renders.

That makes it a good place to:

- redirect unauthenticated users before page work happens
- validate the current session on real admin navigation requests
- mirror a refreshed auth cookie back to the browser

This creates a clean sliding idle session model:

- active admin navigation keeps the session alive
- passive open-tab time does not automatically keep it alive

## Why This Is Better Than Polling

A client-side polling loop can also refresh a cookie, but it has weaker
architecture:

- it runs on a timer rather than on real request boundaries
- it keeps sessions alive just because the page is visible
- it adds extra background browser traffic

Middleware is closer to the real auth boundary because it updates session state
when the user actually makes another admin request.

## Rule Of Thumb

If a cookie must be refreshed during server-side auth checks for page requests,
Next should usually own that browser boundary explicitly instead of relying on a
client timer.
