# Phase 6.2 Next Server Fetching And Related Summary Links Guide

This guide explains the Next.js concepts that matter immediately in Phase 6.2:
server-page fetching, collection-vs-detail response handling, and rendering
linked summary sections from already-embedded API data.

## Concepts To Understand Now

- async server pages
- route params on slug pages
- collection responses vs detail responses
- rendering arrays with stable keys
- internal links for related content
- choosing simple fetch boundaries before adding abstractions

## Plain-Language Explanations

### Async server page

In the App Router, a `page.tsx` file can be `async`. That means the page can
fetch data before the HTML is rendered and sent to the browser.

For Phase 6.2, this is the simplest model:

- topic list page fetches the topic collection
- topic detail page fetches one topic by slug

You do not need a client component just to fetch this initial page data.

### Route params on a slug page

A file under `topics/[slug]/page.tsx` receives the slug from the URL. That slug
is the input for `GET /topics/:slug`.

The page logic is conceptually:

1. read `slug`
2. request `/topics/${slug}`
3. render the returned topic

### Collection response vs detail response

These are different API shapes on purpose.

`GET /topics` returns:

- `{ items: TopicSummary[] }`

`GET /topics/:slug` returns:

- one topic object
- `articles: ArticleSummary[]`
- `actions: ActionSummary[]`

That means the list page and detail page should not try to share one identical
rendering path.

### Linked summary rendering

Related article and action arrays are already embedded in the topic detail
response. That means Phase 6.2 should map those arrays directly into linked UI.

You already have enough data to render:

- title
- summary
- destination route
- action type for actions, if useful

You do not need follow-up fetches for each related item.

### Small extraction points

If you repeat the same fetch URL construction or the same "related summaries"
section markup, a small helper or component may be worth extracting.

If the page logic is still changing quickly, keep it inline until the first
correct version works.

## Tiny Worked Examples

### Collection page mental model

```tsx
export default async function TopicsPage() {
  const response = await fetch('http://api/topics');
  const data = await response.json();

  return (
    <section>
      {data.items.map((topic) => (
        <Link key={topic.id} href={`/topics/${topic.slug}`}>
          {topic.name}
        </Link>
      ))}
    </section>
  );
}
```

Important idea:
The page maps `items`, because collection routes usually return arrays inside a
wrapper object.

### Slug detail page mental model

```tsx
export default async function TopicPage({ params }) {
  const { slug } = await params;
  const response = await fetch(`http://api/topics/${slug}`);
  const topic = await response.json();

  return (
    <section>
      <h1>{topic.name}</h1>
      <p>{topic.description}</p>
    </section>
  );
}
```

Important idea:
The detail route returns one topic object, not `{ items: [...] }`.

### Rendering related article summaries

```tsx
<section>
  <h2>Related Articles</h2>
  {topic.articles.map((article) => (
    <article key={article.id}>
      <h3>
        <Link href={`/articles/${article.slug}`}>{article.title}</Link>
      </h3>
      <p>{article.summary}</p>
    </article>
  ))}
</section>
```

Important idea:
The title is usually the strongest click target. The summary helps the user
decide whether to open it.

## How This Appears In The Repo Today

Current Phase 6.2 starting point:

- `apps/web/src/app/topics/page.tsx` is a placeholder with no API fetch
- `apps/web/src/app/topics/[slug]/page.tsx` reads the slug but still uses mock
  placeholder text
- there is no clear `apps/web/src` API helper boundary yet

That means the first useful changes are probably:

- make the topic list page async and fetch `GET /topics`
- make the topic detail page fetch `GET /topics/:slug`
- replace placeholder article/action text with mapped linked summaries

## Tiny Rules Of Thumb

- Use the route page as the first fetch boundary unless you have a clear reason
  not to.
- Collection pages usually render `items`; detail pages usually render one
  object.
- If the API already embeds related summaries, render them directly before
  inventing more requests.
- Make related items clickable as soon as they exist; dead summaries are not a
  discovery flow.
- Extract helpers only after the first working page shape is obvious.
- Stay inside the current phase: no search, no filtering, no pagination, no
  Events UI.

## Pointed Questions To Ask When Blocked

- Am I accidentally treating the collection payload like the detail payload?
- Does this page actually need a client component, or can the server page fetch
  directly?
- Am I about to make extra requests for data the detail endpoint already
  includes?
- Is this extraction removing real duplication, or just moving code around?
