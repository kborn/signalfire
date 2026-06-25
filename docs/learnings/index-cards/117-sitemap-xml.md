# sitemap.xml

## Core Idea

A sitemap is an XML file that tells search engines every URL on your site,
along with optional hints about how often each page changes and how important
it is relative to other pages. Without a sitemap, crawlers discover pages by
following links — which means buried or unlinked pages can be missed entirely.

## Basic Structure

```xml
<urlset>
  <url>
    <loc>https://example.com/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>
```

`priority` is a relative hint (0.0–1.0) that tells Google which pages matter
most to you. It does not directly affect ranking. `changefreq` is also a hint
— Google decides its own crawl schedule.

## In This Repo

`apps/web/src/app/sitemap.ts` — Next.js serves this automatically at
`/sitemap.xml`. It is async and fetches published topics, articles, and
actions from the public API at request time so the sitemap always reflects
real content. Static routes (home, about, issues, articles, actions, events,
search, submit) are hardcoded. Events are excluded because they have no
stable slug and change frequently.

`robots.ts` includes the sitemap URL so Google discovers it automatically
when it reads `robots.txt`.

## Why Both robots.txt and sitemap.xml

They do opposite jobs. `robots.txt` tells crawlers what NOT to visit.
`sitemap.xml` tells crawlers what TO visit. You typically want both.

## Common Mistake

Building a static sitemap that goes stale as content is added or removed.
A sitemap that lists URLs that 404 hurts crawl budget and signals to Google
that the site is poorly maintained.
