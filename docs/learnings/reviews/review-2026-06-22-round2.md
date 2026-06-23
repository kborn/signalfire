# Site Review — Find Your Fight

**Review date:** 2026-06-22 (round 2)
**Reviewed by:** Claude (autonomous)
**Prior review:** [review-2026-06-22.md](review-2026-06-22.md)

---

## Score Tracker

| Dimension     | This Review | Prior Review | Target  |
| ------------- | ----------- | ------------ | ------- |
| Visual Design | 7.5         | 6.0          | 8.0     |
| UX / Product  | 6.5         | 5.5          | 8.5     |
| Engineering   | 7.5         | 7.5          | 9.0     |
| **Overall**   | **7.0**     | **6.0**      | **8.5** |

A full point of movement in one session. The logo fix accounts for most of it.

---

## Visual Design — 7.5/10

This looks like a different site from this morning. The wordmark, the hero, and the motif changes compound into something that actually reads as intentional and finished. Two findings remain but neither is as damaging as what was fixed.

### What moved

**Logo is now legitimate.** "Find Your Fight" in the navbar is the single most impactful fix made all week. It anchors the brand, it's readable, and it no longer signals "placeholder that shipped." The fact that this appears in the navbar AND as the hero h1 on the homepage works — the contexts are different enough that it reads as brand reinforcement, not redundancy.

**Hero is clean.** One paragraph, one CTA, motif visible in the background at the right weight. This is how it should have looked from day one. The Playfair Display at that size with the motif behind it is the strongest single frame in the product.

**Three Steps cards have identity now.** The oversized watermark numerals give each card a distinct anchor. Removing the "Step X" eyebrow cleaned up the redundancy. The "Choose your issue →" CTA at the bottom makes the section's purpose unambiguous.

**Motif is visible across page types.** Collection pages went from invisible noise to a proper presence. The detail page motif in the top-right corner adds the visual richness those pages were missing. Consistent across all five screenshots.

### Remaining issues — closed end of session

**"Find Your Fight" appears twice in the hero fold.** — _closed: accepted. Suggesting to abbreviate back to "FYF" would directly contradict five reviews of feedback. The double appearance is a common brand reinforcement pattern; it's not a problem._

**Action detail / event detail sparseness** — _both fixed. Action Type moved to a badge above the title (orphaned metadata block removed). Event detail fully redesigned: single-column information-first layout with prominent date/time and location above the fold, secondary metadata in a compact card at bottom._

---

## UX / Product — 6.5/10

The product story is materially clearer than this morning. The Three Steps fix is the biggest UX win — the page now explains the journey and points you at the entry point, instead of fragmenting you across three browse lists. One critical problem remains.

### What moved

**Three Steps is now product explanation, not nav.** Non-interactive cards + single CTA + watermark numerals = a section that reads as "here's how this works" rather than "here are three links." This is the correct framing for a homepage that wants to drive users toward the issue roll.

**Hero CTA is explicit.** "Browse Issues →" does the job "Find yours →" never did. You know exactly what you're clicking and what you'll get.

**Events filter is collapsed by default.** Events are now visible immediately. The filter is accessible but secondary. This is the right order.

**Action detail metadata is cleaner.** Published and Updated dates are gone. Action Type remains, which is genuinely useful. The metadata block is no longer sitting between the CTA and the description.

### Remaining issues — closed end of session

**"Take Action on example.org →"** — _closed: seed data updated with real external URLs (mobilize.us etc.) earlier in the session._

**Editorial voice on collection pages** — _closed: explored a featured-card CSS approach but it was a frontend shortcut with no data model backing it. The "Featured" badge would always just mark the newest item. Removed. Genuine editorial hierarchy requires a `featured` boolean in the data model — deferred to a future phase if the platform is taken further._

---

## Engineering — 7.5/10

Moved slightly within the band. CSS utilities layer added (`utilities.css`) with stack layout classes; three redundant one-off classes (`demoPageGrid`, `demoInfoBlock`, `about-steps`) deleted and replaced with `stack-md` at all usage sites. The ISR revalidation fix (removing `await connection()` calls, relying on `revalidate=3600`) was addressed in a prior session by another agent.

---

## What Is Actually Good

Everything from the prior review still holds, plus:

- The homepage now has a coherent visual hierarchy from top to bottom: wordmark → hero (brand + motif) → three steps (how it works) → issue roll (entry point) → contribute. That's a real product flow.
- The detail page motif implementation is clean — `z-index: -1` within the isolated stacking context, masked to fade correctly, consistent with collection page treatment.
- The events page is the most improved list page — collapsed filter, visible content immediately, topic pills for quick filtering.

---

## Priority Fix List — all closed

- [x] FIX-01 — Seed demo data with realistic external URLs (UX/Product) — _done_
- [x] FIX-02 — Editorial hierarchy on collection pages (UX/Product) — _closed: requires data model change; deferred_
- [x] FIX-03 — Remove `await connection()` calls; rely on `revalidate=3600` (Engineering) — _done by prior agent_
- [x] FIX-04 — "Find Your Fight" appearing twice (Visual Design) — _closed: accepted, not a problem_
- [x] FIX-05 — Action/event detail sparseness (Visual Design) — _done: event page redesigned, action type badge added_
- [x] FIX-06 — Post-submission confirmation state (UX/Product) — _closed: already existed, finding was incorrect_

---

## Vision Alignment Check

- Simplicity over completeness — do not add features or information that increase cognitive load
- Focus-to-action journey — every change should make the Learn → Decide → Act path clearer
- Portfolio credibility — changes should raise technical or product quality, not just visual polish

_This document is non-canonical. Do not cite it in architecture or governance docs._
