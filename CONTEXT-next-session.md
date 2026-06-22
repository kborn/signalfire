# Context for Next Agent Session — Phase 14.11 Final Nitpick Pass

## State of the repo

**Branch:** `feat/phase_14/nav-mark`

**Phases complete:** 14.1 ✅ through 14.10 ✅

---

## What was completed in 14.10

All Phase 14.10 items are done and committed:

- `FYFLogo` SVG mark removed from nav — wordmark is amber Playfair Display "FYF" text only
- Favicon (`fyf-mark.svg`) is bold "F" lettermark — amber serif on dark navy square
- Footer motif replaced with 2px amber `border-top`
- Wordmark color and font aligned to favicon (both amber, both serif)
- `bg-motif.png` replaced with clean transparent version (user-supplied)
- About page `about-hero::before` removed — no art on interior pages (Option A)
- Art strategy doc and decisions.md updated to reflect all resolved questions

Visual check passed: homepage motif ✅, about page clean ✅, footer amber border ✅, search/issues pages (motif on those headers is a 14.11 item).

---

## Phase 14.11 — Final Nitpick Pass

This is the current open phase. Tasks are tracked in `docs/agent-governance/progress.md`.

### Motif placement — flagged during 14.10 visual check

The following interior pages still have `bg-motif.png` in their section headers, which violates the locked art strategy ("motif on interior pages: No"). These are explicitly in the 14.11 scope ("Review motif placement and usage"):

| File         | Selector                       | Page                                                               |
| ------------ | ------------------------------ | ------------------------------------------------------------------ |
| `search.css` | `.searchHeader::before`        | Search page                                                        |
| `detail.css` | `.detailHero::before`          | All detail pages (issues, articles, actions, events)               |
| `pages.css`  | `.submitEntryHeader::before`   | Submit entry page                                                  |
| `pages.css`  | `.discoveryPageHeader::before` | Collection index pages (issues, articles, actions, events, topics) |

The homepage hero (`.heroPoster::before`) is the only correct usage — do not remove it.

### Other 14.11 items already in progress.md

- Double separator lines on about page between sections
- Demo banner partially covered when scrolling
- Search page "or browse by topic" wording
- Motif still not bold enough on homepage (darker, centered?)
- Red separator line missing on articles/issues detail pages
- Overall consistency pass (spacing, copy, hover states, empty states)

---

## Guardrails

- Run `pnpm typecheck` before every commit
- Do not push without explicit user confirmation
- Do not reopen nav mark, favicon, footer, or wordmark decisions
- The only correct `bg-motif.png` usage is `.heroPoster::before` on the homepage
