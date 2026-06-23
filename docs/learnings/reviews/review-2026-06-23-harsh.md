# Site Review — Find Your Fight

**Review date:** 2026-06-23
**Reviewed by:** Agent (independent critique — fresh eyes on screenshots + codebase)
**Prior reviews:** review-2026-06-23-final.md, review-2026-06-23-session-end.md

---

## Score Tracker

| Dimension     | This Review  |
| ------------- | ------------ |
| Visual Design | 7.5 / 10     |
| UX / Product  | 7 / 10       |
| Engineering   | 8.5 / 10     |
| **Overall**   | **7.5 / 10** |

_Prior agent reviews have been climbing from 7 → 8. My read is that 8/10 is aspirational;
7.5/10 is what a neutral reviewer would say today looking at the five screenshots cold._

---

## Visual Design — 7.5/10

The palette, typography, and motif are doing real work. The site has a clear visual identity
and it's appropriate for the subject matter. That said, the quality is uneven across screens —
the hero and action detail are genuinely strong; the events and articles surfaces read as
unfinished by comparison.

### What's working

**The hero is the best thing on the site.** Dark navy, Playfair Display at large scale, fist
motif bleeding into the composition — this is a designed moment. It reads as serious,
civic-minded, and distinctly not generic. The amber "Browse Issues →" CTA sits correctly
against the dark field and commands attention without competing with the headline.

**Issues grid is confident.** Six topic cards with color-accented icons and consistent
two-line copy. The topic accent system (Democracy blue, Climate green, Civil Rights orange)
is smart and extensible. The page communicates "here are your options, pick one" cleanly.

**Action detail is the best interior screen.** The layout hierarchy — breadcrumb, topic badge,
large Playfair title, two-line dek, then "YOUR NEXT STEP" with the amber CTA button — is the
one screen where the journey promise is fully redeemed. Nothing competes with the action.

### What's not working

**The "Three steps" journey cards don't read as a journey.**
At screenshot width, the three cards look like a feature grid, not a numbered progression.
The step labels ("STEP 01" etc.) are present but small — the visual weight of the card bodies
and the titles is much higher. A reviewer spending 5 seconds on the page won't catch that
these are sequential. The cards feel safe rather than urgent.

**Events cards are visually identical.**
The events list (screenshot 03) shows two cards that look exactly the same — same dark field,
same text hierarchy, no event type color differentiation. The RALLY and WORKSHOP labels are
text chips that register weakly. The topic filter pills above are more visually interesting
than the content below them. Events feel like the afterthought of the product even though
they're a first-class nav item.

**The issue roll on the homepage contradicts the card language.**
The bottom of the homepage pivots from cards (journey section) to a vertical list of large
text links. This is a deliberate locked treatment, but it doesn't integrate with the visual
language of the rest of the page. A first-time visitor scanning the homepage will land on the
issue roll and think: "these are just links." The colored left-borders help but don't fix it.
The cards on the Issues page are better than the homepage roll — the homepage teaser for
that content is weaker than the content itself.

**The demo banner eats the hero.**
The full-width amber warning banner directly above the hero section reduces the emotional
impact of the largest heading on the site. It is a functional requirement, but it sits at
the worst possible position — it visually anchors the top of the page to "this is a test
environment" before the product has said anything. A subtler treatment (a fixed footer bar,
a dismissible chip at the top of the nav) would preserve the hero landing.

**The motif in the upper-right of collection pages is subtle to the point of invisible.**
At the screenshots' rendering size, the right-anchored motif behind the issues grid fades
into the dark background. This is arguably correct (texture, not art), but at the desktop
viewport it may be so muted that it contributes nothing. The homepage version — full-bleed,
high-opacity behind the hero — is dramatically more effective.

---

## UX / Product — 7/10

The concept is clear and the copy communicates it well. The core gap is that the homepage
makes a three-step promise that the interior pages don't enforce. Once you're past the
homepage, the journey is implicit — the product trusts the user to discover it rather than
guiding them through it.

### What's working

**The copy throughout is the strongest content asset.**
"The news doesn't stop. The problems feel enormous. And most days, it's easier to do
nothing than to figure out where to begin." This is not generic marketing copy. It names
a real feeling and positions the product against it. The About page copy ("the feeling that
nothing you do matters — that is not an objective fact") is equally strong. This matters
because the copy sells the mission; no visual change can replace it.

**Action detail closes the loop correctly.**
The action page (screenshot 04) shows the product working: you've chosen an issue, read
something, found an action, and now there's a clear "Take Action on mobilize.us →" prompt
above the fold. This is what civic action software is supposed to do. The page earns its
existence.

**The issues grid as entry point is the right choice.**
Picking a topic from a color-coded grid of six issues is a better entry point than a search
box or a feed. It's opinionated — you have to commit to a topic before seeing content —
and that's the correct design decision for this product's philosophy.

**Admin workspace is genuinely solid.**
The submission review page (screenshot 05) has appropriate information density: type and
status badges, structured metadata, full submitted content below. A moderator reviewing this
page has everything they need without having to navigate elsewhere. This surface is production-quality.

### What's not working

**The three-step journey exists only on the homepage.**
"Choose one issue → Read what matters → Do one concrete thing" is a compelling promise. But
once you click "Browse Issues →", that framing disappears. The issues page doesn't say "Step 1."
An article page doesn't say "Step 2." The action detail doesn't say "Step 3." The journey
card sequence is a homepage ornament, not a navigational system. A first-time visitor who
arrived on the Issues page directly would have no idea this is supposed to be a three-step process.

**Events are nearly useless without location context.**
"City Hall Transit Accountability Rally" and "Neighborhood Heat Safety Canvas Training" are
both in Philadelphia, PA. Without filtering, a user in Seattle sees identical event cards with
no indication these events aren't for them. The location note ("Results are not filtered by
your location") is present but it's explanatory text, not a solution. The filter for location
exists but requires interaction to find. For a civic action platform, location-unaware event
browsing is the wrong default. Most users won't filter; they'll just see events that aren't
for them and leave.

**Articles are the missing middle.**
The Learn → Act path requires articles. But there are no article screenshots, and from the
review history the article surfaces are described as the least visually distinct pages in the
product. If articles are the bridge between "pick an issue" and "take an action," they need
to pull that weight with a strong forward CTA. The review history says "Now act" was added,
but the articles list and article cards are still described as visually identical to action
cards.

**The submission prompt is invisible from content pages.**
"Submit" is a nav item styled as a button. That's a fine entry point. But there's no
contextual submission prompt on topic pages, article pages, or action pages. A user who knows
of a relevant local event has no in-context nudge to submit it. The submission system is
implemented and the admin workflow handles it well — but the public-facing on-ramp is only
the nav button, which is a global affordance rather than a contextual one.

---

## Engineering — 8.5/10

The codebase is clean, idiomatic, and well-structured for a content site of this scope.
The technology choices (Next.js App Router, ISR, NestJS, Prisma, monorepo) are appropriate
and correctly applied. The test infrastructure (unit, integration with ephemeral Postgres,
controller tests) shows genuine engineering investment. No red flags from code review.

### What's solid

**Monorepo structure is the right call.** Turborepo with separate apps/web and apps/api is a
credible architecture for a full-stack portfolio project. The boundary between Next.js and
NestJS is clean. The `packages/` directory is available for future shared types without
requiring a redesign.

**ISR is the right caching strategy.** Server-side rendering with revalidation intervals is
the correct choice for a content site where content changes infrequently. This avoids both
the stale-data problem of pure SSG and the server-load problem of pure SSR.

**Admin authentication is implemented.** Cookie-backed AdminUser sessions with API guards and
web middleware — this is not a TODO. The admin interface requires real auth for deployed
environments. This is a meaningful engineering decision for a pre-deployment project.

**Test coverage depth is real.** Persistence integration tests with ephemeral Postgres,
controller tests with typed mock fixtures, frontend Vitest tests — this is not just a CI
checkbox. The test infrastructure is architecturally sound.

### What's still rough

**Dead routes from the `/topics` → `/issues` rename.**
`/topics` correctly redirects, but `/topics/[slug]` is still a live route that renders topic
detail without redirecting to `/issues/[slug]`. A search engine or a shared URL would land
on `/topics/climate` and see the page without redirecting. This is a loose end.

**Dead CSS from removed sidebar layout.**
`detailContent--event`, `topicEventCTA {}` (empty block), and `eventDetailHero` are CSS
selectors that exist in stylesheets but are never applied. These are noise after Phase 14's
cleanup, not a real defect — but a codebase in "portfolio credibility" mode should be clean.

**`events` filter usability is a product decision expressed as a technical limitation.**
The collapsible filter (`<details>`) is stateless — it re-opens or re-closes on every
navigation regardless of user action. This is technically correct behavior for a server-rendered
page but creates a confusing UX. Either commit to always-open (which is the right call for
a filter-led page) or add a lightweight local state to persist the collapsed state.

---

## What Is Actually Good

- **Hero copy.** Genuinely among the best product copy I've seen on a portfolio project.
  This is not lorem ipsum that was never revised. It's persuasive.
- **Palette and typography.** Dark navy + amber + Playfair Display is coherent and distinctive.
  It reads as civic-serious without being depressing.
- **Action detail page.** The strongest single screen in the product. CTA above the fold,
  clear external link, topic context below. This is what the product is for.
- **Admin submission review.** Good information density. Type and status badges are appropriate.
  Moderator has everything needed on one page.
- **Issues grid with color system.** Compositional topic accent colors are smart and extensible.
- **About page.** Honest, direct, persuasive. Doesn't oversell. Worth reading.
- **Test infrastructure.** Ephemeral Postgres integration tests, typed fixtures, CI gates —
  this is credible engineering, not just passing CI.
- **Phase discipline.** 16 phases with detailed task tracking, locked decisions, and
  explicit handoff notes — the project governance is itself a portfolio artifact.

---

## Honest Assessment of Prior Review Scores

The agent review chain has been grading generously relative to what the screenshots show.
The June 23 chain reached 8/10 overall, citing improvements made in that session. Some of
those improvements are real — the step labels, copy fixes, and dead-code cleanup are genuine
progress. But comparing the screenshots to a 8/10 claim:

- **Homepage** reads as a polished 7.5 with a demo banner problem. The hero is 9/10; the
  issue roll below it is 6/10.
- **Issues page** is a legitimate 8.5 — the card grid with topic colors is strong.
- **Events page** is a 6/10 visually. The filter pills are good; the cards below are bare.
- **Action detail** is a 9/10. Best screen.
- **Admin workspace** is a 8.5/10. Clean and functional.

Averaging those screens honestly puts Visual Design at 7.5, not 8. The UX score of 8
requires assuming the Learn → Act journey is working end-to-end, which can't be verified
from the screenshots and which the review history itself flags as incomplete.

---

## Priority Fix List

### Critical — a portfolio reviewer will notice

- [ ] FIX-01 — Demo banner: move to a fixed footer strip or inline nav chip; don't anchor the top of the hero (Visual Design)
- [ ] FIX-02 — Events cards need visual differentiation — event type color treatment or date chip (Visual Design)
- [ ] FIX-03 — `/topics/[slug]` should redirect to `/issues/[slug]` or be deleted (Engineering)

### High — product credibility

- [ ] FIX-04 — Events: make location filter visible without an extra click; filter-led page should default open (UX)
- [ ] FIX-05 — Article list cards and action list cards are visually identical; add a content type indicator (Visual Design / UX)
- [ ] FIX-06 — Journey vocabulary: carry the "Choose → Read → Act" framing into the interior pages (UX)

### Medium — polish

- [ ] FIX-07 — Delete dead CSS: `detailContent--event`, `topicEventCTA {}` block, `eventDetailHero` (Engineering)
- [ ] FIX-08 — Retake screenshots with current state; homepage screenshot is stale (Reference)
- [ ] FIX-09 — Homepage issue roll: the locked treatment is a known compromise; document that it's intentional (Reference)

---

## Progress Since First Review (2026-06-22)

| Dimension     | 2026-06-22 | 2026-06-23 (this) | Delta    |
| ------------- | ---------- | ----------------- | -------- |
| Visual Design | 7          | 7.5               | +0.5     |
| UX / Product  | 6          | 7                 | +1.0     |
| Engineering   | 8          | 8.5               | +0.5     |
| **Overall**   | **7**      | **7.5**           | **+0.5** |

The UX delta is the most meaningful improvement. The events filter, step labels on journey
cards, and the article → action forward signal were real gaps that closed. Engineering cleanup
is real but incomplete. Visual design moved incrementally. The site is meaningfully better than
it was six days ago.

---

## Vision Alignment Check

Before acting on any finding, verify it aligns with the project intent:

- Simplicity over completeness — do not add features or information that increase cognitive load
- Focus-to-action journey — every change should make the Learn → Decide → Act path clearer
- Portfolio credibility — changes should raise technical or product quality, not just visual polish

_This document is non-canonical. Do not cite it in architecture or governance docs._
