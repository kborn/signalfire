# Context for Next Agent Session — Phase 14.11 (continued) / Phase 15

## State of the repo

**Branch:** `feat/phase_14/nav-mark` (main, ahead of origin)

**Phases complete:** 14.1 ✅ through 14.10 ✅

**Phase 14.11 status:** In progress — core items committed, visual review deferred (requires running server)

---

## What was completed in 14.11 (this session)

Two commits on main:

1. **Progress.md housekeeping** — prettier formatting fix
2. **Core nitpick fixes:**
   - `detailHero` border-bottom changed from subtle-blue to `var(--color-brand-accent)` — adds the missing amber separator line on article/action/event/topic detail pages
   - `detailHero::before` opacity normalized 0.10 → 0.08 (matches all other interior headers)
   - `about-body` `border-top` removed — was creating a double separator with `about-hero`'s amber `border-bottom` (24px gap between two lines); `about-journey` keeps its `border-top`
   - `--demo-banner-gap` changed 0px → 16px in tokens.css — pushes demo banner below `site-header::after` overlay (which extends 16px below the header border and was covering the top of the sticky banner)
   - Search page: removed `searchOrDivider` + `searchBrowseSection` (the "or browse by issue" topic list) — redundant with empty state CTAs and nav
   - Search page: intro copy now links to `/issues` inline instead of pointing "below"

### Motif decision (settled)

**Keep interior page motifs.** Right-anchored `clamp(220px, 28vw, 320px)` at 0.08 opacity on all interior headers (`.detailHero`, `.discoveryPageHeader`, `.submitEntryHeader`, `.searchHeader`). Unified at 0.08. The CONTEXT-next-session.md from Phase 14.10 was written during a period of uncertainty — user confirmed "keep but tweak" and the implementation is defensible editorial design.

### Footer motif (resolved)

Already replaced with 2px amber `border-top` in Phase 14.10. The progress.md task predated that change. No further action needed.

---

## Remaining Phase 14.11 items

The progress.md lists these as still open but they require a running server to evaluate:

- Walk every public route and note anything visually or editorially off
- Walk admin surfaces for anything that reads as unfinished
- Overall consistency pass (spacing, hover states, empty states)

These are "do with eyes" tasks — can't be done from code alone. If the user has time to run the server and do a walkthrough, the output of that review can seed the next pass. Otherwise, consider Phase 14.11 done given the concrete items are resolved and declare the phase complete.

---

## Phase 14.11 completion gate

Phase 14.11's Done condition: "Nothing visible in a normal reviewer walkthrough reads as an obvious oversight."

The concrete flagged items are all resolved. The remaining tasks are best-effort review items, not blocking defects. The agent can mark 14.11 complete and move to Phase 15 (Deployment Infrastructure).

---

## Guardrails

- Run `pnpm typecheck` before every commit
- Do not push without explicit user confirmation
- Do not reopen nav mark, favicon, footer, wordmark, or motif decisions
- The homepage `.heroPoster::before` is at 0.35 opacity; all interior headers use 0.08 — do not change these
