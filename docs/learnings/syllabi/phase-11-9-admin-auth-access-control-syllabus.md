# Phase 11.9 Admin Authentication And Access Control Syllabus

## Purpose

This syllabus orients Phase 11.9 so you can add real admin access control
without turning the work into a full user-management platform.

## Current Task Or Subtask

Phase 11.9 is about protecting the existing `/admin` surface before any real
user deployment.

You are building:

- authentication for the deployed admin surface
- authorization for admin routes and backing admin APIs
- the Release 1 `admin` user model
- explicit unauthenticated and unauthorized behavior

You are not building:

- public user accounts
- social login expansion for the public site
- moderator/admin permission splits
- audit trails or revision history
- invitation flows or account self-service
- a general-purpose identity platform

## Prerequisites

Read these first:

- `docs/agent-governance/progress.md`
- `docs/specs/011-phase-11-moderation-admin-ui.md`
- `docs/specs/moderation-workflow.md`
- `docs/architecture/001-system-architecture.md`
- `docs/architecture/003-architecture-intent.md`

Know these basics before coding:

- `/admin` pages are already implemented and currently assume trusted access
- page protection and API protection are separate boundaries
- hiding a link is not authorization
- Release 1 uses one internal `admin` user type, not a role matrix
- local-only convenience and deployed-environment safety can be different

## Modules In Practical Build Order

### Module 1: Separate authentication from authorization

**Objective**

Understand the difference between proving identity and proving permission.

**Why it matters**

If you collapse these together, you usually end up with route checks that know
who the user is but never clearly answer whether that user may moderate content.

**Key concepts**

- authentication
- authorization
- identity
- permission boundary
- session or token

**Repo-specific context**

This repo has an internal `/admin` surface and backend admin-capable endpoints,
but no current auth layer. Phase 11.9 must add both the identity check and the
permission check.

**Small concrete example**

A signed-in person is authenticated.
A signed-in admin who can reach `/admin/submissions` is authorized.
A signed-in person without the admin role should still be blocked.

**Common mistakes**

- treating login presence as sufficient permission
- protecting only the UI route and forgetting the API
- assuming local hidden routes count as security

**Short exercise**

Write down two separate questions for every protected request:

1. Who is this user?
2. Is this user allowed to do this admin action?

### Module 2: Protect both the web route and the API route

**Objective**

Learn why Next route protection and Nest API protection must both exist.

**Why it matters**

If you protect only the page layer, direct HTTP calls can still hit admin
endpoints. If you protect only the API layer, the admin UI can still render
confusingly for blocked users.

**Key concepts**

- defense in depth
- route gate
- server-side check
- API guard
- redirect vs reject

**Repo-specific context**

The admin pages live under `apps/web/src/app/admin`, and the admin-capable API
behavior currently lives in the `submission`, `action`, `article`, and `event`
features under `apps/api/src/`.

**Small concrete example**

A non-authenticated request to `/admin/articles` should be redirected or denied
at the web layer. A direct POST to an admin Article endpoint should also fail at
the API layer even if someone bypasses the page.

**Common mistakes**

- checking auth only in `layout.tsx`
- checking auth only in controller methods without protecting page rendering
- letting the UI assume success and treating 401/403 as impossible

**Short exercise**

List the admin page entry routes and the corresponding admin write/read APIs
that must enforce the same boundary.

### Module 3: Keep the Release 1 access model narrow and explicit

**Objective**

Define the Release 1 admin-user model without creating an unnecessary
permissions matrix or user-management feature set.

**Why it matters**

This phase should finish with a clear operational rule. If you overbuild roles
or account-management features now, you will create implementation drag and
more test burden than the product scope justifies.

**Key concepts**

- single admin-user model
- manual provisioning
- capability mapping
- explicit deferral

**Repo-specific context**

Phase 11 now includes moderation plus essential content management. That means
one admin-user model must cover both reviewing submissions and editing Actions,
Articles, and Events.

**Small concrete example**

Release 1 uses one `admin` user type that may access every `/admin` route and
the corresponding admin APIs.

**Common mistakes**

- inventing future roles without a product need
- giving different routes inconsistent permission rules
- failing to document which admin routes/actions require an authenticated admin

**Short exercise**

Before coding, write a one-table admin access map for:

- `/admin`
- `/admin/submissions`
- `/admin/actions`
- `/admin/articles`
- `/admin/events`

### Module 4: Preserve local ergonomics without weakening deployment safety

**Objective**

Understand how to keep development workable while still enforcing real
protection in deployed environments.

**Why it matters**

Canonical docs allow local-only openness when useful, but any real-user
deployment must be protected. You need a technical boundary that makes this
explicit instead of accidental.

**Key concepts**

- environment boundary
- local bypass
- deployment enforcement
- safe default

**Repo-specific context**

The roadmap now treats Phase 11.9 as the place where deployed admin access
control becomes real. That does not require making every local workflow painful.

**Small concrete example**

A local environment may allow a simplified bootstrap path or a documented dev
bypass. Production and preview environments intended for real reviewers should
require real auth.

**Common mistakes**

- leaving the bypass enabled everywhere
- encoding environment assumptions in multiple scattered places
- failing to test the deployed behavior because local access is convenient

**Short exercise**

Identify one place where the environment decides whether admin auth is enforced,
and one place where API permission checks remain mandatory regardless.

### Module 5: Treat unauthorized behavior as product behavior

**Objective**

Define what blocked users see and how protected actions fail.

**Why it matters**

Auth is not complete when the happy path works. Operators need predictable
behavior for expired sessions, direct deep links, and forbidden actions.

**Key concepts**

- redirect target
- 401 vs 403
- expired session
- failure-state UX

**Repo-specific context**

The admin area already has many route entry points and action forms. Those
surfaces must degrade predictably when access fails.

**Small concrete example**

An unauthenticated visit to `/admin/events/new` may redirect to login.
An authenticated-but-forbidden API call to publish content should return `403`.
The UI should not pretend the save succeeded.

**Common mistakes**

- using one generic failure for every auth case
- swallowing auth failures in the client
- leaving unauthorized users on broken half-rendered admin pages

**Short exercise**

Write the expected behavior for these three cases:

- unauthenticated GET to an admin page
- authenticated but unauthorized POST to an admin API
- expired session during an admin save

## Recommended First Implementation Step

Define the Release 1 access model, route/API boundary, and admin-user
provisioning approach before choosing any library-specific wiring.

## Suggested Next Learning Docs

After this syllabus, use:

- `docs/learnings/implementation-guides/phase-11-9-admin-auth-boundary-guide.md`
- `docs/learnings/walkthroughs/phase-11-9-admin-auth-walkthrough.md`

### Module 6: Use manual admin-user provisioning for Release 1

**Objective**

Understand the simplest sufficient way to create and manage admin users for the
initial release.

**Why it matters**

The auth boundary is incomplete if no one can reliably create the first admin
account. Release 1 needs a concrete operator workflow, even if it is manual.

**Key concepts**

- admin user record
- password hash
- manual provisioning
- no self-service account management

**Repo-specific context**

Release 1 does not require a public account system or an internal admin-user
management UI. The first admin users may be provisioned manually through
database, seed, or one-off script operations.

**Small concrete example**

An operator runs a local script or seed step that inserts an `AdminUser`
record with an email and password hash. The deployed admin login uses that
record to authenticate the person.

**Common mistakes**

- storing plaintext passwords
- adding signup or invitation flows without scope approval
- assuming raw database editing is the only manual path

**Short exercise**

Write down the exact Release 1 operator flow for creating the first admin user.
