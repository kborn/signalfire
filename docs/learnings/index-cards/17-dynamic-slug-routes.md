# Dynamic Slug Routes

A folder named `[slug]` creates a route segment whose value comes from the URL.

Why it matters here:
Phase 6.1 needs topic, article, and action detail pages that map cleanly to the
existing Phase 5 slug-based API endpoints.

Tiny example:
`src/app/topics/[slug]/page.tsx` matches URLs like `/topics/climate`, where
`climate` is the slug value for the page.
