# Context for Next Agent Session — Phase 14.3

## State of the repo

**Branch:** `main` (start a new branch for 14.3)
**Phase 14.1 ✅ and 14.2 ✅ are complete and merged.**

**Start with Phase 14.3 — Navbar and Nav Identity.**

---

## Process — read this first

**Spec-first.** Every UI subphase writes and aligns on a spec before any implementation begins.

For 14.3, the first task is: write `docs/specs/ui/navbar.md` and present it to the user for
sign-off. Do not touch any code until the spec is approved.

Reference files:

- `docs/specs/ui/global.md` — shared patterns (typography, color, cards, CTAs, section structure)
- `docs/specs/ui/homepage.md` — example of a completed, approved spec

---

## Design decisions locked — do not re-open

Read `docs/specs/ui/global.md` for the full set. Key ones for 14.3:

- **Dark navy + amber.** Applied boldly — amber is a structural signal, not decoration.
- **Nav mark:** replace `· FYF ·` with a simplified SVG fist mark derived from `bg-motif.png`.
  CSS-generated dots are a placeholder, not a logotype.
- **Admin Demo:** move out of primary nav entirely — relocate to footer or a utility/secondary
  header position. A first-time visitor should not encounter it alongside Issues, Articles,
  Actions, Events. Removing the amber styling alone is not sufficient.
- **Copy voice:** punk rock and sincere. Emotional plea, not product description. See
  `CONTEXT-next-session.md` design decisions from the 2026-06-20 planning session for the full
  copy brief.

---

## Phase 14.3 scope

**Branch:** `feat/phase_14/nav-identity`

**Tasks (from `progress.md`):**

1. Write and align on UI spec (`docs/specs/ui/navbar.md`) — implementation blocked until approved
2. Design and implement a simplified SVG fist mark for the nav wordmark slot
3. Move Admin Demo out of primary nav to footer or utility header position

**Done condition:** Nav has a real mark not CSS placeholder dots; Admin Demo is not a primary
nav item and does not compete with content navigation.

---

## What changed in Phase 14.2 (for context)

- Homepage arc corrected: hero → how it works → issue roll → contribute
- Issue roll moved to its own section (`home-issues`, id="issue-roll") with heading "Choose your fight."
- Hero has single anchor CTA ("Find yours →") scrolling to issue roll
- Manifesto copy in hero: acknowledges overwhelm → collective momentum → fire within
- hero.png retired; bg-motif.png used as hero backdrop at 35% opacity
- Card hover underline fixed globally: title only, not all text
- UI spec process introduced: `docs/specs/ui/` folder with `global.md` and `homepage.md`

---

## Remaining Phase 14 subphases

| Subphase | Scope                   | Status  |
| -------- | ----------------------- | ------- |
| 14.3     | Navbar and nav identity | ⏳ next |
| 14.4     | Issues and entity pages | ⏳      |
| 14.5     | Admin visual alignment  | ⏳      |
| 14.6     | Engineering             | ⏳      |
| 14.7     | Continuity pass         | ⏳      |
| 14.8     | Events UX               | ⏳      |
| 14.9     | Copy pass               | ⏳      |

Full task lists and done conditions for all subphases are in `progress.md` Phase 14.

---

## Guardrails

- Run `pnpm typecheck` before every commit
- Do not expand scope mid-subphase — document discoveries in progress.md and continue
- Do not re-open design decisions listed above or in `docs/specs/ui/global.md`
- Spec must be approved by the user before implementation begins
