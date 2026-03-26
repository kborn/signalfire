# Phase 6.2 Topic Discovery Flow Walkthrough

## What You Are Building

You are turning the topic routes in `apps/web/src/app/topics/` from placeholders
into the first real content-discovery flow in the web app.

For Phase 6.2, the required outcomes are:

- `/topics` renders from `GET /topics`
- `/topics/[slug]` renders from `GET /topics/:slug`
- topic detail shows `name`, `description`, related article summaries, and
  related action summaries
- related article and action summaries link to their detail routes

This walkthrough is about repo edit order for the first correct implementation,
not full styling polish and not later article/action detail work.

## Files And Folders Involved

Existing files you should start from:

- `apps/web/src/app/topics/page.tsx`
- `apps/web/src/app/topics/[slug]/page.tsx`
- `apps/web/src/app/globals.css`

Files you may create during Phase 6.2 if repetition appears:

- `apps/web/src/lib/`
- `apps/web/src/lib/api/`
- `apps/web/src/lib/api/topics.ts`
- `apps/web/src/components/`
- `apps/web/src/components/related-content-section.tsx`

Canonical docs to keep open:

- `docs/agent-governance/progress.md`
- `docs/specs/information-architecture.md`
- `docs/architecture/008-phase-5-topic-content-api-contracts.md`

## Edit Order

### Step 1: Write down the exact payload shapes you are about to render

Before editing JSX, note:

- `/topics` returns `{ items: TopicSummary[] }`
- `/topics/:slug` returns one topic object with `articles` and `actions`

Why first:

This prevents the most common Phase 6.2 mistake: building the list and detail
pages as though they consume the same shape.

### Step 2: Replace the topic list placeholder with real collection rendering

Open:

- `apps/web/src/app/topics/page.tsx`

What to do:

- make the page async
- fetch `GET /topics`
- read `data.items`
- render each topic as a linked discovery entry
- show at least the topic `name` and `description`

Why second:

The collection page is the smaller fetch shape. It gives you a clean first win
before you handle nested related summaries.

### Step 3: Replace the topic detail placeholder with real detail rendering

Open:

- `apps/web/src/app/topics/[slug]/page.tsx`

What to do:

- keep reading `slug` from route params
- fetch `GET /topics/:slug`
- render the topic `name` and `description`
- replace placeholder article/action copy with mapped arrays from the response

Why third:

This is where Phase 6.2 becomes real. The route stops being a slug echo page
and starts consuming the actual discovery graph.

### Step 4: Make related summaries clickable immediately

Still in:

- `apps/web/src/app/topics/[slug]/page.tsx`

What to do:

- link each related article to `/articles/[slug]`
- link each related action to `/actions/[slug]`
- keep the rendering simple and readable

Why fourth:

Phase 6.2 is not complete if topic detail only displays related content as dead
text. The links are part of the discovery flow.

### Step 5: Add empty-state handling only where the contract might return none

Check:

- `topic.articles`
- `topic.actions`

What to do:

- if a related array is empty, render a short message instead of an empty block
- keep the empty-state language factual and small

Why fifth:

This avoids awkward blank sections without expanding scope into broader state
systems.

### Step 6: Decide whether one tiny extraction is worth it

Look for repetition in:

- raw topic fetch calls
- related summary section markup

What to do:

- if only one page uses the logic, inline is fine
- if the same fetch or section pattern appears twice cleanly, extract one small
  helper or presentational component

Why sixth:

This keeps the implementation pragmatic. Phase 6.2 needs a clean first pass,
not an architecture project.

### Step 7: Verify the topic flow route by route

Check:

- `/topics`
- one known topic slug such as `/topics/climate`
- links from topic detail to one article route and one action route

What to verify:

- list page renders real topic data
- detail page renders real topic data
- related sections render the nested summaries
- links point to the correct article/action detail routes

Why seventh:

This proves Phase 6.2 works as a real browsing path instead of just isolated
rendering.

## First Correct Structure

The first correct Phase 6.2 shape in this repo will likely still center on the
existing route files:

```text
apps/web/src/
  app/
    topics/
      page.tsx
      [slug]/
        page.tsx
```

It may also add one small helper layer if needed:

```text
apps/web/src/
  lib/
    api/
      topics.ts
```

Keep the first structure small. You do not need a full API client tree or a
large component hierarchy before the topic flow works.

## What "Done Enough" Looks Like For Phase 6.2

You are in a good state when:

- `/topics` renders from the real API contract
- `/topics/[slug]` renders from the real API contract
- topic detail shows related article and action summaries
- related summaries link to the correct detail routes
- no Event UI, search, filtering, or pagination work has been added

## Ask-When-Stuck Prompts

- Am I rendering the actual Phase 5 payload shape, or the shape I wish existed?
- Should this logic stay in the route page for now, or is there already enough
  repetition to justify a helper?
- Do I need another request here, or does the topic detail payload already
  contain the summaries I need?
- Is this section helping the user move from topic discovery to the next click?
- Am I accidentally doing Phase 6.3 or 6.4 work while trying to finish 6.2?
