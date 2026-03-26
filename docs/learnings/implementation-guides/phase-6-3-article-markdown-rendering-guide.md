# Phase 6.3 Article Markdown Rendering Guide

This guide explains the part of Phase 6.3 that is different from Phase 6.2:
article detail does not just render summary fields. It renders stored article
content, and the canonical architecture says Release 1 stores that content as
Markdown and converts it during rendering.

## Concepts To Understand Now

- Markdown is a storage format, not a UI component
- rendering Markdown is a server-side transformation step
- raw HTML injection is not the same thing as Markdown rendering
- article body rendering should stay separate from list/detail data fetching
- safe baseline rendering is more important than rich formatting in Phase 6

## Plain-Language Explanations

### Markdown is content, not presentation code

An article `content` field stores author-written text in Markdown syntax. That
means the database value is the source text, not already-rendered HTML and not
already-split JSX.

Examples of Markdown source:

```md
# Why county meetings matter

Residents can influence local decisions more directly than they often think.

- attend the meeting
- bring one specific ask
- follow up in writing
```

The job of the web app is to turn that source text into rendered page content.

### Rendering happens at the display boundary

The article API should keep returning content as text. The web app should
decide how to render it for the browser.

In this repo, that means the rendering boundary belongs near:

- `apps/web/src/app/articles/[slug]/page.tsx`
- or one small helper/component used by that page

It does not belong in:

- Prisma models
- API contracts
- generic fetch helpers

### Raw HTML injection is a different tool

If you already had trusted HTML, `dangerouslySetInnerHTML` would insert that
HTML into the page. That is not the same thing as taking Markdown source and
rendering it correctly.

Important distinction:

- Markdown source: `## Heading`
- HTML output: `<h2>Heading</h2>`

If you skip the Markdown-to-HTML step and inject raw strings, you either:

- render literal Markdown text with no formatting
- or start trusting arbitrary HTML too early

### Server rendering is the right first home

Phase 6 article pages are already server-rendered detail pages. That makes the
article detail route the simplest first place to render Markdown.

That keeps the flow straightforward:

1. fetch article detail
2. read `article.content`
3. transform Markdown for display
4. render the body

You do not need a client component just to support Markdown display.

## Tiny Worked Examples

### Mental model: current plain-text fallback

```tsx
const paragraphs = splitArticleContent(article.content);

return paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>);
```

This works for plain text and double-line-break paragraphs. It does not support
Markdown syntax such as headings, lists, emphasis, or links.

### Mental model: Markdown render boundary

```tsx
const renderedBody = renderArticleMarkdown(article.content);

return <article>{renderedBody}</article>;
```

Important idea:
The page still owns fetching. Only the body rendering step changes.

### Tiny example: what should change

Markdown source:

```md
## What to do next

- call your county clerk
- attend the next board meeting
```

Desired browser result:

- one `h2`
- one unordered list
- two list items

If the page still shows `##` and `-`, Markdown support is not actually wired.

## How This Appears In The Repo Today

Current article-detail rendering lives in:

- `apps/web/src/app/articles/[slug]/page.tsx`

Current helper logic lives in:

- `apps/web/src/lib/articles.ts`

Right now the page:

- formats metadata dates
- splits article content into paragraphs
- renders body text as repeated `<p>` elements

That is a good Phase 6.3 baseline because it proves the route, API contract,
and page structure. Markdown support should replace the body-rendering helper
without changing the overall route flow.

Canonical architecture context:

- `docs/architecture/003-architecture-intent.md` says articles are stored as
  Markdown in text fields and converted during rendering

## Practical Options In This Repo

### Option 1: keep the current paragraph fallback for now

Use this when:

- content is still mostly plain text
- you want to finish baseline discovery flow first
- you do not want another dependency yet

Tradeoff:

- easy and safe
- not true Markdown support

### Option 2: add a Markdown rendering helper on the server

Use this when:

- article content will begin using headings, lists, links, and emphasis
- you want the web app to match the architecture intent

Good shape:

- keep fetching in `page.tsx`
- add one small `renderArticleMarkdown(...)` helper or dedicated article-body
  component
- keep Markdown-specific logic isolated from generic API code

### Option 3: add custom styling after rendering works

Do this later, not first.

Sequence:

1. make Markdown render correctly
2. style headings, lists, blockquotes, and links
3. improve article presentation if needed in Phase 9

## Tiny Rules Of Thumb

- Store Markdown as content; do not store pre-rendered HTML as the source of truth.
- Keep the render transformation near the article-detail display boundary.
- Do not put Markdown parsing logic in API helpers.
- Finish correctness before body-style polish.
- If you introduce a renderer, test one heading, one list, and one link.
- If a renderer requires unsafe HTML behavior, slow down and justify it first.

## Common Mistakes

- treating Markdown text as though it were already-rendered HTML
- putting Markdown conversion in the backend contract layer
- converting Markdown everywhere instead of only where article bodies display
- overbuilding a rich-text system when Phase 6 only needs public article display
- spending more time on article-body design than on correct rendering behavior

## Pointed Questions To Ask When Blocked

- Am I trying to solve Markdown storage, parsing, and styling all at once?
- Can this stay a server-rendering concern in the article detail page?
- What is the smallest place in the repo where Markdown conversion can live?
- Does this change improve article-body correctness, or only visual polish?
