# Phase 11.9 Admin Auth Boundary Guide

## Concepts To Understand Now

- the admin auth problem has two enforcement layers: web routes and API routes
- authentication answers who the user is; authorization answers what they may do
- Release 1 uses one internal `admin` user type
- Release 1 uses database-backed sessions
- local development ergonomics and deployed-environment protection can differ
- auth choice should fit the repo boundary you already have, not rewrite it

## Plain-Language Explanations

### Why `/admin` protection is a boundary problem, not a page problem

It is tempting to think this phase is about putting a login screen in front of
`/admin`. That is only the visible part.

The actual boundary is broader:

- page entry must be protected
- server-rendered admin data fetches must use an authenticated context when
  required
- admin write endpoints must reject unauthorized callers
- the UI must react cleanly when access fails

If any one of those is missing, the system is only partially protected.

### Why web-layer and API-layer enforcement are not duplicates

They look repetitive, but they defend different things.

Web-layer protection exists so:

- blocked users do not see admin screens
- deep links into `/admin/...` do not render sensitive operational UI
- navigation behavior is predictable

API-layer protection exists so:

- direct HTTP requests cannot bypass the UI
- automated clients cannot mutate admin data without permission
- route-level mistakes in the web app do not become security holes

A good Phase 11.9 implementation uses both.

### What the Release 1 admin-user model means

You do not need to design the final company org chart or an internal staff
permissions system.

You need one model that safely answers:

- who is an authenticated admin user?
- may that admin user access `/admin` routes?
- may that admin user call admin APIs?

For Release 1, the answer is simple: authenticated admin users may do all admin
work. More than that is speculation unless the canonical product scope changes.

### Why environment-aware behavior is acceptable here

This repo explicitly allows local-only openness when it reduces drag. That does
not mean auth can stay optional everywhere.

A practical implementation often means:

- local development has a documented convenience path
- real deployed environments require full admin auth
- API permission checks stay real in deployed environments

The important part is not pretending those are the same environment.

### Why database-backed sessions are the right first implementation here

The remaining session choice is whether the session lives in the database or
inside a signed cookie.

Release 1 should use database-backed sessions:

- cookie stores only a session id
- API loads the session record
- API resolves the authenticated `AdminUser`

This is the better first implementation because it makes the session lifecycle
easy to trace:

- login creates session
- browser stores cookie
- request presents cookie
- API loads session
- logout deletes session

Signed-cookie sessions are worth learning later, but they are a comparison
exercise after you understand the simpler server-managed model.

## Tiny Worked Examples

### Example: route gating vs API gating

Route gating example:

- request arrives for `/admin/submissions`
- no valid admin session exists
- the app redirects to a login route or renders an explicit blocked state

API gating example:

- request arrives for an admin POST endpoint
- session exists, but the role lacks permission
- the API returns `403`
- the UI keeps the editor/review page in place and shows a failure state

### Example: the Release 1 access map

- authenticated `admin` may access all `/admin` pages
- authenticated `admin` may call all admin read/write APIs
- any non-admin or unauthenticated request is rejected or redirected

### Example: the Release 1 DB-backed request flow

1. admin submits email/password to login
2. API verifies password hash against `AdminUser`
3. API creates an `AdminSession` record
4. API sets cookie containing the session id
5. browser sends that cookie on later admin requests
6. API loads the session record and resolves the current admin user
7. admin route or admin API either allows or rejects the request

### Example: using the admin API directly

If you call the protected admin API directly outside the web UI, you still need
an authenticated admin session.

The normal flow is:

1. call the admin login endpoint with email/password
2. receive a `Set-Cookie` response from the API
3. store that cookie in the browser, Postman, Insomnia, or a `curl` cookie jar
4. send later admin API requests with that same cookie

Important boundary:

- do not send the session id in a custom auth header
- do not resend email/password on every request
- do send the cookie because the cookie is the session transport in this design

This means the admin API is still usable directly, but only through the same
authenticated session model used by the admin web app.

### Why manual admin-user provisioning is enough

Release 1 does not need a user-management product. It needs a safe way to
create and manage a small set of trusted internal users.

That means:

- no public signup
- no invitation flow
- no self-service account management
- no admin CRUD UI for users

A manual operational path is enough for the initial release:

- insert an admin user through a database operation
- seed one through a controlled seed path
- or run a one-off script that writes the admin record with a password hash

### What the web app is actually doing with the cookie

The browser, not the React app, is the main component that keeps track of the
cookie during an authenticated session.

The flow is:

1. admin logs in through the web UI
2. API responds with `Set-Cookie`
3. browser stores the cookie
4. later requests to the protected web or API origin automatically include the
   cookie when the cookie rules allow it
5. API reads the cookie, loads the `AdminSession`, and resolves the current
   `AdminUser`

The important mental model is:

- the web app does not usually manually store the session id in React state
- the browser carries the cookie automatically
- the API still authenticates every protected request by resolving the session
  from that cookie

### Why server-rendered admin pages need cookie forwarding

The browser only automatically attaches cookies to requests that the browser is
making.

That matters because this repo uses both of these request paths:

1. browser -> API
2. browser -> Next server -> API

The first path is simple:

- browser has the cookie
- browser makes the request
- browser attaches the cookie automatically when the cookie rules allow it

The second path is different:

- browser sends the cookie to the Next app when requesting `/admin/...`
- the Next server then makes a separate fetch to the API
- that second fetch is not made by the browser
- so the browser cannot attach the cookie for it

That means the Next server must explicitly forward the admin session cookie to
the API when a server-rendered admin page loads protected data.

Important consequence:

- `credentials: 'include'` helps browser-side cross-origin fetches
- it does not solve server-side fetches made inside Next page code

### Why the server-only fetch helper had to be split from the shared admin API module

The first working fix for server-rendered admin pages was a server-only helper
that used `next/headers` to read the incoming cookie and forward it to the API.

That helper is correct, but it cannot live inside a module that is also
imported by client components.

Why:

- `next/headers` is server-only
- `server-only` markers are server-only
- client components cannot import code that depends on either of those

In this repo the original `admin.ts` API module was shared by:

- server-rendered admin pages
- client-side editor and review components

So putting server-only imports in that shared file contaminated the client
bundle and caused build/runtime errors.

The correct split is:

- `admin.server.ts` for server-rendered admin reads that must forward cookies
- `admin.ts` for client-safe mutation helpers and browser-side requests

This is not duplication for its own sake. It is an explicit boundary between:

- server-only request behavior
- browser-safe request behavior

### Example: a bad partial implementation

Bad pattern:

- `apps/web/src/app/admin/layout.tsx` checks whether a user exists
- API controllers accept any request because they assume the page was protected

That creates a false sense of safety. Anyone who can call the API directly can
still attempt admin actions.

## How This Appears In The Repo Today

Current relevant repo surfaces:

- `apps/web/src/app/admin/layout.tsx` is the natural shared web-layer entry
  boundary for admin routes
- `apps/web/src/app/admin/page.tsx` and nested admin routes are the pages that
  should inherit the access rule
- `apps/api/src/submission` contains moderation reads/writes that need admin
  protection
- `apps/api/src/action`, `apps/api/src/article`, and `apps/api/src/event`
  contain admin content-management routes that need the same protection story
- `packages/api-contracts/` contains shared request/response shapes, but it is
  not where auth policy itself should live

What is notably absent right now:

- no existing auth module under `apps/api/src/auth`
- no current guard/middleware/session library already integrated
- no established user model surfaced in the codebase yet

That means Phase 11.9 should prefer the narrowest integration that can protect
admin routes without pretending the app already has a general account system.

## Tiny Rules Of Thumb

1. Protect the admin layout and the admin APIs.
2. Keep the admin-user model exactly as small as the product allows.
3. Treat 401 and 403 as different product behaviors.
4. Make local bypasses explicit, narrow, and environment-bound.
5. Keep auth wiring separate from content-form logic whenever possible.
6. Do not let the chosen auth library dictate a larger product scope.

## Decision Questions To Answer Before Coding

1. What is the exact `AdminUser` shape for Release 1?
2. Where is the canonical session or identity check created?
3. Where is the web-layer admin gate enforced?
4. Where is the API-layer admin gate enforced?
5. What is the manual provisioning path for the first and future admin users?
6. What is the local-development convenience path, if any?
7. What exact redirect or blocked behavior should unauthenticated users see?

## Recommended Release 1 Implementation Choices

Use these unless you discover a repo-specific blocker while coding.

### Prisma models

Recommended `AdminUser` shape:

- `id Int @id @default(autoincrement())`
- `email String @unique`
- `passwordHash String`
- `isActive Boolean @default(true)`
- `createdAt DateTime @default(now())`
- `updatedAt DateTime @updatedAt`

Recommended `AdminSession` shape:

- `id String @id`
- `adminUserId Int`
- `expiresAt DateTime`
- `createdAt DateTime @default(now())`
- `lastUsedAt DateTime @default(now())`

Recommended relation:

- one `AdminUser` has many `AdminSession` records
- one `AdminSession` belongs to one `AdminUser`

Why this is enough:

- `AdminUser` covers identity and active/inactive control
- `AdminSession` covers login continuity, logout, expiration, and invalidation
- nothing here expands into user-management product scope

### Libraries

Recommended password library:

- `bcryptjs`

Why:

- simpler install story than native password-hash packages
- fully sufficient for this internal Release 1 admin flow
- easier to reason about while learning the auth boundary

Recommended cookie parsing approach:

- `cookie-parser`

Why:

- standard Express/Nest integration
- keeps cookie access simple inside guards/controllers

Recommended session-id generation:

- Node `crypto.randomUUID()` or equivalent secure random id generation

Why:

- no extra library required
- good fit for DB-backed session ids

### Route shape

Recommended API auth routes:

- `POST /admin/auth/login`
- `POST /admin/auth/logout`
- `GET /admin/auth/session`

Recommended web routes:

- `/admin/login`

Why this route shape works:

- keeps auth clearly internal to the admin surface
- avoids implying a public user-account product
- gives the web app one obvious login entry point

### Cookie shape

Recommended Release 1 cookie contents:

- session id only

Recommended cookie behavior:

- `HttpOnly`
- `Secure` outside local development
- `SameSite=Lax` unless local cross-origin behavior forces a different choice
- explicit expiration aligned with `AdminSession.expiresAt`

Recommended first value:

- cookie expiration: 12 hours

Why not 24 hours here:

- a longer cookie lifetime than the server-side idle timeout means the browser
  may keep sending a cookie for a session the server already considers expired
- that is technically safe if the API rejects the expired session, but it adds
  confusion while learning and debugging
- matching the cookie lifetime to the rolling session lifetime gives the
  clearest first implementation

### Session expiration behavior

Recommended Release 1 policy:

- idle timeout: 12 hours
- cookie lifetime: 12 hours
- no separate absolute multi-day session lifetime in the first implementation
- no persisted `expired` boolean field

Recommended server behavior:

1. login creates `AdminSession.expiresAt = now + 12 hours`
2. login sets cookie expiration to `now + 12 hours`
3. each authenticated admin request loads the session row
4. if `expiresAt <= now`, reject the request and treat the session as expired
5. if still valid, update:
   - `lastUsedAt = now`
   - `expiresAt = now + 12 hours`
   - cookie expiration to `now + 12 hours`

This is a rolling idle session.

Why this is the right first model:

- simple to understand
- aligns with the `lastUsedAt` field already recommended
- does not need a second expiration model yet
- avoids unnecessary complexity like separate absolute-lifetime rules

### Cleanup behavior

Release 1 does not require a background cleanup job for correctness.

Correctness comes from request-time validation:

- expired session presented -> reject it

Optional Release 1 cleanup:

- delete expired sessions during logout
- delete an expired session when it is encountered during auth lookup
- add a simple manual or scheduled cleanup later if table growth becomes worth
  it

That means:

- cleanup is operational hygiene
- expiration enforcement is request-time auth logic

### Proper way to detect login time and activity time

Use different fields for different meanings:

- `AdminSession.createdAt` = when the session was created at login
- `AdminSession.lastUsedAt` = when the session last successfully authenticated
  a protected request
- `AdminSession.expiresAt` = when the session stops being valid unless it is
  refreshed by activity

That means:

- login time should come from `createdAt`
- activity time should come from `lastUsedAt`
- expiration decision should come from `expiresAt`

Do not infer login time from `lastUsedAt`, because `lastUsedAt` changes
throughout the life of an active session.

### How scheduled cleanup would work later in Nest

If you add cleanup as a later learning exercise, the standard Nest approach is:

1. install and enable `@nestjs/schedule`
2. import `ScheduleModule.forRoot()` in the app module
3. create a small cleanup service
4. add a `@Cron(...)` method that deletes expired `AdminSession` rows

That cleanup job is not required for Release 1 correctness. It is a good later
exercise for learning scheduled tasks and operational hygiene.

### Request-validation shape

Recommended login request body:

- `email`
- `password`

Use the same Zod-based validation pattern already used elsewhere in the repo.

### Manual provisioning shape

Recommended operator path:

1. create Prisma model + migration
2. add one controlled admin-creation script or seed helper
3. hash password with the same auth service helper used by login verification
4. insert `AdminUser` record

This is better than ad hoc SQL because it reduces mistakes while staying within
Release 1 manual-management scope.

## Related Canonical Sources

- [Project progress](/Users/kevinborn/Workspace/personal/WebStormProjects/signal-fire/docs/agent-governance/progress.md)
- [Phase 11 moderation/admin UI spec](/Users/kevinborn/Workspace/personal/WebStormProjects/signal-fire/docs/specs/011-phase-11-moderation-admin-ui.md)
- [Moderation workflow spec](/Users/kevinborn/Workspace/personal/WebStormProjects/signal-fire/docs/specs/moderation-workflow.md)
- [Architecture intent](/Users/kevinborn/Workspace/personal/WebStormProjects/signal-fire/docs/architecture/003-architecture-intent.md)
