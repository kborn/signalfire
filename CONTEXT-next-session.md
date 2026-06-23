# Context for Next Agent Session — Phase 15: Deployment Infrastructure

## State of the repo

**Branch:** `feat/phase-14/nitpick_pass` (local only — not pushed)

**Phase 14 status:** ✅ Complete. All 11 sub-phases done.

**Next phase:** Phase 15 — Deployment Infrastructure

---

## Before starting Phase 15

The Phase 14 branch needs to land on `main` before deployment work begins.
Confirm with the human whether to merge now or after a final review pass.

---

## What Phase 15 covers

Hosting, environment management, and CI/CD. Full task list is in `progress.md`
under Phase 15. High-level:

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

| Surface         | State                                                          |
| --------------- | -------------------------------------------------------------- |
| Homepage        | Strong hero, step-labeled journey cards, issue roll            |
| Issues list     | Topic color grid, directive copy for direct-arrival users      |
| Issue detail    | Read / Act / Events sections, capped at 5 items each           |
| Article detail  | Single-column, metadata below body, "Now act" forward signal   |
| Event detail    | Title → red separator → dek → thin separator → date/location   |
| Events list     | Location note always visible, filter collapsible               |
| Action detail   | External CTA above fold — strongest screen in product          |
| Admin workspace | Submission review, moderation queue, editorial editors — solid |

---

## Locked decisions (do not relitigate)

- **Issue roll treatment**: vertical large-type Playfair Display column with
  left-border accents and hover-slide. User preference. Do not change to
  horizontal/inline without explicit approval.
- **Motif placement**: homepage hero (full-bleed ::before) + collection headers
  (right-anchored img with fade). Detail pages use radial-gradient mask at 0.15
  opacity. See `decisions.md` → "Visual identity art strategy".
- **Visual palette**: dark navy + amber (#cfac5a). Locked.
- **Typography**: Playfair Display (display/headings) + Inter (body). Locked.

---

## Review documents

All reviews are in `docs/reviews/`. The final review for Phase 14 is
`review-2026-06-23-final.md` (8/10 overall).
