# Phase 6.3 Article Markdown Rendering Guide

This guide covers the one part of Phase 6.3 that is materially different from
Phase 6.2: article detail pages render long-form body content, and in this
project that body content is stored as Markdown.

The important practical answer is simple:

- do not write your own Markdown parser
- do not treat Markdown text as HTML
- use a Markdown rendering library in the article-detail display layer

For this repo, the right default is `react-markdown`.

## Concepts To Understand Now

- Markdown is stored source text
- the article API should keep returning that source text as a string
- the web app should render Markdown at the article-body display boundary
- `react-markdown` turns Markdown into React elements
- styling rendered Markdown is separate from parsing it correctly

## Plain-Language Explanations

### Markdown is the article source format

The database stores article `content` as Markdown text.

Example stored content:

```md
## What to do next

- call city hall
- attend the board meeting

[Read more](/topics/climate)
```

That stored value is not already HTML and not already JSX. It is just text with
Markdown syntax.

### The renderer belongs in the web app, not the API contract

The API contract should keep returning article content as text. That keeps the
backend responsible for content retrieval and the frontend responsible for
display.

In this repo, the render boundary belongs near:

- `apps/web/src/app/articles/[slug]/page.tsx`
- `apps/web/src/components/article-body.tsx`

It does not belong in:

- Prisma models
- shared API contract types
- generic fetch helpers

### `react-markdown` is the normal React solution

`react-markdown` parses Markdown and renders safe React elements.

That means you can do this:

```tsx
<ReactMarkdown>{article.content}</ReactMarkdown>
```

instead of:

- writing a parser yourself
- generating raw HTML strings by hand
- using `dangerouslySetInnerHTML` for plain Markdown text

### `dangerouslySetInnerHTML` solves a different problem

If you already had trusted HTML, `dangerouslySetInnerHTML` would insert that
HTML into the page. That is not what you have here.

Here you have Markdown source.

Important distinction:

- Markdown source: `## Heading`
- rendered result: a real `h2`

If you skip the parse/render step, the page will just show the literal `##`.

## Tiny Worked Examples

### Wrong mental model

```tsx
<p>{article.content}</p>
```

This only prints the raw text. If the content includes Markdown syntax, the
syntax stays visible instead of becoming structured output.

### Correct mental model

```tsx
function ArticleBody({ content }: { content: string }) {
  return <ReactMarkdown>{content}</ReactMarkdown>;
}
```

Important idea:
fetching does not change. Only the body-rendering step changes.

### What success looks like

Markdown source:

```md
## Next step

- call city hall
- show up with one specific ask
```

Correct rendered output:

- one heading
- one unordered list
- two list items

If the browser still shows `##` and `-`, Markdown is not actually wired.

## How This Appears In The Repo Today

Relevant files:

- `apps/web/src/app/articles/[slug]/page.tsx`
- `apps/web/src/components/article-body.tsx`
- `apps/web/src/app/globals.css`

The article page should:

1. fetch the article detail
2. format article metadata
3. render the article body through `ArticleBody`
4. keep related topics and related actions below the body

That preserves the Phase 6 discovery flow while using the correct content
rendering tool.

Canonical architecture context:

- `docs/architecture/003-architecture-intent.md` says articles are stored as
  Markdown in text fields and converted during rendering

## Practical Recommendation For This Repo

Use `react-markdown` in a small dedicated component such as
`apps/web/src/components/article-body.tsx`.

That is the right middle ground because it:

- uses a standard library instead of custom parsing
- keeps Markdown logic out of API helpers
- keeps the route page focused on data fetching and page structure
- gives you one obvious place to style article content later

## Tiny Rules Of Thumb

- Store Markdown as text; render it at the article-body boundary.
- Use `react-markdown` before considering anything more custom.
- Keep fetch logic in the page and body rendering in a small component/helper.
- Do not use `dangerouslySetInnerHTML` just to display Markdown.
- Test one heading, one list, and one link so you know real Markdown is working.
- Style the rendered output after parsing correctness is in place.

## Common Mistakes

- treating Markdown text like pre-rendered HTML
- hand-rolling a parser for basic article rendering
- moving Markdown logic into API contracts or fetch helpers
- mixing parsing concerns with page-fetching concerns
- assuming paragraph splitting counts as Markdown support

## Pointed Questions To Ask When Blocked

- Am I actually rendering Markdown, or just printing its raw text?
- Can this stay a small `ArticleBody` component instead of spreading across the route?
- Am I reaching for HTML injection when a Markdown renderer is the correct tool?
- Is the current problem parsing correctness, or only styling?
