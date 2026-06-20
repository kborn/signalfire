# Context for Next Agent Session — Phase 13.9

## Where we are

Branch: `feat/phase_13/review-3-polish` (stacked on `feat/phase_13/review-closure-3`, which is stacked on `feat/phase_13/ui-swing`)

Phase 13.8 is complete. All review-closure-3 regressions and user-reported polish items have been addressed. The open items below require user input before implementation — they are documented in `docs/agent-governance/progress.md` under Phase 13.9.

## Full branch stack (all local, nothing pushed)

```
main (Phase 13.6 merged)
  └── round3_review_closure   Phase 13.7 base: externalUrl, nav rename, CSS dedup
        └── typography         Playfair Display replaces Zilla Slab
              └── seed-urls    All 13 demo actions have externalUrl
                    └── loading-states   Skeleton loading on 8 public routes
                          └── keyword-search   /search page (ILIKE articles + actions)
                                └── topic-admin   Issues CRUD in admin + M2 deferrals
                                      └── css-architecture   globals.css split into 10 modules
                                            └── ui-swing   Full visual redesign
                                                  └── review-closure-3   Phase 13.8 base
                                                        └── review-3-polish   ← YOU ARE HERE
```

## What was done in Phase 13.8 (for context, not to redo)

- Homepage ISSUES array replaced with `getTopicsList()` API call
- Homepage restructured: "Find Your Fight" is now the large hero text; context/explanation comes before issue browser
- Dual meaning of "Find Your Fight" woven into homepage + About page copy
- `aria-label` CSS selector anti-pattern fixed (`site-search-link` class added)
- Dual demo indicator removed (header pill gone, banner kept)
- `secondaryCTA` hardcoded `#171717` replaced with CSS tokens
- Grain opacity raised to 0.08; bg-motif raised to 0.20 in hero; persistent motif watermark added across all public pages
- Card tilt rotation removed (translate-only)
- Submit page width inconsistency fixed
- Footer centered + links underlined at rest
- Admin not-found page created with admin shell layout
- Login page always shows full two-column layout; "Signal Fire Admin" → "Find Your Fight — Admin"; "session expired" copy neutralized
- `GenericIssueIcon` fallback added for unknown topics
- Contextual submission nudge added to article + action detail pages

## Phase 13.9 open items (need user decision before coding begins)

These are documented in `docs/agent-governance/progress.md` under Phase 13.9. Do not start work on them without asking the user first.

1. **FYF logo/glyph** — user asked about the current flame SVG and wants to know the plan. The flame icon is the current brand mark; the "FYF" text appears in the responsive wordmark on narrow screens. User said they miss the FYF treatment and thought a proper SVG was planned. **Ask user for direction before changing.**

2. **Homepage hero image** — user wants an image for the hero rather than text-only. **Needs asset or direction from user.**

3. **Color threading** — topic accent colors appear on the homepage issue roll and issues index cards but not on article/action cards belonging to that topic. **Ask user how far to thread (scoped to issue pages only vs. everywhere).**

4. **Events default UX** — user questioned value of showing random-city events by default. Options: keep current + better messaging, hide until region selected, or show only events from a preferred region. **Needs user decision.**

5. **Screenshots 04 and 05** — need retaking with live server:
   - Screenshot 04: action detail for an action WITH an `externalUrl` (all 13 published demo actions have one now)
   - Screenshot 05: admin submission review for an approved submission (requires authenticated admin session)
   - Regenerate with: `pnpm dev` → `cd apps/api && pnpm exec prisma db seed` → `node scripts/regenerate-doc-screenshots.mjs`

## Key decisions already made (do not relitigate)

- Playfair Display + Inter: locked
- Dark navy palette (#101820) + amber (#cfac5a): locked
- FYF flame icon in header: in place; full-name wordmark on wide screens
- CSS split into 10 modules in styles/: locked
- /issues routes (not /topics) as public URL: locked
- bg-motif.png: committed to — now at higher opacity and persists across public pages
- Demo banner (not header pill) is the sole demo mode indicator
- Login page always shows full two-column layout regardless of session state
