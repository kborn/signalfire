# Phase 9.1 Active Nav And ARIA Guide

## Concepts To Understand Now

For Phase 9.1, you only need a small set of UI concepts:

- HTML anchor elements are the actual link tags rendered in the browser
- CSS selectors can target elements by class, nesting, state, and attribute
- ARIA attributes add accessibility meaning to HTML
- `aria-current="page"` marks the current page within a set of navigation links
- Next App Router stays server-first by default, but a tiny client component is
  acceptable when the UI depends on browser route state

## Plain-Language Explanations

### What `.site-nav a` means

This is a CSS selector, not a new class name.

It reads as:

- find an element with class `site-nav`
- then target any `a` elements inside it

In this repo, the `Link` components in
`apps/web/src/app/layout.tsx` render anchor tags, so `.site-nav a` means "the
nav links inside the shared site navigation."

### What `aria` means

ARIA stands for Accessible Rich Internet Applications.

It is a standardized set of HTML attributes that add accessibility meaning for
browsers and assistive technology. These attributes do not replace normal HTML.
They add metadata such as:

- what something represents
- what state it is in
- how screen readers should describe it

### What `aria-current="page"` means

This attribute says: "within this set of links, this one represents the page
the user is currently viewing."

That gives two benefits:

- screen readers can announce the current page more clearly
- CSS can style the current link without inventing a separate visual-only hook

`"page"` is not an arbitrary string chosen by this project. It is a
standardized ARIA value. In other words, the meaning comes from the web
platform, and your CSS should match that real value rather than inventing your
own string just because it is convenient.

### Why the nav state becomes dynamic

Only one nav link should be marked as the current page at a time.

That means the app has to compare:

- the current route, such as `/topics`
- each nav item's destination, such as `/`, `/topics`, `/articles`

Then it adds `aria-current="page"` only to the matching link.

### Does this mean the app is now "running in the browser"?

Not in the broad architectural sense.

The existing repo guidance already says server components are the default and
client components are only needed for browser-only behavior. A route-aware nav
is a narrow browser-state concern, not a move to client-side data fetching or a
client-rendered app architecture.

The important distinction is:

- server-first remains the default rendering model
- a small client island is acceptable when it solves a browser-only UI concern

## Tiny Worked Examples

### Example 1: Plain HTML meaning

```html
<nav class="site-nav">
  <a href="/">Home</a>
  <a href="/topics" aria-current="page">Topics</a>
  <a href="/articles">Articles</a>
</nav>
```

This means:

- all three links match `.site-nav a`
- only the Topics link matches `.site-nav a[aria-current='page']`

### Example 2: Matching CSS

```css
.site-nav a {
  color: #171717;
}

.site-nav a:hover {
  text-decoration: underline;
}

.site-nav a[aria-current='page'] {
  font-weight: 700;
}
```

This means:

- all nav links get the base text color
- hovered nav links get the hover style
- only the current-page nav link gets the active style

### Example 3: Route-aware JSX idea

```tsx
<Link href="/topics" aria-current={isCurrent ? 'page' : undefined}>
  Topics
</Link>
```

This keeps the markup semantic:

- when `isCurrent` is true, the rendered anchor gets `aria-current="page"`
- when `isCurrent` is false, the attribute is omitted

## How This Appears In The Repo Today

Current repo state:

- `apps/web/src/app/layout.tsx` contains the shared nav shell
- `apps/web/src/app/globals.css` already contains `.site-nav`,
  `.site-nav a`, `.site-nav a:hover`, and `.site-nav a[aria-current='page']`
- the nav links currently do not have route-aware `aria-current` behavior yet

What Phase 9.1 is asking for:

- keep the same nav route set
- preserve the simple text-first nav
- add active-link semantics for the current route

## Implementation Direction For This Phase

The cleanest approach is usually one of these:

1. Keep the overall layout server-rendered, but move only the nav links into a
   tiny client component that reads the current pathname and sets
   `aria-current="page"` on the matching link.
2. If there is a clean server-side pathname source available at the layout
   boundary, compute the same attribute there and keep the nav fully server-side.

For this repo, option 1 is the safer mental model if you need the current route
inside the shared root layout.

## Tiny Rules Of Thumb

- `.className` targets an element by class
- `.parent child` targets child elements inside a parent
- `[aria-current='page']` targets an element with that exact attribute value
- ARIA adds meaning; CSS can then style that meaning
- if a string appears inside a standard HTML or ARIA attribute, assume it may be
  platform-defined until you verify otherwise
- stay server-first by default
- use a client component only when the behavior truly depends on browser-only
  state or APIs
