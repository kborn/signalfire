# Phase 6.2 Topic Discovery Flow Syllabus

## Purpose

This syllabus orients Phase 6.2 so you can turn the placeholder topic pages
into real discovery pages backed by the existing Phase 5 public API contracts.

## Current Task Or Subtask

Phase 6.2 is the first data-backed content flow in Phase 6.

You are building:

- the topic listing page from `GET /topics`
- the topic detail page from `GET /topics/:slug`
- topic detail rendering for `name`, `description`, related article summaries,
  and related action summaries
- clickable links from related summaries to article and action detail pages

You are not building:

- article detail rendering
- action detail rendering
- Events UI
- search
- filtering
- pagination
- draft or unpublished-content UI

## Prerequisites

Read these first:

- `docs/agent-governance/progress.md`
- `docs/specs/information-architecture.md`
- `docs/architecture/008-phase-5-topic-content-api-contracts.md`
- `apps/web/src/app/topics/page.tsx`
- `apps/web/src/app/topics/[slug]/page.tsx`

Know these basics before coding:

- `page.tsx` can be an async server component
- `fetch()` can run directly in a server page in Next App Router
- collection routes and detail routes usually return different payload shapes
- `Link` is how you connect related summaries to other routes

## Modules In Practical Build Order

### Module 1: Learn the two topic API shapes before writing UI

**Objective**

Understand the difference between the topic collection response and the topic
detail response.

**Why it matters**

If you assume both routes return the same fields, you will either overbuild the
list page or underbuild the detail page.

**Key concepts**

- collection response vs detail response
- summary payload
- embedded related content
- published-only guarantees

**Repo-specific context**

`GET /topics` returns `items` with topic summaries only.

`GET /topics/:slug` returns one topic plus embedded `articles` and `actions`
summary arrays.

**Small concrete example**

`/topics` should render a list of topic cards or links from `response.items`.

`/topics/climate` should render one topic page with sections for related
articles and related actions.

**Common mistakes**

- expecting `/topics` to include related content counts
- expecting `/topics/:slug` to include full article bodies or full action
  descriptions
- adding extra backend requirements even though the contract already exists

**Short exercise**

Write down the exact fields available on the list page versus the detail page.

### Module 2: Use the route file as the first server-fetching boundary

**Objective**

Understand why the first correct Phase 6.2 version can fetch data directly in
the route page.

**Why it matters**

You need a simple path from API contract to rendered page before deciding
whether extraction into helpers or UI components is worth it.

**Key concepts**

- async server page
- route-level data fetching
- awaited params on slug pages
- fetch and render on the server

**Repo-specific context**

`apps/web/src/app/topics/page.tsx` and
`apps/web/src/app/topics/[slug]/page.tsx` are currently placeholders. They are
the natural place to perform the first fetches for Phase 6.2.

**Small concrete example**

The list page fetches `/topics`, then maps `items`.

The slug page awaits `params.slug`, fetches `/topics/${slug}`, then renders the
topic and its related summaries.

**Common mistakes**

- reaching for client components before a plain server page works
- mixing route params, fetch logic, and rendering in a confusing order
- creating a large abstraction layer before the first working version exists

**Short exercise**

Sketch the top-level order inside each page:

1. get route input
2. fetch data
3. handle empty or error state
4. render sections

### Module 3: Turn summary arrays into discovery UI, not dead text

**Objective**

Render related article and action summaries as obvious next-click options.

**Why it matters**

Phase 6 is about Learn -> Decide -> Act navigation. Topic detail is the first
place where that relationship-driven navigation becomes real.

**Key concepts**

- summary list rendering
- internal linking
- section purpose
- empty states

**Repo-specific context**

The topic detail contract already embeds article and action summary arrays, so
Phase 6.2 should render those arrays directly instead of inventing new fetches
for each nested item.

**Small concrete example**

Each related article summary should at minimum show:

- title
- summary
- link to `/articles/[slug]`

Each related action summary should at minimum show:

- title
- summary
- action type if helpful
- link to `/actions/[slug]`

**Common mistakes**

- rendering related items as plain paragraphs with no links
- hiding the relationship sections too deeply in the page
- fetching each related article or action individually even though summary data
  already exists

**Short exercise**

Write one sentence for each section:

- "What should the user learn from related articles here?"
- "What should the user do next from related actions here?"

### Module 4: Separate "works now" structure from later refinement

**Objective**

Know what the first correct Phase 6.2 version needs, and what can wait.

**Why it matters**

This prevents the task from turning into Phase 6.3, 6.4, 6.5, or Phase 9 work.

**Key concepts**

- task boundary
- relationship depth
- baseline UI
- incremental completion

**Repo-specific context**

Phase 6.2 only owns topic listing, topic detail, and links from topic detail
to article and action detail routes.

The article and action pages may still remain placeholders after Phase 6.2.

**Small concrete example**

Done enough:

- `/topics` renders from the API
- `/topics/[slug]` renders from the API
- related items are clickable

Not required yet:

- article page content rendering
- action page content rendering
- filters, sort controls, or pagination
- polished card systems

**Common mistakes**

- trying to solve all Phase 6 cross-linking at once
- introducing search because the list page "feels empty"
- blocking on final visual design instead of clear structure

**Short exercise**

Write a two-column note:

- "Must finish in 6.2"
- "Can wait for later phases"

### Module 5: Choose the smallest durable extraction points

**Objective**

Decide when a helper or presentational component is worth creating.

**Why it matters**

Phase 6.2 is easier if the first pass stays simple, but repeated fetch URL or
section markup is also a signal for small extractions.

**Key concepts**

- duplication vs premature abstraction
- fetch helper
- summary section component
- durable extraction

**Repo-specific context**

There is no obvious web-side API helper layer in `apps/web/src` yet. A small
`lib` helper or tiny presentational component may become reasonable during
Phase 6.2, but only after the first working page shape is clear.

**Small concrete example**

Reasonable extractions:

- `fetchTopics()`
- `fetchTopicBySlug(slug)`
- `RelatedContentSection`

Premature extractions:

- a generic CMS renderer
- a global data framework
- a cross-domain card system for every future Phase 6 page

**Common mistakes**

- duplicating raw fetch URL construction across many files
- inventing a large API client before two pages even work
- making every list item its own component before the shape stabilizes

**Short exercise**

After a first draft, circle any code duplicated twice and ask whether that
duplication is stable enough to extract.

## Recommended First Implementation Step

Start by writing down the exact response shapes for `GET /topics` and
`GET /topics/:slug`, then update `apps/web/src/app/topics/page.tsx` to fetch
and render the collection route before touching the slug page.

## Reading Checklist

- `docs/agent-governance/progress.md` Phase 6 and Phase 6.2
- `docs/specs/information-architecture.md`
- `docs/architecture/008-phase-5-topic-content-api-contracts.md`
- `apps/web/src/app/topics/page.tsx`
- `apps/web/src/app/topics/[slug]/page.tsx`

## Later Topics That Can Wait

- article detail rendering in Phase 6.3
- action detail rendering in Phase 6.4
- broader cross-link consistency in Phase 6.5
- UI behavior constraints hardening in Phase 6.6
- broader visual polish in Phase 9
