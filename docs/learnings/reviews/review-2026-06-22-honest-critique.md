# Site Review — Find Your Fight

**Review date:** 2026-06-22
**Reviewed by:** Agent (honest critique pass)
**Prior review:** none

---

## Score Tracker

| Dimension     | This Review |
| ------------- | ----------- |
| Visual Design | 7 / 10      |
| UX / Product  | 6 / 10      |
| Engineering   | 8 / 10      |
| **Overall**   | **7 / 10**  |

---

## Visual Design — 7/10

The hero and the color palette are genuinely strong, but the interior pages don't hold up to the same standard — the visual promise of the homepage doesn't carry through.

### Issues

**The issue roll (homepage bottom) underdelivers**
After a strong hero, the "Choose your fight" section is just a row of colored text links. The color accents are there but the items have no weight — they look like a nav list, not the feature moment of the page. The section label, heading, and links all compete for the same reading level.

**Events list is too bare**
The events page is a wall of white-on-dark text cards with no visual differentiation. No topic color stripe, no date chip, no icon. The topic filter pills above the list are good, but the list below them doesn't reflect any of that filtering visually — selected topic doesn't change how cards look.

**The "Three steps" journey cards have no visual anchor**
Three equal-weight cards with no icons, no numbering, and nearly identical copy length. They read like a bulleted list at card scale. The "Read what matters" card is visually identical to "Go deep on one issue" — a user skimming won't catch the progression.

**Demo banner is jarring on the hero**
It's a functional requirement but the full-width amber warning banner directly above the largest heading on the site reduces the emotional impact of the hero on every demo-mode page view. It sits at exactly the wrong vertical position.

**Action detail page is the strongest screen — but it's orphaned**
The action detail layout (clear title → CTA above the fold → "Take Action on mobilize.us →" in amber) is the cleanest, most action-oriented screen in the product. Nothing else reaches this quality. The rest of the content pages are too flat compared to this one.

---

## UX / Product — 6/10

The concept is clear and the copy is some of the best writing on the project. But the user journey breaks down between "browse" and "act" — there are too many content pages with no forward momentum built in.

### Issues

**The Learn → Act path is not enforced**
A user on the Issues page sees topic cards. Clicking one presumably goes to a topic detail page. From there, the path to an Action is not obvious from the screenshots. The action detail page is excellent but how a user arrives there under pressure is unclear. The three-step promise on the homepage doesn't map onto a navigable three-step flow.

**"Issues" and "Topics" are both routes**
`/issues` and `/topics` both appear in the route list. From the nav, only "Issues" is shown. This ambiguity suggests naming debt — if they're the same thing, pick one. If they're different, the nav should reflect it.

**Events page has no regional context without filtering**
The demo notice says results are not filtered by location. For a civic action platform, events without location context are nearly useless — users won't know if "City Hall Transit Accountability Rally" is in their city or across the country. There's no "add your location" affordance.

**The "Contribute" CTA at the bottom of the homepage is a lower-priority action placed prominently**
"Help someone find theirs" is a good line but asking users to contribute before they've used the product is premature. The call-to-action hierarchy suggests contribute is as important as act — it isn't.

**No Articles page screenshot — unclear if article detail pages have the same quality as action detail**
Action detail is strong. If Articles detail is just a block of markdown on a dark background with no sidebar or contextual CTA toward an action, that's a UX gap.

**Submit flow exists but is invisible from the interior pages**
The "Submit" button in the nav is an outlier — it's the only nav item styled as a button (amber background). That's fine on the homepage. But once inside a topic or action, there's no contextual submission prompt ("Know of another action related to Climate? Submit it."). The admin submission review page looks solid but the user-facing on-ramp is only in the nav.

---

## Engineering — 8/10

The code is clean and idiomatic. Next.js App Router is used correctly, ISR revalidation is set appropriately for a content site, and the monorepo structure is well-organized. Test files exist alongside components. No obvious red flags.

### Issues

**`/topics` route appears to be a dead or duplicate route**
`/apps/web/src/app/(public)/topics/page.tsx` exists alongside `/issues/page.tsx`. If topics and issues are the same concept (and the nav suggests they are), one of these should be removed or redirect to the other. This is maintenance debt.

**Homepage error handling is inconsistent with the Issues page**
`HomePage` uses `.catch(() => null)` and falls back to an empty array. `TopicListPage` lets `getTopicsList()` throw unguarded. One will render empty silently; the other will bubble to the error boundary. These should be consistent.

**`navbar.tsx` is a thin wrapper around a NavLink utility — not the actual nav**
The file named `navbar.tsx` only exports a `NavLink` component, not the navbar itself. The actual nav layout is presumably in the public layout or somewhere else. The filename is misleading.

**No mobile nav visible in screenshots**
The nav at small widths either collapses to a hamburger or breaks — this can't be evaluated from the screenshots, but the desktop nav at the screenshot width already looks tight ("Issues | Articles | Actions | Events | Q About | Submit"). Mobile nav quality is a gap in the review coverage.

---

## What Is Actually Good

- **The hero copy is excellent.** "The news doesn't stop. The problems feel enormous." is the strongest sentence on the site. It names the exact feeling and positions the product immediately.
- **Dark navy + amber palette is distinctive.** It reads as serious without being austere. Right for the subject matter.
- **The bg-motif texture** adds atmosphere to the hero and issue pages without ever feeling like noise.
- **Action detail page layout** is the strongest UX moment — CTA above the fold, external URL surfaced prominently, "Your next step" label, related issues below. This is the product working correctly.
- **Admin workspace is clean and usable.** The submission review page has good information density and appropriate context (type badge, status badge, full submitted content below metadata).
- **Topic cards with color accents** (Democracy blue, Climate green, etc.) are a smart system — consistent and scannable.
- **ISR + server components** are the right architectural choice for this content model.
- **The about page copy** is honest and persuasive — "the feeling that nothing you do matters — that is not an objective fact. That is the feeling winning." This is strong.

---

## Priority Fix List

### Critical — visible to any reviewer

- [ ] FIX-01 — Events list needs per-card topic color treatment (Visual Design)
- [ ] FIX-02 — Issue roll on homepage needs visual weight — not just colored text links (Visual Design)

### High — engineering or product credibility

- [ ] FIX-03 — `/topics` route: redirect to `/issues` or remove (Engineering)
- [ ] FIX-04 — Homepage error handling: align with TopicListPage pattern or vice versa (Engineering)
- [ ] FIX-05 — "Three steps" cards need numbering or icons to convey progression (Visual Design / UX)
- [ ] FIX-06 — Events page: surface location context prominently even without geolocation (UX)

### Medium — polish

- [ ] FIX-07 — Contribute CTA should be deprioritized below the action CTA on homepage (UX)
- [ ] FIX-08 — `navbar.tsx` filename should match what it exports (`nav-link.tsx`) (Engineering)
- [ ] FIX-09 — Verify mobile nav doesn't break at small widths (Visual Design)

---

## Vision Alignment Check

Before acting on any finding, verify it aligns with the project intent:

- Simplicity over completeness — do not add features or information that increase cognitive load
- Focus-to-action journey — every change should make the Learn → Decide → Act path clearer
- Portfolio credibility — changes should raise technical or product quality, not just visual polish

_This document is non-canonical. Do not cite it in architecture or governance docs._
