# Phase 6.3 Article Markdown Support Walkthrough

## What You Are Building

You are upgrading article detail from plain-text paragraph rendering to real
Markdown rendering without changing the Phase 6 route structure or discovery
flow.

The target outcome is:

- `GET /articles/:slug` still provides the article data
- `apps/web/src/app/articles/[slug]/page.tsx` still owns the fetch
- article `content` renders Markdown elements correctly
- related topics and actions remain unchanged

This walkthrough is about repo edit order for Markdown support, not broad UI
polish and not a CMS/editor project.

## Files And Folders Involved

Current repo files to start from:

- `apps/web/src/app/articles/[slug]/page.tsx`
- `apps/web/src/lib/articles.ts`
- `apps/web/src/lib/articles.test.ts`
- `apps/web/src/app/globals.css`

Canonical docs to keep open:

- `docs/agent-governance/progress.md`
- `docs/architecture/003-architecture-intent.md`
- `docs/architecture/008-phase-5-topic-content-api-contracts.md`

## Edit Order

### Step 1: Confirm the rendering boundary before choosing a package

Write down the current responsibility split:

- API returns article `content` as text
- article page fetches the article
- helper logic formats that content for display

Why first:

If you do not lock this mental model first, it is easy to spread Markdown logic
into fetch helpers or contracts where it does not belong.

### Step 2: Replace paragraph splitting with one Markdown-focused helper

Open:

- `apps/web/src/lib/articles.ts`

What to do:

- keep date formatting where it is
- replace or supplement `splitArticleContent(...)` with one Markdown-rendering
  function or one article-body helper component

Why second:

This isolates the new behavior to the article body instead of rewriting the
whole page.

### Step 3: Swap the article body section to use the new renderer

Open:

- `apps/web/src/app/articles/[slug]/page.tsx`

What to do:

- leave fetch logic and `404` handling alone
- leave related topic/action sections alone
- change only the section that currently maps paragraph strings into `<p>`

Why third:

This keeps the Markdown change tightly scoped to the body-rendering surface.

### Step 4: Add one test case that proves Markdown is really rendering

Open:

- `apps/web/src/lib/articles.test.ts`

What to do:

- add a test input containing at least:
  - one heading
  - one list
  - one inline link or emphasis example
- assert against the transformed output shape your renderer produces

Why fourth:

Without a focused test, it is easy to stop at "paragraphs still render" and
mistake that for actual Markdown support.

### Step 5: Add only the CSS needed for readable body elements

Open:

- `apps/web/src/app/globals.css`

What to do:

- add baseline spacing and typography for rendered headings, paragraphs, lists,
  and links
- stop before building a full article design system

Why fifth:

Markdown support needs readable defaults, but Phase 6 does not require Phase 9
presentation work.

### Step 6: Verify with content that actually exercises Markdown

Check:

- one seeded article or test fixture with headings or list syntax
- the article detail route in the browser

What to verify:

- headings render as headings
- lists render as lists
- links or emphasis render correctly
- related topics and actions still appear below the body

Why sixth:

True Markdown support is visible in the output structure, not just in passing
tests.

## First Correct Structure

The smallest durable shape in this repo will likely still look like:

```text
apps/web/src/
  app/
    articles/
      [slug]/
        page.tsx
  lib/
    articles.ts
```

If the rendering logic becomes large or style-heavy, a good next extraction is:

```text
apps/web/src/
  components/
    article-body.tsx
```

Only make that move if the body-rendering code stops being small and readable.

## What "Done Enough" Looks Like For Markdown Support

You are in a good state when:

- the article detail route still fetches from the same API contract
- Markdown syntax renders as structured HTML output
- basic body elements are readable
- tests cover at least one real Markdown feature
- no editor tooling, authoring UI, or rich-text admin work has been added

## Ask-When-Stuck Prompts

- Is this change only affecting article-body rendering, or am I widening scope?
- Am I proving real Markdown output, or just preserving plain-text paragraphs?
- Should this stay a helper, or has it grown enough to become a component?
- Am I styling readable defaults, or drifting into polish work too early?
