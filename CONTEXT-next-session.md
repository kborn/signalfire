# Context for Next Agent Session — Phase 14.9

## State of the repo

**Branch:** `feat/phase_14/events-ux` — Phase 14.8 complete, all checks pass (lint, typecheck, build).
**Merge this branch to main, then start a new branch for 14.9.**

**Phases complete:** 14.1 ✅ 14.2 ✅ 14.3 ✅ 14.4 ✅ 14.5 ✅ 14.6 ✅ 14.7 ✅ 14.8 ✅

**Start with Phase 14.9 — Copy Pass.**

---

## What changed in Phase 14.8

- **Events page header restructured.** `h1` + intro now live inside `discoveryPageHeader` — picks
  up the `bg-motif.png` `::before` treatment (8% opacity, right-anchored, amber `border-bottom`)
  via existing CSS. Events page now matches articles/actions discovery pages visually.

- **Demo geography note added.** A `metaText` paragraph ("Demo events are seeded across NY, PA,
  CA, TX, and PR — use the region selector to find them.") sits below the amber border and above
  the filter panel, rendered only when `NEXT_PUBLIC_ENABLE_DEMO_MODE=true`. Kept outside the
  header div intentionally so the amber line lands at a consistent height across all discovery pages.

- **Date param mismatch fixed.** `getContents` previously received raw `params` (no dates) while
  the filter UI showed `resolvedParams` (today → +3 months). Now passes `resolvedParams` — the
  API call matches what the filters display.

- **Phase 14.11 added to progress.md.** Final Nitpick Pass added as the last Phase 14 subphase —
  a full walkthrough of every public and admin route to catch anything still visually or editorially
  off before the branch stack merges.

---

## Phase 14.9 scope

**Branch:** `feat/phase_14/copy-pass` (start from main after merging 14.8)

**Voice direction (from progress.md):**

The copy should feel like an emotional plea, not a product description. The register is punk rock
and sincere — sentences that build, not bullet points that summarize. The dual meaning of "Find
Your Fight" (find the issue that's yours AND find the fighter within) is the emotional
underpinning. Acknowledge the overwhelm. Acknowledge that one person feels powerless. Then turn it.
The power and responsibility lives in each of us. Summon it. That is the through-line.

Avoid: trendy fragment copy ("Find. Act. Fight."), passive hedging ("submissions are reviewed
before..."), self-explanation ("this page shows you..."), defensive moderation language.

**Tasks (from `progress.md`):**

1. Audit every user-facing string across all public pages: homepage, about, issues index and
   detail, articles, actions, events, submit flow, search, error and empty states
2. Rewrite any copy that is choppy, fragmentary, hedging, or reads as UI chrome rather than a
   human voice
3. Ensure the emotional build — overwhelm → collective power → personal fire → action — is present
   in some form wherever a user might need it most (hero, issue detail, action CTA, empty states)
4. Add honest framing on the search page about what ILIKE search can and cannot find
5. Submission success state: tell submitters what happens next
6. Copy should feel like the same person wrote all of it

**Done condition:** Any string picked at random from any public page sounds like it belongs to the
same voice; the site reads as a rallying cry not a content directory.

---

## Remaining Phase 14 subphases

| Subphase | Scope                      | Status      |
| -------- | -------------------------- | ----------- |
| 14.8     | Events UX                  | ✅ complete |
| 14.9     | Copy pass                  | ⏳ next     |
| 14.10    | Nav mark & favicon artwork | ⏳          |
| 14.11    | Final nitpick pass         | ⏳          |

Full task lists and done conditions for all subphases are in `progress.md` Phase 14.

---

## Guardrails

- Run `pnpm typecheck` before every commit
- Do not expand scope mid-subphase — document discoveries in progress.md and continue
- Do not re-open design decisions in `docs/specs/ui/global.md`
- Screenshots require the dev server + seeded DB (`pnpm dev` + `node scripts/regenerate-doc-screenshots.mjs`)
