# Phase 6.1 HTML Page Structure Guide

This guide is a beginner-friendly introduction to the HTML concepts that show
up immediately in `apps/web/src/app/layout.tsx` and `apps/web/src/app/page.tsx`.

## Concepts To Understand Now

- `html` and `body` are the top-level document elements
- `header`, `nav`, and `main` describe page structure
- `section` is a meaningful chunk of page content
- `div` is a generic container when no semantic tag fits
- headings like `h1` and `h2` describe document structure
- links (`a` or Next `Link`) move the user to another page

## Plain-Language Explanations

### `html`

This is the root element for the whole document. In a Next root layout, you
return it once at the top.

### `body`

This holds the visible page content. In the root layout, `body` wraps the
shared shell and the route content inserted through `children`.

### `header`

This is introductory page content, often a site header or page header. For
Phase 6.1, a top navigation bar in `layout.tsx` belongs naturally in a
`header`.

### `nav`

This is for navigation links. If you are linking to Home, Topics, Articles, and
Actions, `nav` is the right semantic tag.

### `main`

This is the primary content area of the page. A shared layout often provides
one `main` wrapper, and the route page renders its own content inside that.

You usually want one main content region for the page shell, not multiple
unrelated `main` elements fighting to own the full screen.

### `section`

Use `section` for one meaningful content block inside the main area. A homepage
hero or a group of topic links can reasonably be a `section`.

### `div`

Use `div` when you need a container for layout or styling but there is no
better semantic tag.

## Tiny Worked Examples

### Shared layout shape

```tsx
<html lang="en">
  <body>
    <header>
      <nav>{/* shared links */}</nav>
    </header>
    <main>{children}</main>
  </body>
</html>
```

### Homepage content shape

```tsx
<section>
  <h1>SignalFire</h1>
  <p>Learn about civic issues and discover meaningful actions.</p>
</section>
```

### Group of links

```tsx
<nav>
  <Link href="/topics">Topics</Link>
  <Link href="/articles">Articles</Link>
  <Link href="/actions">Actions</Link>
</nav>
```

## How This Appears In The Repo Today

- `apps/web/src/app/layout.tsx` should own the document shell:
  `html`, `body`, shared header/nav, and the `children` slot
- `apps/web/src/app/page.tsx` should own only homepage-specific content
- the current starter page still behaves like a standalone landing page, which
  is why it feels awkward once you add a shared layout shell

## Tiny Rules Of Thumb

- Shared page chrome belongs in `layout.tsx`
- Route-specific content belongs in `page.tsx`
- Use `nav` for navigation links
- Use `section` for meaningful content blocks
- Use `div` only when no semantic element fits cleanly
- If a page already has a shared `main` wrapper from the layout, be cautious
  about adding another full-page `main` inside the route
