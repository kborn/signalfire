# Phase 9 — UI Polish Specification

## Purpose

This document defines the required Phase 9 visual and copy refinements for the current public CivicSignal UI. It is intentionally implementation-oriented so the Staff Engineer can apply the styling directly without reopening product decisions.

This phase is polish, not scope expansion.

---

## How To Use This Spec

Use this document as the direct implementation guide for Phase 9.

Execution rule:

- implement only the sections marked for the active subphase
- do not pull later-subphase instructions forward unless explicitly approved
- when a section includes exact copy, that copy is locked only in the subphase that owns it

Subphase ownership:

- `9.1`: global shell, nav, typography baseline, shared spacing, CSS cleanup baseline
- `9.2`: collection-page structure and preview-item treatment
- `9.3`: detail-page structure, metadata presentation, related-content treatment
- `9.4`: CTA wording, intro copy, section-label wording, Topic-to-Events support copy
- `9.5`: responsive cleanup and final cross-route consistency pass

If a rule in this spec conflicts with the active subphase boundary in
`progress.md`, the subphase boundary in `progress.md` wins.

---

## Scope

### In Scope

- shared layout, spacing, and typography rules
- nav polish
- page intro and section hierarchy polish
- collection-list presentation polish
- detail-page structure polish
- related-content presentation polish
- CTA consistency
- responsive refinement
- static text updates

### Out Of Scope

- new routes
- new backend requirements
- search
- filtering UI
- pagination
- map/location UX
- auth
- admin tooling
- design-system expansion

---

## Product Tone

The site should feel:

- calm
- editorial
- serious
- readable
- intentional
- text-first

It should not feel:

- playful
- crowded
- card-heavy
- dashboard-like
- over-branded
- overly animated

---

## Global UI Decisions

Subphase owner: `9.1`

### 1. Overall page width

Keep a centered content column.

Use:

- `max-width: 960px`
- `padding-inline: 24px`

This stays as the baseline container width.

Do not increase max width in Phase 9.

---

### 2. Header and nav

The nav is already structurally correct. Keep the same route set:

- Home
- Topics
- Articles
- Actions
- Events

Required updates:

- tighten the top margin so the page begins faster
- increase perceived intentionality through clearer spacing and hover/focus treatment
- add an active-link state for the current route

#### CSS requirements

```css
.site-header {
  padding: 20px 0 12px;
}

.site-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  font-size: 1rem;
  line-height: 1.2;
}

.site-nav a {
  color: #171717;
  text-decoration: none;
}

.site-nav a:hover {
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.site-nav a[aria-current='page'] {
  font-weight: 700;
}
```

Notes:

- active state should be typographic, not decorative
- do not add pills, boxes, or tabs in nav

---

### 3. Main content spacing

Current screens feel a little too raw and close together vertically.

Required baseline:

```css
.site-main {
  padding: 24px 0 80px;
}

.page-section {
  display: grid;
  gap: 20px;
}
```

#### Section spacing rules (explicit)

Top-level page sections:

```css
.page-section + .page-section {
  margin-top: 48px;
}
```

Rules:

- Applies only between sibling `.page-section` elements inside `.site-main`
- Does not apply to the first `.page-section`
- Do not apply margin directly to `.page-section`

Related-content sections:

```css
.relatedSection {
  margin-top: 40px;
}
```

Collection items:

```css
.collectionItem {
  padding-block: 0;
  display: grid;
  gap: 6px;
}
```

Rules:

- Vertical spacing between items is controlled ONLY by `.collectionList { gap: ... }`
- Internal spacing is controlled ONLY by `gap` inside `.collectionItem`
- Do not add margin-top or padding-top/bottom to `.collectionItem`

Do not add section borders broadly across inner pages.

---

### 4. Typography system

Keep Arial/Helvetica.
Do not introduce a new font in Phase 9.

#### Required heading scale

```css
h1 {
  font-size: clamp(2.75rem, 6vw, 4rem);
  line-height: 1.02;
  letter-spacing: -0.045em;
}

h2 {
  font-size: clamp(2rem, 4vw, 2.75rem);
  line-height: 1.08;
  letter-spacing: -0.035em;
}

h3 {
  font-size: 1.5rem;
  line-height: 1.15;
  letter-spacing: -0.02em;
}
```

#### Body copy baseline

```css
body {
  font-family: Arial, Helvetica, sans-serif;
  color: #171717;
  background: #ffffff;
  line-height: 1.45;
}

p {
  max-width: 70ch;
}

.page-intro {
  font-size: 1.125rem;
  line-height: 1.55;
  max-width: 42rem;
}

.metaText {
  font-size: 1rem;
  line-height: 1.45;
  color: #444444;
}
```

---

### 5. Link behavior

Text links inside content sections should look clickable.

```css
a:hover {
  text-decoration: underline;
  text-underline-offset: 0.18em;
}

a:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 3px;
}
```

Do not globally remove all text decoration on hover for in-flow content links.

---

## CTA System

Subphase owner:

- visual sizing and shared CTA treatment: `9.1`
- final CTA wording and support copy: `9.4`

The current rounded CTA system is directionally correct. Keep it.

### Primary CTA

Keep dark pill button treatment.

### Secondary CTA

Keep outlined pill treatment.

### Required refinements

- make button sizing consistent
- prevent oversized CTA group gaps
- use the same CTA classes across Home and Topic detail

#### CSS requirements

```css
.primaryCTA,
.secondaryCTA {
  min-height: 52px;
  padding: 0.95rem 1.5rem;
  border-radius: 999px;
  font-size: 1rem;
  font-weight: 600;
}

.home-cta-group {
  gap: 18px;
}

.home-secondary-ctas {
  display: flex;
  gap: 16px;
}

/* spacing ownership: parent controls spacing between CTAs */
.home-cta-group > * {
  margin: 0;
}
```

---

## Static Copy Updates

Subphase owner: `9.4`

These copy directives are intentionally deferred until `9.4`.

Before `9.4`:

- pages may keep current copy while layout, spacing, and hierarchy work proceeds
- do not treat copy differences as blockers for `9.1`, `9.2`, or `9.3`

During `9.4`:

- apply the exact copy below unless a route requires dynamic values
- treat section-label wording below as locked product language

### Home

#### Hero headline

Keep:

`Learn what matters. Take meaningful action.`

#### Hero body

Replace current body with:

`Explore civic issues, understand how they affect real people, and find clear actions you can take.`

#### Primary CTA

Keep:

`Explore Topics`

#### Secondary CTAs

Keep:

- `Browse Articles`
- `Browse Actions`

#### How it works label

Keep uppercase section label but change body copy to:

- Heading: `Learn → Act`
- Body: `Explore a topic, understand the issue, and find meaningful actions you can take.`

Notes:

- remove the awkward repeated “meaningful action / meaningful actions” nearby if needed by tightening either hero body or how-it-works body, but preserve the Learn → Act framing
- do not add Events CTA to the Home hero in Phase 9

---

### Topics index

#### Intro copy

Replace with:

`Browse issue areas and discover related articles, actions, and events.`

---

### Topic detail

Keep the existing structure:

- title
- description
- articles preview
- actions preview
- Browse Events CTA

#### Browse Events CTA label

Use exactly:

`Browse Events`

Do not change to:

- Find Events
- Explore Events
- View Events

#### Add a short Events support line above the CTA

Use:

`Looking for in-person ways to participate?`

This should sit directly above the CTA.

---

### Articles index

#### Intro copy

Replace with:

`Read reporting, explainers, and field guides about the issues that matter.`

---

### Actions index

#### Intro copy

Replace with:

`Find practical ways to take meaningful action.`

---

### Events index

#### Intro copy

Replace with:

`Browse upcoming events and find ways to participate in person.`

---

### Article detail section labels

Use:

- `Related Topics`
- `Take Action`

Do not use:

- `Topics`
- `Actions`

---

### Action detail section labels

Use:

- `Related Topics`
- `Learn More`

---

### Event detail section labels

Use:

- `Related Topics`
- `Learn More`
- `Take Action`

---

## Collection Page Specification

Subphase owner: `9.2`

This applies to:

- Topics index
- Articles index
- Actions index
- Events index

### Shared structure

1. page title
2. page intro
3. collection list

### Collection list layout

Use a text-first stacked list. Do not introduce cards.

#### Required spacing

```css
.collectionList {
  display: grid;
  gap: 28px;
  margin-top: 28px;
}

.collectionItem {
  display: grid;
  gap: 6px;
}

.collectionItemTitle {
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  line-height: 1.08;
  letter-spacing: -0.03em;
}

.collectionItemSummary {
  padding-left: 1.25rem;
  font-size: 1rem;
  line-height: 1.45;
  color: #2d2d2d;
  max-width: 72ch;
}
```

#### Behavior

- titles should be clearly clickable
- summaries should remain slightly indented from titles
- spacing between items should be generous enough to scan quickly
- do not add separators between every item

### Topics index special rule

Topic descriptions can remain one line longer than other summaries, but still cap at readable line length.

### Events index special rule

Each event preview should display in this order:

1. title
2. event type
3. summary
4. date/time
5. location

Event type should be visually de-emphasized relative to title.

#### CSS

```css
.eventMeta {
  font-size: 0.95rem;
  line-height: 1.35;
  color: #444444;
}
```

---

## Detail Page Specification

Subphase owner: `9.3`

This applies to:

- Topic detail
- Article detail
- Action detail
- Event detail

### Shared structure

1. page header
2. supporting metadata or summary
3. primary body / domain-specific content
4. related-content sections

### Shared spacing

```css
.detailPage {
  display: grid;
  gap: 24px;
}

.detailHeader {
  display: grid;
  gap: 8px;
}

.relatedSection {
  display: grid;
  gap: 16px;
  margin-top: 40px;
}
```

---

## Topic Detail Specification

Subphase owner:

- layout and spacing treatment: `9.3`
- Event CTA support copy: `9.4`

### Keep current structure

- topic title
- topic description
- Articles preview section
- Actions preview section
- event CTA

### Required refinements

- add more vertical space between Articles and Actions sections
- make section headings visually consistent with other detail pages
- prevent the Browse Events CTA from feeling detached at the bottom

#### Required layout treatment

```css
.topicDetailSections {
  display: grid;
  gap: 40px;
}

.topicEventCTA {
  display: grid;
  gap: 12px;
  margin-top: 8px;
}
```

---

## Article Detail Specification

Subphase owner: `9.3`

Current article detail needs the most polish.

### Required changes

1. separate metadata from body
2. visually de-emphasize author/date metadata
3. improve body copy readability
4. make section transitions cleaner

### Header structure

Display in this order:

1. title
2. summary
3. author
4. published date
5. updated date only if materially different and worth showing

#### Metadata formatting

```css
.detailMetaGroup {
  display: grid;
  gap: 4px;
  color: #555555;
  font-size: 1rem;
  line-height: 1.4;
}
```

### Article body

Use readable paragraph spacing.

```css
.articleBody {
  display: grid;
  gap: 18px;
  max-width: 72ch;
}

.articleBody h2,
.articleBody h3 {
  margin-top: 16px;
}
```

Do not leave raw timestamps unformatted.

Use human-readable date strings.

Example:

- `Published March 20, 2026`
- `Updated March 26, 2026`

---

## Action Detail Specification

Subphase owner: `9.3`

Current action detail is close, but it needs hierarchy polish.

### Required changes

- keep strong title + summary
- ensure body description has comfortable readable width
- label related-content sections clearly
- match section spacing to article and event detail pages

### Body width

```css
.actionBody {
  max-width: 72ch;
}
```

---

## Event Detail Specification

Subphase owner: `9.3`

Current event detail is structurally correct but visually flat.

### Required changes

- separate title/summary from event metadata
- present time and place as a compact info block
- keep description below metadata
- make related sections consistent with article/action detail

### Event info block

Display in this order:

1. event type
2. date/time
3. location name
4. address
5. city, region, postal code, country

#### CSS

```css
.eventInfoBlock {
  display: grid;
  gap: 2px;
  font-size: 1.05rem;
  line-height: 1.35;
}

.eventInfoBlock .eventType {
  font-weight: 600;
}

.eventInfoBlock .eventDateTime,
.eventInfoBlock .eventLocation {
  color: #2d2d2d;
}
```

Do not style the event type as a badge in Phase 9.

---

## Related Content Specification

Subphase owner:

- structure and spacing: `9.3`
- final section-label wording: `9.4`

Applies to article, action, and event detail pages.

### Rules

- related content remains a text-first list
- no nested cards
- no thumbnails
- no pills
- no recursion
- section headings must be consistent across page types

### Related list styling

Spacing ownership:

- `.relatedList` controls vertical spacing between items via `gap`
- `.relatedListItem` must not introduce margin-top or padding-block

```css
.relatedList {
  display: grid;
  gap: 18px;
}

.relatedListItem {
  display: grid;
  gap: 4px;
}

.relatedListItemTitle {
  font-size: 1.25rem;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.relatedListItemSummary {
  padding-left: 1rem;
  color: #2d2d2d;
  max-width: 68ch;
}
```

---

## Responsive Specification

Subphase owner: `9.5`

### Mobile goals

- preserve readability
- prevent overly long nav wrap ugliness
- reduce giant heading size
- reduce horizontal crowding
- keep CTAs tappable

### Required breakpoint

Use the existing small-screen breakpoint at `640px`.

### Required mobile rules

```css
@media (max-width: 640px) {
  .container {
    padding: 0 20px;
  }

  .site-header {
    padding: 16px 0 10px;
  }

  .site-nav {
    gap: 16px;
    font-size: 0.98rem;
  }

  .site-main {
    padding: 20px 0 64px;
  }

  h1 {
    font-size: 2.5rem;
    letter-spacing: -0.035em;
  }

  .collectionList {
    gap: 24px;
  }

  .collectionItemTitle {
    font-size: 1.9rem;
  }

  .collectionItemSummary,
  .relatedListItemSummary,
  .summary {
    padding-left: 0.85rem;
  }

  .home-secondary-ctas {
    display: grid;
    justify-items: start;
  }
}
```

### Tablet / medium-width note

No separate tablet breakpoint is required unless implementation exposes an obvious issue.

---

## CSS Cleanup Requirements

Subphase owner: `9.1`

The provided stylesheet contains duplicated Home and CTA rules.

### Required cleanup

- remove duplicate `.home-page`, `.home-hero`, `.home-cta-group`, `.home-secondary-ctas`, `.home-how-it-works`, `.primaryCTA`, `.secondaryCTA`, and repeated mobile blocks
- consolidate shared public-page styling into one canonical section
- do not leave duplicate declarations in place after Phase 9

This is part of the Phase 9 exit criteria.

---

## Non-Negotiable Constraints

- no redesign into cards
- no new font
- no color-system expansion
- no animation-heavy polish
- no location/search UI
- no embedded Event lists on Topic detail
- no backend-scope expansion

---

## Implementation Priority

1. shared layout + typography baseline
2. collection page consistency
3. detail page consistency
4. static copy updates
5. responsive cleanup
6. final consistency pass

---

## Subphase Implementation Checklist

Use these as the short execution instructions for each Phase 9 subphase.

### Phase 9.1

Implement only:

- container width, shared spacing, header/nav, global typography, link behavior
- CTA sizing consistency
- duplicate CSS cleanup
- any minimal shared layout/component changes needed for active nav state
- small, semantically named shared CSS classes needed for the baseline

Do not implement yet:

- final intro copy
- final CTA wording
- final section-label wording
- collection-preview restructuring
- detail-page restructuring beyond baseline shared classes

### Phase 9.2

Implement only:

- collection-page structure
- preview-item structure and spacing
- event preview ordering/presentation

Keep current copy unless the copy change is required only to support layout.

### Phase 9.3

Implement only:

- detail-page structure
- metadata grouping
- related-content spacing and list treatment
- article/action/event readability improvements

Use current label/copy wording unless the `9.4` copy section says otherwise later.

### Phase 9.4

Implement:

- exact intro copy
- exact CTA wording
- exact section-label wording
- Topic-to-Events support copy

No additional layout redesign should be introduced here beyond what is required
to place the finalized copy cleanly.

### Phase 9.5

Implement:

- responsive cleanup at the existing breakpoints
- final alignment, wrapping, spacing, and consistency fixes

This phase should finish the visual system, not redefine it.

---

## Acceptance Standard

Phase 9 is complete when:

- all public routes look intentionally related
- headings, spacing, intros, and section labels feel consistent
- detail pages no longer dump metadata awkwardly
- collection pages are easier to scan
- the UI still feels text-first and serious
- the implementation matches this spec without reopening product questions
