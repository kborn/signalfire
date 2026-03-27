# Phase 6.8 Discovery Summary Components Guide

This guide explains what "reusable summary components" means for the current
Phase 6 discovery UI work, and how to keep that work useful for Phase 9 without
accidentally building a full card system too early.

Relevant canonical context:

- `docs/agent-governance/progress.md` defines the active Phase 6 scope and the
  new Phase 6.8 summary-component task.
- `docs/architecture/008-phase-5-topic-content-api-contracts.md` defines the
  public route and relationship payload shapes the UI should consume.

## Concepts To Understand Now

- summary component vs detail page content
- content-type-specific summary components vs one generic card
- reuse across list pages, related-content sections, and optional homepage areas
- keeping the UI bound to the existing Phase 5 API contracts
- separating structural reuse from later visual polish

## Plain-Language Explanations

### What a summary component is

A summary component is a small reusable UI block that previews one piece of
content and links to its detail page.

In Phase 6, that means:

- a topic preview used on topic lists
- an article preview used on article lists or related article sections
- an action preview used on action lists or related action sections

The point is not to show everything. The point is to show enough information
for discovery and navigation.

### Summary vs detail content

A detail page is where the full content lives.

A summary component should usually show only the fields that help someone scan
and decide whether to click:

- title or name
- short description or summary
- lightweight metadata that is already available and clearly useful
- destination link

If you keep trying to add more and more fields, you are probably drifting from
"summary component" toward "mini detail page."

### Why not one generic `Card`

At this stage, a single generic `Card` component is usually too abstract.

Topics, Articles, and Actions are all discovery items, but they do not carry
exactly the same meaning or fields:

- Topic summaries emphasize name and description
- Article summaries emphasize title and summary text
- Action summaries emphasize title, description, and maybe action type

If you force them into one generic shape too early, you usually end up with:

- too many optional props
- conditional rendering everywhere
- a component that is harder to understand than three simple summary components

### Where reuse should happen now

The Phase 6 reuse target is modest.

These components should be reusable across:

- collection routes like `/topics`, `/articles`, and `/actions`
- related-content sections on detail pages
- optional homepage featured sections if you decide to add them later

That gives you reuse in markup and behavior now, while leaving room to restyle
or recompose them in Phase 9.

### What stays out of scope for now

Phase 6.8 is not the time to build:

- a full design system
- multiple visual variants for every component
- animation-heavy cards
- highly configurable generic layout primitives
- marketing-style homepage modules

The current goal is structural reuse for discovery UI, not final presentation.

## Tiny Worked Examples

### Topic summary mental model

```tsx
function TopicSummary({ topic }) {
  return (
    <article>
      <h2>
        <Link href={`/topics/${topic.slug}`}>{topic.name}</Link>
      </h2>
      <p>{topic.description}</p>
    </article>
  );
}
```

Important idea:
This component renders one topic preview and one clear click target. It does
not try to be the whole topic page.

### Article summary mental model

```tsx
function ArticleSummary({ article }) {
  return (
    <article>
      <h3>
        <Link href={`/articles/${article.slug}`}>{article.title}</Link>
      </h3>
      <p>{article.summary}</p>
    </article>
  );
}
```

Important idea:
The title and summary are enough for discovery. Full article content belongs on
the detail route.

### Reuse on a detail page

```tsx
<section>
  <h2>Related Articles</h2>
  {topic.articles.map((article) => (
    <ArticleSummary key={article.id} article={article} />
  ))}
</section>
```

Important idea:
The detail page owns the section heading and array mapping. The summary
component owns the repeated preview block.

## How This Appears In The Repo Today

Current Phase 6 context:

- the homepage is now a minimal discovery entry point in
  `apps/web/src/app/page.tsx`
- public browsing routes already exist for topics, articles, and actions
- related-content sections already need linked summaries across those routes

That means the next useful extraction is not "build a design system." It is:

- identify repeated preview markup in topic/article/action routes
- extract small content-type-specific summary components
- reuse them where the same preview pattern repeats

Good candidate components:

- `TopicSummary`
- `ArticleSummary`
- `ActionSummary`
- a small wrapper like `RelatedContentSection` only if the section markup also
  clearly repeats

## Tiny Rules Of Thumb

- Build summaries around the current API payloads, not imagined future data.
- Prefer `TopicSummary`, `ArticleSummary`, and `ActionSummary` over one generic
  `Card` unless the shared shape is truly stable.
- Let route pages own fetches and section composition.
- Let summary components own repeated preview markup for one item.
- If a component needs many optional props to support different content types,
  it is probably too generic.
- Structural reuse now is good; major visual-system work belongs later.

## Pointed Questions To Ask When Blocked

- Is this component previewing one item, or is it trying to become a whole page?
- Am I extracting real repeated markup, or just moving code around early?
- Does this prop belong to one content type only, suggesting a specialized
  component is clearer?
- Am I designing for the current Phase 5 API contract, or for speculative
  future variants?
- Would this still make sense if Phase 9 only restyled it rather than rebuilt
  it?
