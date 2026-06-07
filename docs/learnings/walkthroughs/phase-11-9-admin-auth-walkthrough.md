# Phase 11.9 Admin Auth Walkthrough

## What You Are Building

You are adding real access control to the existing admin surface in this order:

1. choose the Release 1 access model
2. define the manual admin-user provisioning path
3. establish the auth/session seam
4. protect `/admin` route entry
5. protect admin APIs
6. verify blocked-user behavior
7. add focused auth-boundary tests

Do not start by scattering auth checks across random pages.

## Read Before Editing

- `docs/agent-governance/progress.md`
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

Likely new or changed areas depending on the auth approach you choose:

- a web auth helper under `apps/web/src/lib/`
- a shared admin access check used by `apps/web/src/app/admin/layout.tsx`
- API auth or guard files under a new `apps/api/src/auth` feature or a shared
  cross-feature guard location
- controller decorators or guards on admin endpoints
- test files near admin pages and admin API controllers/services

## Build Order

### 1. Define the Release 1 access table before touching code

Write down the exact access model.

At minimum, decide:

- authenticated `admin` users may access all admin routes and admin APIs
- non-admin or unauthenticated requests are blocked
- which backend endpoints are admin-only

Why first:

If the capability map is fuzzy, you will implement inconsistent checks and then
rewrite them.

### 2. Define the manual admin-user provisioning path

Write down how the first and future admin users are created for Release 1.

Good Release 1 options:

- database insert of an admin record with a password hash
- seed path for one or more admin users
- one-off script/CLI command that creates an admin user

Do not add:

- public signup
- invitation flows
- user-management UI
- self-service password recovery unless scope changes

Why second:

The auth system is not complete until there is an operator path to create and
maintain trusted admin users.

### 3. Choose the session seam

Pick the narrowest auth/session integration that can answer these two questions
in both apps:

- is there a valid signed-in admin identity?
- what role does that identity have?

Do not start by wiring page redirects before you know where identity comes from.

Why second:

Every later check depends on one shared notion of current user identity.

### 4. Protect the shared admin web boundary

Start with `apps/web/src/app/admin/layout.tsx` or the nearest shared server
boundary for admin pages.

Make sure:

- unauthenticated requests do not render admin UI
- forbidden users do not render admin UI
- allowed users can continue into nested routes

Do not duplicate the same gate in every individual admin page unless one page
has a truly different permission rule.

Why third:

This gives the entire admin tree one consistent entry rule.

### 5. Protect admin API routes feature by feature

Add API protection for admin endpoints in:

- `submission`
- `action`
- `article`
- `event`

Prefer one clear enforcement pattern across these features.

That usually means:

- one guard or shared authorization helper
- consistent 401/403 behavior
- no route silently trusting the frontend

Why fourth:

The API is the true mutation boundary. A protected page with unprotected write
routes is still broken.

### 6. Add one blocked-behavior path on the web

Define the user experience for blocked access.

Examples:

- redirect unauthenticated users to login
- show an explicit forbidden state for authenticated but unauthorized users

Keep the behavior consistent across all `/admin` entry points.

Why fifth:

This is where auth stops being only infrastructure and becomes visible product
behavior.

### 7. Verify one high-risk action end to end

Before broad test expansion, prove one real admin action is protected.

Good first candidate:

- moderation review action in `submission`

Also verify one content-management action:

- create or update in `action`, `article`, or `event`

Why sixth:

This catches the common failure where pages are gated but mutations are not.

### 8. Add focused auth-boundary tests

Prioritize tests for:

- unauthenticated access to `/admin`
- unauthorized access to a protected admin page
- unauthorized call to a moderation action endpoint
- unauthorized call to an admin content save endpoint
- authorized happy path for one moderation route and one content-management
  route

Do not try to rebuild the whole final smoke suite in this phase.

Why seventh:

Phase 16 now owns the broader final confidence pass. Phase 11.9 only needs the
focused tests that prove the auth boundary is real.

## First Correct Structure

A good first structure for this phase usually looks like:

- one shared web-layer admin gate
- one shared API auth/authorization pattern
- one small admin-user model
- one manual admin provisioning path
- one documented environment rule for local vs deployed behavior
- one focused set of tests proving protected and allowed flows

A bad first structure looks like:

- per-page ad hoc checks
- no API enforcement
- no concrete admin-user creation path
- local bypass logic copied into multiple routes

## Ask-When-Stuck Prompts

1. Which existing admin routes can all share the same access rule, and which if any need a stricter one?
2. Where should the current-user lookup live so both route gating and API guards can rely on the same identity shape?
3. What is the exact Release 1 admin-user record and how is it created manually?
4. Which one moderation endpoint and one content-management endpoint should I protect first to prove the pattern?
5. What exact user-visible behavior should happen for unauthenticated versus forbidden admin access?
