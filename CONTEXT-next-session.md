# Context for Next Agent Session — Phase 14.10

## State of the repo

**Branch:** `feat/phase_14/copy` — Phase 14.9 complete, all checks pass (format, lint, typecheck, build).

**Phases complete:** 14.1 ✅ 14.2 ✅ 14.3 ✅ 14.4 ✅ 14.5 ✅ 14.6 ✅ 14.7 ✅ 14.8 ✅ 14.9 ✅

**Next: Phase 14.10 — Nav Mark & Favicon Artwork.**

---

## What changed in Phase 14.9

Full voice/tone copy pass across every public page. Changes committed in one commit on `feat/phase_14/copy`.

Key rewrites:

- Homepage, about, issues/articles/actions/events index intros: all shed passive hedging and self-description
- Issue detail step sub (Read): "Explainers and field guides" → "Read enough to understand what's actually at stake."
- Action detail: "Related Topics" → "Related Issues"; "Learn More" → "Read First"
- Event detail: same section header changes + contribute nudge added (was missing)
- Search: h1 → "Search"; added one-line ILIKE framing in the intro; no-results copy explains word-match limitation
- Submit entry: h1 → "Share what you know."; card and meta copy sharpened
- Submission success: "Thanks for submitting" → "We've got it." + tells submitters what happens next
- "Nothing is published automatically" → "Your submission goes to a reviewer before anything goes live."
- `role="alert"` on all inline form error `<p>` elements (accessibility, deferred from 14.7)
- Footer "Submit Content" → "Contribute"

---

## Phase 14.10 scope

**Branch:** start `feat/phase_14/nav-mark` from current branch (or merge first — agent's call based on git state)

**Goal:** Replace the placeholder amber circle in the nav home-link mark and browser favicon with final artwork.

**Swap points (isolated — only these two files need to change):**

- `apps/web/src/components/icons.tsx` — `FYFLogo` SVG component (nav mark, renders at ~22px height)
- `apps/web/public/fyf-mark.svg` — favicon (32×32 viewBox, amber on dark navy)

**Decision to make first:** should the nav mark and favicon be the same design or different?

- Candidates: (a) same SVG at two sizes, (b) motif-derived image for nav + lettermark for favicon, (c) other
- This is an **open design question** — the previous agent deferred it here

**Practical constraints:**

- The nav mark renders inside a `<Link>` as an `<svg>` element with `className="site-brand-logo"`
- The favicon is a standalone SVG file served from `/public/fyf-mark.svg`
- Color token is `--color-brand-primary` (#cfac5a amber) in both
- Current mark is a placeholder circle — anything more intentional is an improvement
- If sourcing from the motif image: trace in Figma/Illustrator, export as SVG path

**Done condition:** The nav home-link mark is visually intentional and references the FYF brand; the favicon reads as a recognizable mark at 16px; placeholder circle is gone from both.

---

## Remaining Phase 14 subphases

| Subphase | Scope                      | Status      |
| -------- | -------------------------- | ----------- |
| 14.9     | Copy pass                  | ✅ complete |
| 14.10    | Nav mark & favicon artwork | ⏳ next     |
| 14.11    | Final nitpick pass         | ⏳          |

Full task lists and done conditions are in `progress.md` Phase 14.

---

## Guardrails

- Run `pnpm typecheck` before every commit
- Do not expand scope mid-subphase
- Do not reopen design decisions in `docs/specs/ui/global.md`
- Screenshots require the dev server + seeded DB (`pnpm dev` + `node scripts/regenerate-doc-screenshots.mjs`)
