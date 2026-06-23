# Site Review — Find Your Fight

**Review date:** 2026-06-23
**Reviewed by:** Agent (post-nitpick pass)
**Prior review:** review-2026-06-22-honest-critique.md

---

## Score Tracker

| Dimension     | Prior | This Review  | Delta    |
| ------------- | ----- | ------------ | -------- |
| Visual Design | 7     | 7.5 / 10     | +0.5     |
| UX / Product  | 6     | 7 / 10       | +1.0     |
| Engineering   | 8     | 8.5 / 10     | +0.5     |
| **Overall**   | **7** | **7.5 / 10** | **+0.5** |

---

## Visual Design — 7.5/10

The step labels on the journey cards and the event type color system are real improvements. The site holds together better as a designed object than it did before the pass.

### What Changed

**Journey cards now communicate sequence**
"STEP 01 / 02 / 03" eyebrow labels above each card title make the progression immediately legible. The three-column layout was reading as a feature list before; it now reads as a numbered path. Combined with the existing ghost-numeral watermarks in the cards, this is double-reinforced without feeling noisy.

**Event type colors give the events list visual structure**
The RALLY amber border on the screenshot's first event card is clearly distinct. Each event type now has a color identity at rest, not just on hover. This is the most visible delta from the pass.

### Remaining Issues

**Issue roll subtle-background improvement is real but minimal**
The 4% tinted background at rest is technically present but not perceptible at a glance. The improvement to the left-border opacity (30→55%) registers more. The roll still reads as a list rather than a feature moment — it's better but not solved.

**Events page header is now tall**
Location note + open filter form + topic pills + page header = a lot of scroll before you see an event. The filter being open by default is the right call for usability, but the page now has an unusually heavy above-the-fold section. A user on a laptop may see only the filter form and not know events are below it.

---

## UX / Product — 7/10

The events page is the most improved surface. It went from "hidden filter, no location context, undifferentiated card list" to "explicit location note, visible filter, color-coded cards." That is a genuine gap closed.

### What Changed

**Events filter is now open and location context is always visible**
The `<details open>` change means the State/territory, City, and date pickers are immediately visible without an interaction. The location note ("Results are not filtered by your location — use the filters below to find events near you.") appears on all visits, not just demo mode. This is the most important UX fix in the pass.

**Step labels make the homepage journey narrative land**
The homepage is now persuasive in the way it was trying to be. "Three steps. One concrete result." with numbered cards underneath is a coherent promise. Before, the three unlabeled cards looked parallel rather than sequential.

### Remaining Issues

**The Learn → Act path still breaks after the homepage**
The homepage now does a good job explaining the three-step journey, but once you click into Issues the path isn't enforced by the UI. An Issues page has no "next: read" prompt. An article has no "next: act" prompt. The action detail page has the CTA above the fold — but the path from an issue card to an article to that action page isn't guided. The homepage promise and the interior product are still somewhat disconnected.

**Events page header density**
At a typical laptop viewport, the page header, location note, open filter, and topic pill bar may push all actual events below the fold on first load. The filter should probably collapse after use, not stay open. Or the page intro should be shorter to reclaim vertical space.

**No change to articles list or article detail**
The articles surface was not in scope for this pass, but it's the middle step of the journey and the least visually distinct page. An article list card looks identical to an action list card. Worth addressing in the next pass.

---

## Engineering — 8.5/10

No regressions. The rename is clean and long overdue. The event type color system is implemented correctly via CSS custom properties — matches the existing `data-topic` pattern.

### What Changed

**`navbar.tsx` → `nav-link.tsx`**
The file now matches its export (`NavLink`). All three import sites updated. The test file was renamed and its import updated. Small change, eliminates a persistent naming confusion.

**Event type color system follows established pattern**
`data-event-type` + `--event-type-color` CSS variable follows exactly the same approach as `data-topic` + `--topic-accent`. Consistent, composable, no magic.

### Remaining Issues

**`/topics/[slug]` route is a dead-end**
The `/topics` root correctly redirects to `/issues`. But `/topics/[slug]` still exists as a route. A direct URL to `/topics/climate` will render the topic detail page without redirecting to `/issues/climate`. If that route is live, it should redirect. If it's dead, it should be deleted.

**Events filter `open` attribute is not user-resettable in the current UI**
The `<details open>` with no JS to remember collapsed state means the filter re-opens on every navigation even if the user closed it. Not a bug, but slightly annoying behavior on repeated visits.

---

## What Is Actually Good

All prior positives still hold, plus:

- **Journey cards with STEP labels** are the best new thing in this pass. The section now does what the headline says.
- **Event type color system** — the RALLY amber, TOWN_HALL blue, etc. color vocabulary is compositional and matches the brand. This could be extended to filters and other event surfaces.
- **Events filter open by default** — correct prioritization decision. The filter is the primary utility of that page for most visitors.
- **Location note always visible** — this was a real gap. Civic event platforms need to be honest about geo-filtering immediately.
- **Action detail page** — unchanged and still the strongest single screen.
- **Copy throughout** — still the strongest part of the product. About page, hero, action CTA text, contribute section — all above average.

---

## Priority Fix List

### Critical — visible to any reviewer

- [ ] FIX-01 — `/topics/[slug]` should redirect to `/issues/[slug]` or be removed (Engineering)
- [ ] FIX-02 — Events page: open filter pushes events below the fold; shorten page intro or collapse filter after first use (UX / Visual Design)

### High — engineering or product credibility

- [ ] FIX-03 — Article detail page needs a forward CTA toward actions (UX)
- [ ] FIX-04 — Issue page needs an explicit "next step" prompt — not just a list of content (UX)
- [ ] FIX-05 — Article and action list cards are visually identical; differentiate by surface or type (Visual Design)

### Medium — polish

- [ ] FIX-06 — Issue roll: consider giving each issue a card surface rather than a text link, to match the card treatment on the Issues page (Visual Design)
- [ ] FIX-07 — Verify mobile nav drawer closes on route change (navigate to a page, reopen menu — does it remember the open state?) (Engineering / UX)

---

## Vision Alignment Check

Before acting on any finding, verify it aligns with the project intent:

- Simplicity over completeness — do not add features or information that increase cognitive load
- Focus-to-action journey — every change should make the Learn → Decide → Act path clearer
- Portfolio credibility — changes should raise technical or product quality, not just visual polish

_This document is non-canonical. Do not cite it in architecture or governance docs._
