# Context for Next Agent Session — Phase 14.7

## State of the repo

**Branch:** `feat/phase_14/engineering` — Phase 14.6 complete, all checks pass, tests pass.
**Merge this branch to main, then start a new branch for 14.7.**

**Phases complete:** 14.1 ✅ 14.2 ✅ 14.3 ✅ 14.4 ✅ 14.5 ✅ 14.6 ✅

**Start with Phase 14.7 — Continuity Pass.**

---

## What changed in Phase 14.6 (for context)

- **Revalidation fix.** `revalidateTopicPages` was revalidating `/topics/${slug}` (redirect
  pages) instead of `/issues/${slug}` (cached pages). Fixed to use `/issues/` paths.
  `revalidateTopicAdminPages` also corrected from `/topics` to `/issues`.

- **EventListPageProps consolidation.** Three duplicate `EventListPageProps` type definitions
  replaced with shared types in `apps/web/src/app/(public)/events/event-search-params.ts`:
  `EventSearchParams` (all optional, for raw URL params) and `ResolvedEventSearchParams`
  (startDate/endDate required, for resolved params). Admin events page renamed its local type
  to `AdminEventSearchParams`.

- **TopicService.getTopicDetail refactor.** Cross-service fan-out removed: `TopicService`
  no longer depends on `ArticleService` or `ActionService`. A single
  `findBySlugWithPublishedContent` repository method replaces 3 queries (findBySlug +
  findPublishedByTopicSlug for articles + actions). `TopicModule` no longer imports
  `ArticleModule` or `ActionModule`. Service spec updated to mock the new repository method.

- **Topic color field.** `color String?` added to Prisma `Topic` model. Migration applied
  (`20260621005614_add_topic_color`). Seed updated with colors matching the prior CSS values:
  democracy `#5b88c7`, consumer-activism `#c9894a`, climate `#4a9e7c`, civil-rights `#c76b5b`,
  economic-justice `#c4a23e`, education `#7a84c7`, local-community `#5da870`. CSS hardcoded
  `[data-topic='slug']` color blocks removed from `collection.css`. Frontend components
  (`topic-summary.tsx`, homepage, article/action/event detail breadcrumbs, issues/[slug] step
  headers) now apply `--topic-accent` as inline `style` from `topic.color`. Admin topic editor
  (`TopicEditorForm.tsx`) now includes a hex color input field. API contracts updated:
  `TopicSummary`, `TopicDetailResponse`, `AdminTopicSummary`, `AdminTopicRequest` all have
  `color?: string`.

- **CSRF and session documentation.** `docs/runbooks/admin-auth-posture.md` created with:
  CSRF posture explanation (SameSite: lax + CORS is sufficient, no CSRF tokens needed);
  session expiration flow (middleware detects 401, redirects to login with returnPath,
  clears cookie, login shows "Sign in to continue").

---

## Phase 14.7 scope

**Branch:** `feat/phase_14/continuity` (start from main after merging 14.6)

**Tasks (from `progress.md`):**

1. Write and align on continuity checklist (`docs/specs/ui/continuity.md`) before reviewing
   any page
2. Review all public pages against the settled visual direction — motif opacity, palette
   boldness, typography scale — and correct any outliers
3. Thread "Find Your Fight" dual meaning through copy on: homepage hero, About page, action
   detail CTA area, issue detail section headers
4. **Interior page visual gap** — homepage reads as a high-impact visual experience;
   interior pages feel comparatively flat. Bring the hero visual vocabulary into interior
   page sections (detailHero, discoveryPageHeader) through section-scoped motif backgrounds
   and/or display-scale typography moments.
5. Regenerate all 5 portfolio screenshots after Phase 14 changes land
6. Update README active phase reference (currently points to Phase 13.6)
7. Keyboard accessibility pass: tab through submission form, events filter, and admin
   moderation workflow; verify focus rings, tab order, and error announcements
8. Document manual walkthrough of submission → moderation → publish → public visibility
9. **Admin list row interaction** — decide whether admin list rows should be fully clickable;
   make a call and apply consistently across all admin list pages
10. No structural changes to public pages, no new features — coherence, verification,
    and documentation only

**Done condition:** A reviewer navigating from homepage through an issue into an article and
action feels a consistent visual and emotional thread; screenshots match the shipped product;
keyboard navigation is verified; the full content pipeline has a documented manual walkthrough.

---

## Remaining Phase 14 subphases

| Subphase | Scope                      | Status      |
| -------- | -------------------------- | ----------- |
| 14.6     | Engineering                | ✅ complete |
| 14.7     | Continuity pass            | ⏳ next     |
| 14.8     | Events UX                  | ⏳          |
| 14.9     | Copy pass                  | ⏳          |
| 14.10    | Nav mark & favicon artwork | ⏳          |

Full task lists and done conditions for all subphases are in `progress.md` Phase 14.

---

## Guardrails

- Run `pnpm typecheck` before every commit
- Do not expand scope mid-subphase — document discoveries in progress.md and continue
- Do not re-open design decisions in `docs/specs/ui/global.md`
- Screenshots require the dev server + seeded DB (`pnpm dev` + `node scripts/regenerate-doc-screenshots.mjs`)
