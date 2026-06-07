# Phase 11.9 Admin Auth Walkthrough

## What You Are Building

You are building Release 1 admin auth with this concrete shape:

1. an `AdminUser` persistence model
2. password-hash-based admin login
3. a cookie-backed per-user database-backed session
4. `/admin` route protection in the Next web app
5. admin-only protection on Nest admin endpoints
6. manual admin-user provisioning through database, seed, or script operations
7. focused tests proving the auth boundary is real

Do not start by scattering auth checks across random pages or by choosing a
general-purpose auth product shape the repo does not need.

## Read Before Editing

- `docs/agent-governance/progress.md`
- `docs/agent-governance/decisions.md`
- `docs/specs/011-phase-11-moderation-admin-ui.md`
- `docs/specs/moderation-workflow.md`
- `docs/learnings/implementation-guides/phase-11-9-admin-auth-boundary-guide.md`

## Files And Folders Involved

Existing frontend admin surface:

- `apps/web/src/app/admin/layout.tsx`
- `apps/web/src/app/admin/page.tsx`
- `apps/web/src/app/admin/submissions/`
- `apps/web/src/app/admin/actions/`
- `apps/web/src/app/admin/articles/`
- `apps/web/src/app/admin/events/`

Existing backend admin-capable features:

- `apps/api/src/submission`
- `apps/api/src/action`
- `apps/api/src/article`
- `apps/api/src/event`

Existing backend persistence area:

- `apps/api/prisma/schema.prisma`
- `apps/api/prisma/migrations/`
- `apps/api/prisma/seed.ts`

Likely new or changed areas:

- one or more auth files under `apps/api/src/auth`
- a web auth helper under `apps/web/src/lib/`
- one or more admin auth pages under `apps/web/src/app/`
- controller decorators or guards on admin endpoints
- test files near admin pages and admin API controllers/services
- a manual admin-user creation script or seed path if you do not rely on raw DB
  inserts

## Exact Release 1 Shapes

Implement these exact persistence models first.

### `AdminUser`

- `id Int @id @default(autoincrement())`
- `email String @unique`
- `passwordHash String`
- `isActive Boolean @default(true)`
- `createdAt DateTime @default(now())`
- `updatedAt DateTime @updatedAt`

### `AdminSession`

- `id String @id`
- `adminUserId Int`
- `expiresAt DateTime`
- `createdAt DateTime @default(now())`
- `lastUsedAt DateTime @default(now())`

Relations:

- `AdminUser` has many `AdminSession`
- `AdminSession` belongs to one `AdminUser`

Do not add more fields unless a concrete implementation need appears while
coding.

## Exact Release 1 Libraries

Use these choices first:

- password hashing: `bcryptjs`
- cookie parsing in Nest/Express: `cookie-parser`
- session id generation: Node `crypto.randomUUID()`

Use existing repo patterns for:

- validation: Zod request schemas and thin validation pipes
- persistence: repository + service split
- Nest wiring: module/controller/service structure already used in other
  features

## Exact Route Plan

Add these API routes:

- `POST /admin/auth/login`
- `POST /admin/auth/logout`
- `GET /admin/auth/session`

Add this web route:

- `/admin/login`

## Exact Release 1 Session Policy

Use this exact first policy:

- rolling idle timeout: 12 hours
- cookie lifetime: 12 hours
- no separate `expired` boolean column
- no separate absolute-lifetime rule in the first pass

The auth lookup should do this on every protected request:

1. load `AdminSession` by id from the cookie
2. if session is missing, reject
3. if `expiresAt <= now`, reject and optionally delete the row
4. if valid, update:
   - `lastUsedAt = now`
   - `expiresAt = now + 12 hours`
   - cookie expiration to `now + 12 hours`

This means the session stays alive while the admin is actively using the admin
surface and expires after 12 hours of inactivity.

Do not use a 24-hour cookie with a 12-hour server-side session in the first
implementation. That mismatch is safe if the server rejects expired sessions,
but it makes the behavior harder to reason about while learning.

## Chosen Pattern For This Repo

Use this Release 1 model:

- `AdminUser` records stored in the API database
- passwords stored as hashes, never plaintext
- login happens once with email/password
- API creates the session and sets a secure cookie
- API stores the session in the database
- browser sends the cookie automatically on later admin requests
- API validates the cookie/session and loads the current `AdminUser`
- all `/admin` pages and all Nest admin routes require that authenticated admin
  user

Do not use:

- bearer tokens as the primary Release 1 browser auth model
- a shared web-app credential for admin API calls
- repeated credential submission on every request

## Why Cookies Win Here

Cookies are the better default for this repo because:

- the only current client is the browser-based admin web app
- the product is not exposing a third-party admin API
- cookies let the browser handle session transport automatically
- they reduce client-side auth state complexity compared with bearer tokens
- they match the learning goal of understanding browser sessions

Bearer tokens are not wrong in general. They are just a worse fit for this
specific internal browser-admin workflow.

## Session Shape Choice

Release 1 uses DB-backed sessions.

That means:

- the cookie stores a session id
- the session row lives in the database
- the API loads the session row on each authenticated admin request

This is the right first implementation because it keeps the cookie simple and
makes login, logout, invalidation, and debugging easier to understand.

Signed-cookie sessions are deferred as a later comparison exercise.

## Request Lifecycle

Use this exact mental model while implementing:

### Login

1. admin submits email and password from the login form
2. API loads the `AdminUser` by email
3. API verifies the submitted password against the stored password hash
4. API creates an `AdminSession` database record linked to that admin user
5. API sets `expiresAt = now + 12 hours`
6. API sets an `HttpOnly` cookie containing the session id and expiring in 12
   hours
7. browser stores the cookie

### Protected admin page request

1. browser requests `/admin/...`
2. browser sends the session cookie automatically
3. web/API auth layer reads the cookie value
4. API or shared auth lookup loads the `AdminSession`
5. if `expiresAt <= now`, request is rejected
6. if still valid, `lastUsedAt`, `expiresAt`, and cookie expiration are rolled
   forward
7. system resolves the linked active `AdminUser`
8. request is allowed or redirected/rejected

### Protected admin API request

1. browser triggers an admin action from the authenticated admin UI
2. browser sends the same session cookie with the request
3. API auth guard reads the session id from the cookie
4. API loads the session row
5. API rejects if the session is expired
6. if still valid, API updates `lastUsedAt` and `expiresAt` and refreshes the
   cookie expiration
7. API resolves the current active `AdminUser`
8. protected controller action runs only if that admin user is valid

The important detail is that the browser usually handles this cookie transport
automatically. The web app does not need to manually carry the session id in
component state.

### Logout

1. browser calls logout
2. API deletes or invalidates the `AdminSession` row
3. API clears the cookie
4. later `/admin` requests fail authentication and redirect to login

## Cleanup Policy

Do not block Release 1 on a background cleanup job.

For the first implementation:

- enforce expiration during request-time auth lookup
- optionally delete expired sessions when encountered
- optionally delete sessions during logout

If you later want cleanup hygiene, add a simple scheduled or manual cleanup path
after the core auth flow works.

## Future Follow-Up

If you want a Milestone 2 learning task, the best follow-up is a scheduled
expired-session cleanup job using Nest scheduling primitives. That is a good
separate exercise because the core auth flow already works without it.

## Direct Admin API Usage

If you want to call the protected admin API directly instead of through the web
UI, use the same session model:

1. call `POST /admin/auth/login` with admin credentials
2. capture the returned cookie
3. send later admin API requests with that cookie

That means:

- browser-based admin UI: browser manages the cookie automatically
- Postman/Insomnia: cookie jar usually manages it
- `curl`: save and resend cookies explicitly

Do not treat the session id as a custom bearer token. In this design, the
cookie itself is the transport mechanism for the authenticated session.

## Build Order

### 1. Add the `AdminUser` model to Prisma

Start in `apps/api/prisma/schema.prisma`.

Add exactly this `AdminUser` model first:

- `id`
- `email`
- `passwordHash`
- `isActive`
- `createdAt`
- `updatedAt`

In the same schema change, add the `AdminSession` model:

- `id`
- `adminUserId`
- `expiresAt`
- `createdAt`
- `lastUsedAt`

Do not add:

- public profile fields
- role matrices
- password reset fields
- invitation state

Why first:

Every other auth behavior depends on a persisted admin identity.

### 2. Create the migration and the admin-creation path

After the Prisma model exists:

- create the migration
- add the first admin-creation path

Use one of these:

- a dedicated seed helper in `apps/api/prisma/seed.ts`, or
- a one-off script under `apps/api/` that creates an admin user

Preferred approach:

- one script or seed helper that accepts an email/password input path and writes
  the `AdminUser` with a hash

Why second:

If you cannot create an admin user safely, the login flow cannot be proven end
to end.

### 3. Install and wire the auth libraries

Add these dependencies to `apps/api`:

- `bcryptjs`
- `cookie-parser`

Then wire `cookie-parser` in `apps/api/src/main.ts`.

Why third:

You want cookie access available before building guards and route handlers.

### 4. Add password hashing and verification in the API

Create the smallest auth module needed under `apps/api/src/`.

You need:

- a password-hash function for creation
- a password-verify function for login
- a repository/service path that can load an `AdminUser` by email

Keep the boundary explicit:

- repository handles lookup
- service handles credential verification

Why third:

This is the first real auth behavior and it should exist before sessions or web
gating.

### 5. Add admin login and logout endpoints

Add auth endpoints in the API for:

- `POST /admin/auth/login`
- `POST /admin/auth/logout`
- `GET /admin/auth/session`

Login should:

- accept email/password
- load the `AdminUser`
- reject inactive or missing users
- verify the password hash
- create the admin session
- set the cookie

Logout should:

- invalidate the session if server-side session state exists
- clear the cookie

Why fourth:

You need the explicit auth lifecycle before protecting downstream routes.

### 6. Implement the cookie-backed session

Use a per-user session carried by a cookie.

The browser should:

- receive an `HttpOnly` cookie after login
- automatically send it on later admin requests

The API should:

- parse the cookie
- load the session row
- resolve the current `AdminUser`

At this step, add the session persistence model itself. The Release 1 shape is:

- one `AdminSession` record per live session
- cookie carries the session id only
- API uses that session id to find the current admin user
- session id should be created with `crypto.randomUUID()`
- `expiresAt` should be enforced in auth lookup logic
- valid requests should roll `expiresAt` and `lastUsedAt` forward
- logout should delete or invalidate that session row

Why fifth:

This is the core mechanism that replaces repeated credential submission.

### 7. Add a shared API auth guard or equivalent enforcement layer

Once the API can resolve the current admin user from the cookie, add one shared
authorization mechanism for admin routes.

Apply it consistently to:

- `apps/api/src/submission/moderation-submission.controller.ts`
- `apps/api/src/action/admin-action.controller.ts`
- `apps/api/src/article/admin-article.controller.ts`
- `apps/api/src/event/admin-event.controller.ts`

The rule is simple:

- valid authenticated active `AdminUser`: allow
- otherwise: reject

Why sixth:

The API is the actual protected boundary for admin reads and writes.

### 8. Add the shared web gate for `/admin`

Now protect the Next admin tree at
`apps/web/src/app/admin/layout.tsx` or the nearest shared admin boundary.

That gate should:

- determine whether an authenticated admin session exists
- redirect unauthenticated users to `/admin/login`
- allow authenticated admins through

Do not duplicate auth logic across every page if the route tree can share one
gate.

Why seventh:

This makes the admin UI behave coherently for real users.

### 9. Add the admin login UI

Create the smallest web UI needed for admin authentication:

- `/admin/login` page/form
- logout action

The form should:

- post credentials to the auth endpoint
- handle invalid credentials cleanly
- send the user into `/admin` after success

Do not turn this into a general account-management feature.

Why eighth:

At this point the backend session flow exists and only needs the minimal browser
entry point.

### 10. Prove one protected moderation flow and one protected content flow

Before broadening tests, manually and programmatically verify:

- unauthenticated user cannot reach `/admin/submissions`
- unauthenticated user cannot call submission review endpoint
- authenticated admin can review a submission
- authenticated admin can perform one create/edit action in Actions, Articles,
  or Events

Why ninth:

This proves both the route gate and the API gate are real.

### 11. Add focused tests

Prioritize tests for:

- login success
- login failure
- unauthenticated access to protected admin API routes
- unauthenticated access to `/admin`
- authenticated admin access to one moderation route
- authenticated admin access to one content-management route
- logout or invalidated-session behavior if implemented in this slice

Phase 16 owns broader final smoke coverage. This phase needs the tests that
prove the auth boundary and auth lifecycle are correct.

## File-By-File First Pass

Use this order for the first implementation pass:

1. `apps/api/prisma/schema.prisma`
2. `apps/api/prisma/migrations/...`
3. `apps/api/src/main.ts`
4. `apps/api/src/auth/auth.module.ts`
5. `apps/api/src/auth/auth.service.ts`
6. `apps/api/src/auth/auth.repository.ts`
7. `apps/api/src/auth/admin-auth.controller.ts`
8. `apps/api/src/auth/admin-auth-validation.pipe.ts`
9. `apps/api/src/auth/admin-auth.request-schema.ts`
10. `apps/api/src/auth/admin-auth.guard.ts`
11. `apps/api/src/app.module.ts`
12. admin API controllers under `submission`, `action`, `article`, `event`
13. `apps/web/src/app/admin/layout.tsx`
14. `apps/web/src/app/admin/login/page.tsx`
15. `apps/web/src/lib/...` auth helper files
16. API and web tests touching the new auth boundary

## First Correct Structure

A good first structure for this phase usually looks like:

- one `AdminUser` persistence model
- one `AdminSession` persistence model
- one login/logout/session path
- one shared web-layer admin gate
- one shared API auth/authorization pattern
- one manual admin provisioning path
- one documented environment rule for local vs deployed behavior
- one focused set of tests proving protected and allowed flows

A bad first structure looks like:

- per-page ad hoc checks
- passwords stored without hashing
- no API enforcement
- no concrete admin-user creation path
- repeated credential submission on every request
- one shared secret standing in for the logged-in user
- local bypass logic copied into multiple routes

## Ask-When-Stuck Prompts

1. What is the smallest `AdminUser` schema that still supports secure login and active/inactive control?
2. What is the smallest `AdminSession` schema that still supports lookup, expiration, and invalidation?
3. Where should the current-admin lookup live so both route gating and API guards can rely on the same identity shape?
4. Which one moderation endpoint and one content-management endpoint should I protect first to prove the pattern?
5. What exact user-visible behavior should happen for unauthenticated admin access and failed login?
