# Phase 11.9 Admin Auth Boundary Guide

## Concepts To Understand Now

- the admin auth problem has two enforcement layers: web routes and API routes
- authentication answers who the user is; authorization answers what they may do
- Release 1 uses one internal `admin` user type
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

## Related Canonical Sources

- [Project progress](/Users/kevinborn/Workspace/personal/WebStormProjects/signal-fire/docs/agent-governance/progress.md)
- [Phase 11 moderation/admin UI spec](/Users/kevinborn/Workspace/personal/WebStormProjects/signal-fire/docs/specs/011-phase-11-moderation-admin-ui.md)
- [Moderation workflow spec](/Users/kevinborn/Workspace/personal/WebStormProjects/signal-fire/docs/specs/moderation-workflow.md)
- [Architecture intent](/Users/kevinborn/Workspace/personal/WebStormProjects/signal-fire/docs/architecture/003-architecture-intent.md)
