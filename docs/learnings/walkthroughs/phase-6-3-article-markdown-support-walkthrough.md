# Phase 6.3 Article Markdown Support Walkthrough

## What You Are Building

You are replacing raw article-body text rendering with real Markdown rendering
on the article detail route.

The intended end state is:

- the API still returns article `content` as text
- the article detail page still owns the fetch
- a small `ArticleBody` component renders that text with `react-markdown`
- related topics and actions stay in the same page flow

This is a rendering upgrade, not a backend contract change and not a CMS task.

## Files And Folders Involved

Primary repo files:

- `apps/web/src/app/articles/[slug]/page.tsx`
- `apps/web/src/components/article-body.tsx`
- `apps/web/src/lib/articles.ts`
- `apps/web/src/app/globals.css`
- `apps/web/src/components/article-body.test.tsx`

Dependency surface:

- `apps/web/package.json`

Canonical docs to keep open:

- `docs/agent-governance/progress.md`
- `docs/architecture/003-architecture-intent.md`
- `docs/architecture/008-phase-5-topic-content-api-contracts.md`

## Edit Order

### Step 1: Install the Markdown renderer before writing custom code

Add:

- `react-markdown`

Why first:

This task should use a standard library. If you skip this step, you are likely
to drift into ad hoc parsing logic that you will replace later anyway.

### Step 2: Create one article-body rendering component

Create or open:

- `apps/web/src/components/article-body.tsx`

What to do:

- accept `content: string`
- render it with `react-markdown`
- keep the component small

Why second:

This gives the article body one clear rendering boundary and keeps the route
page from becoming a parser/styling mashup.

### Step 3: Keep the route page focused on fetching and page structure

Open:

- `apps/web/src/app/articles/[slug]/page.tsx`

What to do:

- leave the fetch logic and `404` handling in place
- render article metadata in the header section
- replace raw body text output with `<ArticleBody content={article.content} />`
- leave related topics and actions below the article body

Why third:

The route page should still read as:

1. fetch
2. format metadata
3. render body
4. render discovery links

### Step 4: Add one focused test that proves real Markdown rendering

Open:

- `apps/web/src/components/article-body.test.tsx`

What to do:

- render Markdown with a heading, a list, and a link
- assert that the output contains the corresponding HTML structure

Why fourth:

This catches the difference between true Markdown rendering and plain text
display.

### Step 5: Add only baseline body styles

Open:

- `apps/web/src/app/globals.css`

What to do:

- add readable defaults for headings, lists, paragraphs, and links inside the
  article-body container
- stop before building a full article presentation system

Why fifth:

Phase 6 needs correctness and readability, not full polish.

## First Correct Structure

The smallest durable shape is:

```text
apps/web/src/
  app/
    articles/
      [slug]/
        page.tsx
  components/
    article-body.tsx
    article-body.test.tsx
  lib/
    articles.ts
```

That keeps responsibilities clean:

- page: fetch and page structure
- component: Markdown rendering
- lib: metadata formatting

## What "Done Enough" Looks Like

You are in a good state when:

- article Markdown renders as structured output
- metadata is readable
- related topics and actions still work as clickable discovery links
- tests prove at least one real Markdown feature
- no backend contract churn was needed

## Ask-When-Stuck Prompts

- Am I about to write parsing logic that `react-markdown` already handles?
- Does this code belong in the route page, or in `ArticleBody`?
- Am I proving real Markdown behavior with a test?
- Is the remaining issue correctness, or only styling?
