# Context for Next Agent Session — Phase 15: Deployment Infrastructure

## State of the repo

**Branch:** `feat/phase-14/nitpick_pass` (local only — not pushed)

**Phase 14 status:** ✅ Complete.

**Next phase:** Phase 15 — Deployment Infrastructure

---

## Before starting Phase 15

The Phase 14 branch needs to land on `main` before deployment work begins.
Confirm with the human whether to merge now or open a PR for review first.

---

## What Phase 15 covers

Full task list is in `progress.md` under Phase 15. High-level:

- Confirm hosting/runtime shape (public site, API, database, admin-auth boundary)
- Define how schema migrations run in deployed environments
- Configure environment variables and secret handling
- Ensure CI is a credible merge gate (lint, typecheck, unit, integration, e2e)
- Add Dependabot and dependency vulnerability validation
- Define branch protection rules for `main`
- Decide on `CODEOWNERS` for post-Milestone 1 maintenance
- Lightweight traffic visibility without a paid analytics stack

---

## Product state at phase close

The public-facing product is at 8/10 by honest agent review. Key surfaces:

| Surface         | State                                                                |
| --------------- | -------------------------------------------------------------------- |
| Homepage        | Card grid for issues, floating demo pill, step-labeled journey cards |
| Issues list     | Journey strip (step 1 active), topic color grid                      |
| Issue detail    | Read / Act / Events sections, capped at 5 items each                 |
| Articles list   | Journey strip (step 2 active), topic filter                          |
| Article detail  | Journey strip, single-column, metadata below body, "Now act" CTA     |
| Actions list    | Journey strip (step 3 active), topic filter                          |
| Action detail   | Journey strip, external CTA above fold — strongest screen            |
| Events list     | Location note always visible, filter collapsible                     |
| 404 page        | Full public shell with styled recovery content and CTAs              |
| Admin workspace | Submission review, moderation queue, editorial editors — solid       |

---

## Locked decisions (do not relitigate)

- **Issue roll treatment**: homepage now uses compact 3-column card grid matching `/issues`. Do not revert to vertical roll without explicit approval.
- **Journey strip copy**: "Choose an issue / Read what matters / Take action" — matches interior pages. Homepage journey cards use slightly different copy ("Choose one issue / Read what matters / Do one concrete thing") — this minor inconsistency is known and acceptable.
- **Motif placement**: homepage hero (full-bleed `::before`) + collection headers (right-anchored img with fade). Detail pages use radial-gradient mask at lower opacity. See `decisions.md` → "Visual identity art strategy".
- **Visual palette**: dark navy + amber (#cfac5a). Locked.
- **Typography**: Playfair Display (display/headings) + Inter (body). Locked.
- **Demo banner**: floating pill at `position: fixed; bottom: 16px`. Rise-from-bottom animation. Do not move back to top of page.

---

## Known deferred items (not blockers for Phase 15)

- Events cards are still visually bare — event type color differentiation not implemented. Acceptable at current review score.
- `topicSelector` gap against demo banner when both are visible requires a `ResizeObserver` — deferred to Milestone 2 (`docs/future/milestone-2-planning-notes.md`).
- Journey strip copy consistency with homepage cards — known, acceptable.
