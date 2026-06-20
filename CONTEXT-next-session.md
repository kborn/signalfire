# Context for Next Agent Session — Phase 14.5

## State of the repo

**Branch:** `feat/phase_14/issues_entity_pages` — Phase 14.4 complete, all checks pass, build clean.
**Merge this branch to main, then start a new branch for 14.5.**

**Phases complete:** 14.1 ✅ 14.2 ✅ 14.3 ✅ 14.4 ✅

**Start with Phase 14.5 — Admin Visual Alignment.**

---

## Process — read this first

**Spec-first.** Write `docs/specs/ui/admin.md` and present it to the user for sign-off before
touching any admin CSS or components. Do not implement until approved.

Reference files:

- `docs/specs/ui/global.md` — shared patterns (typography, color, cards, CTAs, section structure)
- `docs/specs/ui/navbar.md` — example of a completed spec (status: IMPLEMENTED)
- `docs/specs/ui/entity-pages.md` — most recent completed spec (status: IMPLEMENTED)

---

## What changed in Phase 14.4 (for context)

- **Breadcrumb topic threading.** `data-topic` attribute added to the `<nav>` breadcrumb on
  article, action, and event detail pages. Per-topic `--topic-accent` variable assignments
  promoted from `.topicCollectionItem[data-topic]` to bare `[data-topic]` selectors — the
  variable now cascades to any element carrying the attribute (breadcrumbs, issue roll links,
  issue step headers).

- **Issue roll per-topic colors.** Homepage issue roll links (`heroPosterIssueLink`) now use
  `var(--topic-accent)` for at-rest border and hover state, not flat amber.

- **Palette changes.** `metaLabel` → amber (`--color-brand-primary`); collection item left
  borders dim at rest (40% opacity), full amber on hover; issue step numbers `02`/`03` render
  at display scale (`clamp(2.5rem, 5vw, 3.5rem)`) in Playfair Display.

- **Footer motif ornament.** `bg-motif.png` added as `site-footer::before` — centered, 18%
  opacity, `background-position: center top` so the fist is the focal point and bottom swirls
  are clipped. Replaces earlier fixed-position watermark approach (abandoned — documented in
  progress.md Phase 14.7).

- **Key decision documented in progress.md 14.7:** Interior page visual gap — the homepage
  hero vocabulary (display-scale type, motif at meaningful opacity, amber structure) does not
  carry into interior pages. Continuity pass (14.7) should bring that vocabulary into
  `detailHero` and `discoveryPageHeader` sections. The motif-as-watermark approach was the
  wrong vehicle for this.

- **Color token reminder:** `--color-brand-primary` = `#cfac5a` (amber/gold — main accent).
  `--color-brand-accent` = `#98503b` (rust/brown — secondary). Don't confuse them.

---

## Phase 14.5 scope

**Branch:** `feat/phase_14/admin-visual-alignment` (start from main after merging 14.4)

**Tasks (from `progress.md`):**

1. Write and align on UI spec (`docs/specs/ui/admin.md`) — implementation blocked until approved
2. Apply dark navy background to admin workspace — remove `#eef2f5` light background
3. Replace Playfair Display with Inter bold for admin headings throughout workspace
4. Remove decorative elements from admin (no motif watermark, no hero textures) — functional
   register only
5. Retain amber for admin CTAs and status signals
6. Login page right panel: darken overlay to 60–70% opacity; apply grain CSS treatment over
   the motif image

**Done condition:** Admin workspace reads as the same product as the public site, different
mode not different company; login page right panel text is clearly readable over the motif.

---

## Remaining Phase 14 subphases

| Subphase | Scope                      | Status      |
| -------- | -------------------------- | ----------- |
| 14.4     | Issues and entity pages    | ✅ complete |
| 14.5     | Admin visual alignment     | ⏳ next     |
| 14.6     | Engineering                | ⏳          |
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
- Spec must be approved by the user before implementation begins
