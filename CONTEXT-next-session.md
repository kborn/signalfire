# Context for Next Agent Session — Phase 14.10 (continued)

## State of the repo

**Branch:** `feat/phase_14/nav-mark`

**Phases complete:** 14.1 ✅ 14.2 ✅ 14.3 ✅ 14.4 ✅ 14.5 ✅ 14.6 ✅ 14.7 ✅ 14.8 ✅ 14.9 ✅

**Phase 14.10 is in progress.** The art strategy is now documented and decisions are locked.
Implementation of the code-only items is ready to proceed. One art dependency is outstanding.

---

## What changed in this session

- Committed a nav mark SVG that renders as a chevron/arrow, not a flame — **this needs to be
  replaced** as part of the implementation below (revert `FYFLogo` to nothing, then remove it)
- Wrote `docs/specs/ui/visual-identity-art-strategy.md` — the canonical art strategy spec
- Added decision to `docs/agent-governance/decisions.md` — "Visual identity art strategy"

---

## Phase 14.10 scope (revised)

**Goal:** Replace placeholder art with intentional treatments across nav mark, favicon, and footer.
The motif strategy is now locked — homepage hero only.

### Code-only items (no art needed — implement now)

**1. Remove the FYFLogo SVG mark from the nav**

- `apps/web/src/app/(public)/layout.tsx` — remove `<FYFLogo className="site-brand-logo" />`
- `apps/web/src/components/icons.tsx` — remove or deprecate `FYFLogo` export
- `apps/web/src/app/styles/layout.css` — remove `.site-brand-logo` if it becomes unused

**2. Build and ship the "F" lettermark favicon**

- `apps/web/public/fyf-mark.svg` — currently the broken chevron from this session; replace with
  a bold "F" in Playfair Display style: amber `#cfac5a` on dark navy `#0f1923` rounded square,
  `viewBox="0 0 32 32"`, "F" fills ~60% of height, centered
- Use SVG `<text>` with a serif stack OR trace the Playfair Display "F" as a path
- Must read clearly at 16×16 (browser tab favicon rendering size)
- Confirm `apps/web/src/app/layout.tsx` root metadata links to `/fyf-mark.svg`

**3. Replace footer motif with amber border**

- `apps/web/src/app/styles/layout.css` — remove `.site-footer::before` pseudo-element entirely
- Change `.site-footer` border-top to `2px solid var(--color-brand-primary)`

### Art-dependent items (wait for user to supply cleaned `bg-motif.png`)

**4. Replace `bg-motif.png`**

- User supplies: PNG-24 with transparent alpha, ≥2400px wide, no noise/grain layer, clean arrowhead edges
- Drop file into `apps/web/public/bg-motif.png` (replace in place)
- After delivery: tune `.heroPoster::before` opacity (start at 0.30, adjust visually)
- After delivery: remove motif from `about-hero::before` in `pages.css` (lines ~114-130)

---

## Done condition for Phase 14.10

- [ ] FYFLogo removed from nav; text-only "FYF" wordmark remains
- [ ] Favicon SVG is a clean "F" lettermark, readable at 16px
- [ ] Footer has no motif; amber border-top
- [ ] Cleaned `bg-motif.png` delivered and dropped in (art dependency — user supplies)
- [ ] About page motif sidebar removed
- [ ] Homepage hero renders without crackle
- [ ] Full visual check: homepage, about, search (empty), one collection page, footer

---

## Key decisions (locked — do not reopen)

- `docs/agent-governance/decisions.md` → "Visual identity art strategy"
- `docs/specs/ui/visual-identity-art-strategy.md` — full delivery spec and usage map

---

## Remaining Phase 14 subphases

| Subphase | Scope                      | Status         |
| -------- | -------------------------- | -------------- |
| 14.10    | Nav mark & favicon artwork | 🔄 in progress |
| 14.11    | Final nitpick pass         | ⏳             |

---

## Guardrails

- Run `pnpm typecheck` before every commit
- Do not add the motif to any page other than the homepage hero
- Do not attempt to generate a nav mark SVG from scratch — the decision is text-only wordmark
- Do not implement art-dependent items until the user delivers the cleaned PNG
