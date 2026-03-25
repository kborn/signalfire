# Phase 6.1 Next.js Routing and Layout Guide

## Concepts To Understand Now

For Phase 6.1, you only need a small part of the Next.js App Router model:

- folders inside `src/app/` create URL routes
- `page.tsx` renders a route
- `layout.tsx` wraps routes beneath it
- `[slug]` creates a dynamic route segment
- `Link` is used for internal navigation
- server components are the default, so you do not need `'use client'` just to
  render pages and navigation

This is enough to build the first public browsing structure for:

- `/`
- `/topics`
- `/topics/[slug]`
- `/articles`
- `/articles/[slug]`
- `/actions`
- `/actions/[slug]`

## Plain-Language Explanations

### What `src/app/` means

In the App Router, the folder tree is the route tree.

That means:

- `src/app/page.tsx` handles `/`
- `src/app/topics/page.tsx` handles `/topics`
- `src/app/topics/[slug]/page.tsx` handles `/topics/<some-slug>`

You are not registering routes in a config file. You are creating them by
placing files in the right folders.

### What `page.tsx` does

A `page.tsx` file is the UI for one route.

Use it when you want to answer:

- what should `/topics` show?
- what should `/articles/climate-policy-101` show?

Think of `page.tsx` as the route's main content.

### What `layout.tsx` does

A `layout.tsx` file wraps the pages under it.

Use it for things that should stay consistent across multiple routes:

- site header
- primary navigation
- outer content wrapper
- footer, if Phase 6.1 needs one

Think of `layout.tsx` as shared chrome, not route-specific content.

### What `[slug]` means

`[slug]` is a dynamic segment.

It means part of the URL changes from page to page:

- `/topics/climate`
- `/topics/democracy`
- `/articles/general-strike-primer`

All of those can be handled by one file:

- `src/app/topics/[slug]/page.tsx`

The slug value is passed into the page so the route can load the right record.

### What `Link` does

Use Next.js `Link` for internal navigation between pages in the app.

For Phase 6.1, that includes links such as:

- Home -> `/`
- Topics -> `/topics`
- Articles -> `/articles`
- Actions -> `/actions`

Later, the same component will be used for links from topic, article, and
action summaries to their detail pages.

### When you need `'use client'`

You probably do not need `'use client'` for the first Phase 6.1 pass.

If a component only:

- renders markup
- receives props
- shows links
- uses async server data fetching

then it can stay a server component.

You only need `'use client'` when a component depends on browser-only features
such as:

- `useState`
- `useEffect`
- click handlers with interactive state
- direct browser APIs

Phase 6.1 is mostly route structure and shared layout, so defaulting to server
components keeps things simpler.

## Tiny Worked Examples

### Example 1: A static collection route

File:

- `src/app/topics/page.tsx`

Meaning:

- this page renders `/topics`

Tiny example:

```tsx
export default function TopicsPage() {
  return <h1>Topics</h1>;
}
```

This is enough to prove the route exists before adding real data rendering.

### Example 2: A dynamic detail route

File:

- `src/app/topics/[slug]/page.tsx`

Meaning:

- this page renders `/topics/<slug>`

Tiny example:

```tsx
type TopicDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function TopicDetailPage({ params }: TopicDetailPageProps) {
  const { slug } = await params;

  return <h1>Topic: {slug}</h1>;
}
```

For Phase 6.1, the important idea is not the final UI. It is that one page file
can serve many slug values.

### Example 3: A shared root layout

File:

- `src/app/layout.tsx`

Tiny example:

```tsx
import Link from 'next/link';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav>
            <Link href="/">Home</Link>
            <Link href="/topics">Topics</Link>
            <Link href="/articles">Articles</Link>
            <Link href="/actions">Actions</Link>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
```

This gives every Phase 6.1 page the same navigation without repeating it.

## How This Appears In The Repo Today

Current state:

- `apps/web/src/app/layout.tsx` still contains the starter root layout and
  metadata
- `apps/web/src/app/page.tsx` still contains the starter Next.js homepage
- no route folders exist yet for topics, articles, or actions

What Phase 6.1 changes:

- the starter homepage is replaced with a real SignalFire home page
- the root layout becomes the shared public browsing shell
- new route folders are added for topics, articles, and actions
- each domain gets both a collection route and a `[slug]` detail route

The smallest correct route tree for this phase looks like:

```text
apps/web/src/app/
  layout.tsx
  page.tsx
  topics/
    page.tsx
    [slug]/
      page.tsx
  articles/
    page.tsx
    [slug]/
      page.tsx
  actions/
    page.tsx
    [slug]/
      page.tsx
```

That route tree is the main framework concept for this subtask.

## Tiny Rules Of Thumb

- If it maps to a URL, start by asking which folder and `page.tsx` file should
  exist.
- If UI repeats across multiple public pages, put it in `layout.tsx`.
- If a URL segment changes by record, use `[slug]`.
- If a link stays inside the app, use `Link`.
- If you are only rendering structure and content, do not add `'use client'`
  yet.
- Build the route tree first, then fill in real data rendering.

## Common Beginner Mistakes In This Phase

- putting all routes into one `page.tsx`
- confusing `layout.tsx` with a page template for one route
- reaching for client components too early
- using plain `<a>` tags for internal navigation
- trying to solve API rendering, design polish, and route structure all at once
- creating out-of-scope routes for Events, search, or filters

## What Can Wait Until Later

You do not need to master these before finishing Phase 6.1:

- nested layouts beyond the root layout
- loading UI
- error boundaries
- client-side state management
- search params
- route groups
- pagination patterns

## Useful Questions To Ask Next

- What should the first correct Phase 6.1 route tree look like in this repo?
- What belongs in `layout.tsx` versus each route page?
- How should I read `params` in a `[slug]` page in this project?
- Do I need an implementation guide for server data fetching after the route tree
  exists?
