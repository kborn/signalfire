# Context for Next Agent Session — Phase 14.11 Final Review

## State of the repo

**Branch:** `main` (local, ahead of origin — not yet pushed)

**Phases complete:** 14.1 ✅ through 14.10 ✅

**Phase 14.11 status:** All code items resolved. Two human-eyes walkthrough tasks remain before the phase can close.

---

## What was resolved in 14.11

All concrete items are done:

- `detailHero` now has amber `border-bottom` (was subtle-blue)
- About page double separator fixed (removed `border-top` from `.about-body`)
- Search "or browse by issue" section removed
- Footer motif confirmed resolved from Phase 14.10
- Demo banner scroll positioning: `site-header::after` removed, `--demo-banner-gap: 11px`
- **Motif placement — settled** (see below)

---

## Motif — locked decision

`bg-motif.png` appears in exactly two contexts. Do not change this without a deliberate decision:

| Surface                                                | Treatment                                                                                    |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| Homepage hero                                          | Full-bleed `::before` at 35% opacity — primary brand statement                               |
| Collection headers (Issues, Articles, Actions, Events) | Right-anchored `<img className="discoveryPageHeaderMotif">` at 25% opacity, bottom-fade mask |
| Everything else                                        | No motif                                                                                     |

**Implementation:** `discoveryPageHeaderMotif` class in `pages.css`. The `.discoveryPageHeader` has `position: relative; overflow: hidden; isolation: isolate`. The `> *:not(.discoveryPageHeaderMotif)` rule lifts text children to `z-index: 1`. Do not convert the img to a `::before` without re-testing z-index/fade behavior.

**Rationale recorded in:** `docs/agent-governance/decisions.md` → "Visual identity art strategy"

---

## What's left before 14.11 closes

Two human-eyes walkthrough tasks. The agent cannot complete these without a running browser:

1. Walk every public route (homepage, about, demo, issues, articles, actions, events, search, submit entry/forms, error states) — note anything that reads as an obvious oversight
2. Walk admin surfaces (login, submissions queue, submission detail, articles, actions, events, topics) — note anything unfinished in the demo workflow

If the walkthrough finds no blockers, mark Phase 14.11 complete and advance to Phase 15.

---

## Guardrails

- Do not push without explicit user confirmation
- Do not reopen motif, nav mark, favicon, footer, or wordmark decisions
- `--demo-banner-gap: 11px` in `tokens.css` is the settled value — do not adjust without the user confirming it looks wrong
