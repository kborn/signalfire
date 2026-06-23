# Site Review — Find Your Fight

**Review date:** 2026-06-23
**Reviewed by:** Agent (end-of-session review)
**Prior review:** review-2026-06-23-post-nitpick.md

Note: some screenshots in the main screenshots folder predate this session's changes. Assessments reflect current code where screenshots are stale.

---

## Score Tracker

| Dimension     | Prior   | This Review | Delta    |
| ------------- | ------- | ----------- | -------- |
| Visual Design | 7.5     | 8 / 10      | +0.5     |
| UX / Product  | 7       | 7.5 / 10    | +0.5     |
| Engineering   | 8.5     | 8.5 / 10    | —        |
| **Overall**   | **7.5** | **8 / 10**  | **+0.5** |

---

## Visual Design — 8/10

The site has a consistent, distinctive visual identity. The palette, typography, and motif all work together. Most of the separator confusion is resolved. The remaining issues are polish, not problems.

### What Improved

**Event detail hierarchy is now correct.** Title → red separator → dek → thin separator → date/location reads as intended. The event type badge above the title grounds the content type immediately.

**Detail page motif reads as texture, not a stamp.** The radial gradient mask fades the image softly in all directions from the upper-right focal point. At opacity 0.15 it adds atmosphere without competing with content.

**Homepage gap after hero is tighter.** The double-margin bug (grid gap + page-section margin stacking to 136px) is fixed. Section separators now feel like deliberate divisions rather than accidents.

**Article page decluttered.** Removing the sidebar eliminates the three-way collision between title motif, metadata card, and article lead in the upper-right corner.

### Remaining Issues

**Issue roll still reads slightly awkward.** The vertical column of large Playfair Display text links is deliberately kept, but it's the only vertical list element on the homepage and it contrasts with the card treatment everywhere else. Not a blocker — it's locked — but worth acknowledging.

**Events list cards are visually undifferentiated.** Without event type colors (reverted), all event cards look the same. The event type label chip (RALLY, WORKSHOP, etc.) is there but small. The only visual variation comes from the amber hover state.

**Homepage screenshots are stale.** The screenshots still show "Go deep on one issue" and the old issue roll treatment. The actual product is ahead of the screenshots.

---

## UX / Product — 7.5/10

The journey from homepage to action is now coherent. The vocabulary is consistent. Forward momentum is present on every page. What remains is edge case polish.

### What Improved

**Journey vocabulary is now consistent.** Homepage establishes Choose → Read → Act. Issue page says "Read" and "Act" without numbers. Article page closes with "Now act." The thread holds across pages even though numbers don't carry through — the verbs do.

**Article page forward momentum is fixed.** "Now act" appears before "Explore This Issue Further." The fallback when no actions are linked goes to the filtered actions list (`/actions?topicSlug=...`), not back to the issue page. The "Explore This Issue Further" section now clearly reads as secondary, not primary.

**Issue detail is no longer confusing.** The step-01 "Go Deep" header is gone. The issue description is a plain lead paragraph. "Read" and "Act" are clean section labels with no numbers that contradict the homepage's 02/03 framing.

**Events page: location context is always visible.** The note that results aren't geo-filtered appears on every visit, not just in demo mode.

**Issue detail: content is capped.** Articles and actions are limited to 5 with "Browse all N" links to the filtered list pages. A 100-item issue page is no longer possible.

### Remaining Issues

**Events filter is still a collapsed collapsible.** Most users won't know to expand it. The region selector — the most useful filter for a civic events platform — is hidden behind a click. The location context note tells them it exists, but they still have to find and expand it. Worth reconsidering as a default-open or always-visible treatment.

**Article detail "Explore This Issue Further" tagline is weak.** "More context, more actions, and related events are on that issue page" is accurate but generic. It doesn't tell you why you'd go there after you've already read the article. If the article already linked you to actions, what else is there? The tagline should speak to the remaining gap.

**No forward signal from the issues list.** The issues grid (/issues) is a destination without direction — you pick a card but there's no framing for what you're doing ("Pick one issue to focus on" or similar). The homepage primes this but a direct /issues URL gives no context.

---

## Engineering — 8.5/10

No regressions. The codebase is in good shape. The sidebar removal was clean — dead CSS rules in both detail.css and responsive.css cleared. Pagination spacing fix is correctly scoped to admin.css (shared component) so it benefits both admin and public list pages.

### Remaining Issues

**`/topics` root redirect still exists as a live route.** It correctly redirects to `/issues`, so it's not broken, but it's dead code from the user's perspective. Low priority.

**`detailContent--event` CSS class exists but is never applied.** The class appears in detail.css and responsive.css but the event detail page uses plain `detailContent`. Dead selector. Not harmful, just noise.

**`topicEventCTA` CSS rule is now an empty block.** After removing the `margin-top` override, the rule is `{}`. Should be deleted.

---

## What Is Actually Good

- **Hero copy is still the strongest writing on the site.** "The news doesn't stop. The problems feel enormous." — no changes needed.
- **Action detail page is the best single screen.** CTA above the fold, clear external link, related issues below, contribute nudge at the bottom. Every element earns its place.
- **Event detail separator hierarchy works.** After several iterations, the title → red line → dek → thin line → date/location flow is clean and logical.
- **Issues grid color system** (topic accent colors on cards) is compositional and consistent.
- **Admin workspace** is clean, functional, and well-structured. Submission review page in particular is solid.
- **The about page copy** is honest and persuasive. No changes needed.
- **Step eyebrow labels on homepage journey cards** ("Step 01 / 02 / 03") make the progression read immediately.

---

## Priority Fix List

### High — product credibility

- [ ] FIX-01 — Events filter: make region selector visible without an extra click (UX)
- [ ] FIX-02 — "Explore This Issue Further" tagline: write to the reason you'd go there after already reading an article (UX / Copy)
- [ ] FIX-03 — Issues list (/issues): add framing copy or heading that orients a direct-arrival user (UX)

### Medium — polish

- [ ] FIX-04 — Update homepage screenshots to reflect current state (Reference)
- [ ] FIX-05 — Delete empty `.topicEventCTA {}` CSS rule (Engineering)
- [ ] FIX-06 — Delete dead `.detailContent--event` CSS selectors (Engineering)

---

## Vision Alignment Check

Before acting on any finding, verify it aligns with the project intent:

- Simplicity over completeness — do not add features or information that increase cognitive load
- Focus-to-action journey — every change should make the Learn → Decide → Act path clearer
- Portfolio credibility — changes should raise technical or product quality, not just visual polish

_This document is non-canonical. Do not cite it in architecture or governance docs._
