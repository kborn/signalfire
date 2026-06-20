# UI Spec — Issues & Entity Pages

**Status:** IMPLEMENTED — issue card copy deferred to Phase 14.9
**Last updated:** 2026-06-20
**Phase:** 14.4

---

## Goal

Four targeted changes to issues index cards, entity detail breadcrumbs, and shared palette
treatment. No structural layout changes. No new components.

---

## 1. Breadcrumb accent color threading

### What

On article, action, and event detail pages, when the content has a parent topic, the
breadcrumb (`← Topic Name`) should read in that topic's accent color family rather than the
generic muted text.

### Current state

`<nav className="detailBreadcrumb">` has no topic context. `.detailBreadcrumbLink` uses
`color: var(--color-text-muted)` at rest, `var(--color-brand-primary)` on hover.

### Change

**HTML (three pages — article, action, event detail):** Pass `data-topic` to the `<nav>`:

```tsx
// When a parent topic exists:
<nav className="detailBreadcrumb" aria-label="Back" data-topic={topics[0].slug}>
// When no parent topic exists: no data-topic attribute (unchanged)
<nav className="detailBreadcrumb" aria-label="Back">
```

**CSS:** The per-topic `--topic-accent` variable assignments currently live under
`.topicCollectionItem[data-topic='...']`. Promote them to bare `[data-topic='...']` selectors
so any element that carries the attribute gets the variable set:

```css
/* Move these from .topicCollectionItem[data-topic='...'] → [data-topic='...'] */
[data-topic='democracy'] {
  --topic-accent: #5b88c7;
}
[data-topic='consumer-activism'] {
  --topic-accent: #c9894a;
}
[data-topic='climate'] {
  --topic-accent: #4a9e7c;
}
[data-topic='civil-rights'] {
  --topic-accent: #c76b5b;
}
[data-topic='economic-justice'] {
  --topic-accent: #c4a23e;
}
[data-topic='education'] {
  --topic-accent: #7a84c7;
}
[data-topic='local-community'] {
  --topic-accent: #5da870;
}
```

Then add:

```css
.detailBreadcrumb[data-topic] .detailBreadcrumbLink {
  color: color-mix(in srgb, var(--topic-accent) 75%, var(--color-text-muted));
}
.detailBreadcrumb[data-topic] .detailBreadcrumbLink:hover {
  color: var(--topic-accent);
}
```

### Scope

- `apps/web/src/app/(public)/articles/[slug]/page.tsx`
- `apps/web/src/app/(public)/actions/[slug]/page.tsx`
- `apps/web/src/app/(public)/events/[id]/page.tsx`
- `apps/web/src/app/styles/collection.css` — move `--topic-accent` assignments to bare
  `[data-topic]` selectors; existing `.topicCollectionItem[data-topic]` rules remain for
  the color-mix blends and background tints but the color variable itself comes from the
  bare rule
- `apps/web/src/app/styles/detail.css` — add breadcrumb topic-tint rules

The issue detail page (`/issues/[slug]/page.tsx`) already sets `data-topic` on
`.issueStepHeader`, so its step headers continue to work without changes.

---

## 2. Issue index card copy

### What

Replace the clinical Wikipedia-style topic descriptions shown on `/issues` cards with
shorter, action-oriented language that invites visitors rather than classifying content.

### Current state

`TopicSummary` (collection variant) renders `topic.description` from the API. The current
descriptions are database-style taxonomy labels:

> "Issues related to democratic institutions, voting rights, election integrity, and civic
> participation in government."

### Change

Update topic descriptions in the seed file to be motivating and first-person-adjacent.
These descriptions also appear as the lead paragraph on issue detail pages — motivating
language works there too.

**Proposed copy:**

| Topic             | Proposed description                                                                                                                                                                    |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Democracy         | Your vote is one lever. Election boards, redistricting commissions, and poll access rules are others. Find out who's deciding the rules of participation — and how to push back.        |
| Consumer Activism | Corporations respond to market pressure. Boycotts, ethical purchasing decisions, and public accountability campaigns have moved companies before. Find the pressure point for this one. |
| Climate           | Local zoning, transit budgets, and building codes are where climate policy lands in real communities. Residents can influence these decisions closer to home than most realize.         |
| Civil Rights      | Equal treatment under law is not self-enforcing. Find out where civil rights are being contested right now — and what you can do to hold the line or push it forward.                   |
| Economic Justice  | Wages, housing costs, and who controls economic opportunity in your community aren't fixed. Find out who's working on these issues and how to add your weight.                          |
| Education         | School funding formulas, curriculum decisions, and student discipline policies are made by elected and appointed bodies with public meetings. Find out who's making them.               |
| Local Community   | Your neighborhood is organized whether you're in it or not. Block associations, mutual aid networks, and local coalitions move faster than national campaigns — find yours.             |

### Scope

- `apps/api/prisma/seed.ts` — `description` field for each of the 7 topics
- No API, schema, or component changes

---

## 3. Bold palette — three CSS changes only

These are the three palette changes from the phase scope. No other CSS changes are in scope.

### 3a. `metaLabel` color → amber

**Current:** `.publicShell .metaLabel { color: var(--color-brand-accent); }` — rust/brown
(`#98503b`)

**Change:** `color: var(--color-brand-primary)` — amber/gold (`#cfac5a`)

This aligns with the global spec ("Meta label: … amber color") and the CONTEXT note that
`--color-brand-primary` is the amber accent and `--color-brand-accent` is the secondary
rust/brown.

**File:** `apps/web/src/app/styles/detail.css` — line 194–196

---

### 3b. Collection item left borders: visible at rest, full on hover

**Current behavior:** Regular `.collectionItem` cards show `border-left-color:
var(--color-brand-primary)` at rest — full amber, no opacity reduction. Hover switches to
`var(--color-brand-accent)` (rust).

**Intended behavior (per global.md):** Left border accent visible at _reduced_ opacity at
rest; full opacity on hover. Rest → hover should feel like the card "waking up."

**Change:**

```css
/* At rest: amber at reduced opacity */
.publicShell .collectionItem {
  border-left-color: color-mix(in srgb, var(--color-brand-primary) 45%, transparent);
}

/* On hover: full amber */
.publicShell .collectionItem:hover {
  border-left-color: var(--color-brand-primary);
}
```

Topic cards (`topicCollectionItem[data-topic]`) already implement this correctly via the
`color-mix` in their existing rules — no change needed there.

**File:** `apps/web/src/app/styles/collection.css`

---

### 3c. Issue detail step numbers at display scale

**Current:** `.issueStepNum` — `font-size: 0.75rem`. The step number (`02`, `03`) renders
tiny, losing the intended chapter-marker impact.

**Change:** Render at display scale, matching the Playfair Display treatment already on
`.issueStepTitle`:

```css
.issueStepNum {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  line-height: 1;
  letter-spacing: -0.02em; /* tighten at large size */
}
```

The `font-family`, `font-weight`, and `color` declarations remain unchanged.

**File:** `apps/web/src/app/styles/detail.css`

---

## Done conditions

- [ ] Breadcrumb on article, action, and event detail pages takes on topic accent color
      when a parent topic is present; no change when no topic is linked
- [ ] `/issues` index cards show the updated motivating descriptions
- [ ] Issue detail page lead text shows the same updated descriptions (no regression)
- [ ] `.metaLabel` in public shell uses amber (`--color-brand-primary`) not rust/brown
- [ ] Collection item left borders are visibly dimmer at rest than on hover
- [ ] Step numbers `02` / `03` on issue detail render at large display scale
- [ ] `pnpm typecheck` passes clean
- [ ] No other CSS changes beyond the three named above
