# Topic Admin Branch — Context for Next Agent

## What was built

Full CRUD admin interface for the Issue (Topic) entity. Topics were previously
seed-only; admins can now create, edit, and delete them through the admin
workspace at `/admin/topics`.

## Architecture

**API:**

- `GET /admin/topics` — list all topics with linked content counts
- `GET /admin/topics/:slug` — detail for one topic
- `POST /admin/topics` — create (slug auto-generated from name)
- `PATCH /admin/topics/:slug` — update name and description (slug immutable)
- `DELETE /admin/topics/:slug` — delete only if no linked content

**Files added:**

- `packages/api-contracts/admin-topic.types.ts` — DTOs
- `apps/api/src/admin-api/topic/admin-topic.controller.ts`
- `apps/api/src/admin-api/topic/admin-topic.service.ts`
- `apps/api/src/admin-api/topic/admin-topic.request-schema.ts`
- `apps/api/src/admin-api/topic/admin-topic.validation.ts`
- `apps/api/src/admin-api/topic/admin-topic-validation.pipe.ts`
- `apps/web/src/app/admin/(workspace)/topics/page.tsx` — list with counts
- `apps/web/src/app/admin/(workspace)/topics/new/page.tsx`
- `apps/web/src/app/admin/(workspace)/topics/[slug]/page.tsx`
- `apps/web/src/app/admin/(workspace)/topics/_components/TopicEditorForm.tsx`

**Files modified:**

- `apps/api/src/topic/topic.repository.ts` — added write methods + count queries
- `apps/api/src/admin-api/admin-api.module.ts` — registered topic controller/service
- `packages/api-contracts/index.ts` — exported admin-topic types
- `apps/web/src/lib/api/admin.ts` — added create/update/delete topic functions
- `apps/web/src/lib/api/admin.server.ts` — added server-side list/detail functions
- `apps/web/src/lib/api/base.ts` — added `deleteAuthenticated` function
- `apps/web/src/app/admin/(workspace)/layout.tsx` — added "Issues" nav link

## Decisions

**Delete is guarded.** Topics with any linked articles, actions, or events
cannot be deleted — the button is disabled in the UI with a tooltip, and the
API returns 400. The user must unlink all content first.

**Slug is immutable.** Same pattern as Articles and Actions. Slug generates
from the name on creation and cannot be changed afterwards.

**"Issues" label in admin nav.** Admin uses "Issues" to match the public-facing
product language, even though the technical name remains "Topic" in the codebase.

## What to review

- Navigate to /admin/topics — should show list with article/action/event counts
- Create a new topic — should create and redirect to edit page
- Edit an existing seeded topic (e.g. "Democracy") — should save name/description
- Try to delete a topic with linked content — Delete button should be disabled
- Create a topic then delete it — should work
