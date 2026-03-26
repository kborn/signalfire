# Server Page Fetching In Next App Router

An App Router `page.tsx` file can be `async`, which lets it fetch data on the
server before the page HTML is rendered.

Why it matters here:
Phase 6.2 can fetch `GET /topics` and `GET /topics/:slug` directly in the topic
route files without introducing client-side fetching just to make the first
correct version work.

Rule of thumb:
If the data is needed to render the initial page and no browser-only behavior is
required, start with a server page fetch.
