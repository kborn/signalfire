# Context for Next Agent Session — Phase 14.4

## State of the repo

**Branch:** `feat/phase_14/nav-identity` — Phase 14.3 complete, all tests pass, build clean.
**Merge this branch to main, then start a new branch for 14.4.**

**Phases complete:** 14.1 ✅ 14.2 ✅ 14.3 ✅

**Start with Phase 14.4 — Issues and Entity Pages.**

---

## Process — read this first

**Spec-first.** Every UI subphase writes and aligns on a spec before any implementation begins.

For 14.4, the first task is: write `docs/specs/ui/entity-pages.md` and present it to the user
for sign-off. Do not touch any code until the spec is approved.

Reference files:

- `docs/specs/ui/global.md` — shared patterns (typography, color, cards, CTAs, section structure)
- `docs/specs/ui/navbar.md` — example of a completed spec (status: IMPLEMENTED)

---

## What changed in Phase 14.3 (for context)

- **Wordmark restructured.** The `· FYF ·` self-contained SVG is replaced with a two-part
  layout: `FYFLogo` SVG icon (left) + `<span class="site-wordmark-text">FYF</span>` (right).
  The icon is currently an **amber circle placeholder** — final artwork deferred to Phase 14.10.
  Swap point: replace paths in `FYFLogo` in `apps/web/src/components/icons.tsx`.

- **Favicon.** `apps/web/public/fyf-mark.svg` added as SVG favicon (primary); `fyf-favicon.png`
  stays as PNG fallback. `fyf-mark.svg` is also a placeholder amber circle — swap point for 14.10.

- **Admin Demo removed from primary nav.** No longer in `SiteNav` or the mobile drawer.
  Now lives in two places (both demo-mode only):
  1. `DemoBanner` — "Admin →" link in the actions area, with copy explaining it
  2. Public footer — plain "Admin" link after "Submit Content"

- **Phase 14.10 added** to `progress.md` — artwork decision for nav mark and favicon.

- **Color token note:** `--color-brand-primary` = `#cfac5a` (amber/gold — the main accent color).
  `--color-brand-accent` = `#98503b` (rust/brown — secondary). Don't confuse them; use
  `--color-brand-primary` for amber accents.

---

## Phase 14.4 scope

**Branch:** `feat/phase_14/entity-pages` (start from main after merging 14.3)

**Tasks (from `progress.md`):**

1. Write and align on UI spec (`docs/specs/ui/entity-pages.md`) — implementation blocked until approved
2. Thread breadcrumb accent color: pass `data-topic={topics[0]?.slug}` to breadcrumb on article,
   action, and event detail pages; style via existing topic CSS selectors
3. Replace database description copy on `/issues` index cards with motivating, human-facing language
4. Bold palette — three specific CSS changes only:
   - `metaLabel` text color → amber (`var(--color-brand-primary)`)
   - Collection item left borders visible at rest at reduced opacity, full on hover (currently hover-only)
   - Issue detail step numbers (`02`, `03`) rendered at display scale in Playfair Display

**Done condition:** Breadcrumb on entity pages carries topic accent color; issue index cards have
copy that invites rather than describes; three named palette changes applied and no further.

---

## Remaining Phase 14 subphases

| Subphase | Scope                      | Status      |
| -------- | -------------------------- | ----------- |
| 14.3     | Navbar and nav identity    | ✅ complete |
| 14.4     | Issues and entity pages    | ⏳ next     |
| 14.5     | Admin visual alignment     | ⏳          |
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
