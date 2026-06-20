# Context for Next Agent Session — Phase 14.6

## State of the repo

**Branch:** `feat/phase_14/admin-visual-alignment` — Phase 14.5 complete, all checks pass, build clean.
**Merge this branch to main, then start a new branch for 14.6.**

**Phases complete:** 14.1 ✅ 14.2 ✅ 14.3 ✅ 14.4 ✅ 14.5 ✅

**Start with Phase 14.6 — Engineering.**

---

## What changed in Phase 14.5 (for context)

- **Admin panel backgrounds.** All hardcoded light-mode hex values (`#ffffff`, `#171717`,
  `#e5e7eb`, `#d1d5db`, `#6b7280`, `#fafafa`, `#f3f4f6`, etc.) replaced with dark token
  equivalents throughout `admin.css`. Affected: `adminPanel`, `adminBadge`, `adminTable`,
  `adminReviewBanner`/`Error`, `adminDefinitionList`, `adminTextEditor`, `adminTextareaEditor`,
  `adminLongTextPreview`, `adminTableCellMeta`, `adminTableSummaryCell`, `adminCreatedRecord*`,
  `adminEmptyStateTitle`, and all text/border colors in the review and table flows.

- **Inter bold headings.** `font-family: var(--font-body); font-weight: 700` added to
  `adminHeader h1`, `adminSection h2/h3`, `adminPanelHeader h2/h3`. Playfair Display no
  longer appears in the admin workspace. Login form title also switched to Inter bold with
  adjusted letter-spacing.

- **Segmented control fix.** `adminSegmentedControl`/`adminFilterGroup` default button
  background changed from `color-mix(... #ffffff 45%)` to `color-mix(... var(--color-page-bg) 45%)`.
  Pagination and topic selector white-mix values were intentionally left unchanged (used on
  public pages where the light active signal is correct).

- **Login left panel.** Amber radial glow at top center (7% opacity) + amber-tinted border,
  matching the right panel's visual language. Gradient uses token system instead of raw hex.

- **Login right panel.** Flat 65% dark overlay replaces the directional gradient (was 56% at
  lighter end). CSS SVG grain texture via `::after` pseudo-element at 3.5% opacity.

---

## Phase 14.6 scope

**Branch:** `feat/phase_14/engineering` (start from main after merging 14.5)

**Tasks (from `progress.md`):**

1. Add `revalidatePath()` calls after all admin mutations: article create/update/publish,
   action create/update, event create/update/publish, topic create/update/delete
2. Consolidate `EventListPageProps` — replace three separate definitions across
   `events/page.tsx`, `events/_components/event-filters.tsx`, and `admin/events/page.tsx`
   with one shared type
3. Move `TopicService.getTopicDetail` cross-service fan-out to the repository layer —
   single Prisma query with includes instead of calling `ArticleService` and `ActionService`
4. Add `color` field to Topic Prisma model; seed existing topics with color values; replace
   hardcoded `[data-topic='slug']` CSS selectors with inline `--topic-color` CSS variable
   applied from the model
5. Document CSRF posture for admin mutation routes — either implement mitigation or write a
   short explanation of why the existing CORS configuration makes it a non-issue; add to
   auth runbook
6. Verify session expiration behavior: let an admin cookie expire mid-workflow and confirm
   clean redirect to login; document the behavior

**Done condition:** Admin mutations trigger immediate cache revalidation; `EventListPageProps`
defined once; topic detail uses one repository query; topic colors are data-driven and work
for any topic created through admin; CSRF posture is documented; session expiration produces
a clean, tested recovery path.

---

## Remaining Phase 14 subphases

| Subphase | Scope                      | Status      |
| -------- | -------------------------- | ----------- |
| 14.5     | Admin visual alignment     | ✅ complete |
| 14.6     | Engineering                | ⏳ next     |
| 14.7     | Continuity pass            | ⏳          |
| 14.8     | Events UX                  | ⏳          |
| 14.9     | Copy pass                  | ⏳          |
| 14.10    | Nav mark & favicon artwork | ⏳          |

Full task lists and done conditions for all subphases are in `progress.md` Phase 14.

---

## Guardrails

- Run `pnpm typecheck` before every commit
- Do not expand scope mid-subphase — document discoveries in progress.md and continue
- Do not re-open design decisions in `docs/specs/ui/global.md`
- Phase 14.6 task 4 (topic color field) touches the Prisma schema and seed — run
  `prisma migrate reset` locally and verify seeded colors appear before committing
