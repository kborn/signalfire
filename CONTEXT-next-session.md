# Context for Next Agent Session — Phase 14.8

> **Note:** Phase 14.7 branch (`feat/phase_14/continuity`) contains significantly more work than
> the original phase plan — the continuity pass expanded to include a full motif threading pass
> across all public pages, search page redesign, and footer refinements. Review this branch before
> merging; it is larger than a typical single-subphase branch.

## State of the repo

**Branch:** `feat/phase_14/continuity` — Phase 14.7 complete, all checks pass (lint, typecheck, build).
**Merge this branch to main, then start a new branch for 14.8.**

**Phases complete:** 14.1 ✅ 14.2 ✅ 14.3 ✅ 14.4 ✅ 14.5 ✅ 14.6 ✅ 14.7 ✅

**Start with Phase 14.8 — Events UX.**

---

## What changed in Phase 14.7 (for context, extended)

- **Continuity checklist.** `docs/specs/ui/continuity.md` written — canonical reference for what
  to check on every page before approving it. Covers typography, color, motif opacity, cards,
  CTAs, copy voice, accessibility, and per-page expectations.

- **Interior page visual gap fixed.** `detailHero` and `discoveryPageHeader` now carry:
  - A section-scoped `::before` motif at 10% / 8% opacity, right-anchored and contained within
    the section (not the fixed-watermark approach that was abandoned).
  - Display-scale Playfair Display h1 (`clamp(2rem, 5vw, 3.6rem)` and `clamp(2rem, 4.5vw, 3.2rem)`).
  - Action detail page header updated from `detailHeader` to `detailHeader detailHero` for parity
    with article, issue, and event detail pages.

- **FYF copy threading.**
  - Issue detail step 03 `issueStepSub`: changed from "Concrete next steps you can take right
    now" → "This is where your fight gets real."
  - Action detail CTA area: added `<p className="section-label">Your next step</p>` above the
    primary CTA when `externalUrl` is present.
  - Homepage hero and About page already carried the dual meaning — no changes needed.

- **Admin list row interaction — decision: fully clickable rows.** CSS stretched-link pattern
  applied via `.adminRecordTable tbody tr { position: relative }` and
  `.adminTableRecordLink::after { position: absolute; inset: 0 }`. Row hover state and title
  underline on hover added. Applies consistently to all admin list pages via the shared
  `adminRecordTable` class (submissions, articles, actions, events, topics all use it).

- **README.** Active phase reference updated from Phase 13.6 to Phase 14.7.

- **Manual walkthrough.** `docs/runbooks/submission-to-publication-walkthrough.md` created —
  full submit → moderate → publish → verify pipeline, including rejection flow, draft approval,
  and edge cases.

- **Keyboard accessibility pass.** Focus rings verified present on all interactive elements
  (global `a:focus-visible` + per-component patterns). `aria-describedby` + `aria-invalid`
  confirmed on submission form inputs via `getFieldA11y`. Tab order is semantically correct.
  Finding: inline error `<p>` elements lack `role="alert"` — queued for Phase 14.9 since that
  phase touches the same form surfaces anyway.

- **Motif header threading.** All public pages now carry a consistent right-anchored
  `bg-motif.png` in their page header section using a fixed-width pseudo-element
  (`inset: 0 0 0 auto; width: clamp(220px,28vw,320px); background-size: 100% auto;
background-position: top center`). This ensures the same fist size regardless of element
  height. Pages covered: `detailHero` (article/issue/action/event detail), `discoveryPageHeader`
  (issues/articles/actions index), `about-hero`, `submitEntryHeader`. Events page is the only
  remaining gap — tracked as a Phase 14.8 task (needs structural fix first). Amber bottom border
  added to all non-collection page headers for structural consistency.

- **Search page redesigned.** Layout restructured to two parallel paths: keyword input →
  results (if any) → OR divider → Browse by issue (topic pills). Topic pills use compact
  `searchBrowseTopics` pill style (not full secondaryCTA buttons). This eliminates the
  broken empty-state where header and footer motifs bracketed a nearly-empty page.

- **Footer.** Slightly larger fist (`clamp(380px,44vw,480px)`), top padding
  `clamp(64px,9vw,104px)` gives knuckles room to clear the nav text.

- **Two late fixes.** `discoveryPageHeader` `max-width: 60rem` removed so the amber border
  spans the full content width (text elements inside have their own max-widths). `--topic-accent`
  defined in `:root` with `var(--color-brand-primary)` fallback — silences IDE static CSS
  resolver warning; the variable is still set at runtime via inline JSX styles per topic.

- **Screenshots deferred.** All 5 portfolio screenshots need regeneration but require
  `pnpm dev` + seeded DB. Run: `node scripts/regenerate-doc-screenshots.mjs`. Screenshots are
  still pre-Phase 14; update them before the phase 14 branch stack lands on main.

---

## Phase 14.8 scope

**Branch:** `feat/phase_14/events-ux` (start from main after merging 14.7)

**Tasks (from `progress.md`):**

1. Decide and implement default Events page behavior — current random city default is
   confidence-destroying; options: show-all upcoming, filter-first with no default city, or
   explicit demo-framing of the bounded geography
2. Add demo geography framing to the Events page — a brief note explaining the demo includes
   events from NY, PA, CA, TX, and PR; prevents out-of-region reviewers from concluding the
   platform is regional or data-thin

**Done condition:** A first-time visitor landing on `/events` sees something relevant or a
clear invitation to filter — not results for a city they didn't choose; the bounded demo
geography is explained rather than silent.

---

## Remaining Phase 14 subphases

| Subphase | Scope                      | Status      |
| -------- | -------------------------- | ----------- |
| 14.7     | Continuity pass            | ✅ complete |
| 14.8     | Events UX                  | ⏳ next     |
| 14.9     | Copy pass                  | ⏳          |
| 14.10    | Nav mark & favicon artwork | ⏳          |

Full task lists and done conditions for all subphases are in `progress.md` Phase 14.

---

## Guardrails

- Run `pnpm typecheck` before every commit
- Do not expand scope mid-subphase — document discoveries in progress.md and continue
- Do not re-open design decisions in `docs/specs/ui/global.md`
- Screenshots require the dev server + seeded DB (`pnpm dev` + `node scripts/regenerate-doc-screenshots.mjs`)
