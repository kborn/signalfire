# robots.txt

## Core Idea

`robots.txt` is a plain-text file at the root of a website that tells web
crawlers which pages they are allowed to visit. It lives at `/robots.txt` by
convention and every well-behaved crawler checks it before crawling.

## What It Controls

```
User-agent: *          # applies to all crawlers
Allow: /               # allow everything by default
Disallow: /admin       # except this path
Disallow: /api/        # and this one
```

`User-agent: *` means "this rule applies to every crawler." You can write
separate rules for specific crawlers (e.g. `User-agent: Googlebot`) if you
want different behavior per bot.

## In This Repo

`apps/web/src/app/robots.ts` — Next.js serves this automatically at
`/robots.txt`. Current rules allow all public routes and disallow `/admin`
and `/api/` so those paths do not appear in Google search results.

## The Important Limit

`robots.txt` is a courtesy protocol, not a security mechanism. Well-behaved
crawlers (Google, Bing, DuckDuckGo) follow it. Malicious scanners, scrapers,
and vulnerability probes ignore it completely. Never rely on it to protect
sensitive content — use authentication for that.

## Common Mistake

Thinking `robots.txt` hides a page from Google. It only tells Google not to
crawl it — if other sites link to the page, Google may still know it exists
and show it in results. To fully remove a page from Google, use a
`noindex` meta tag or a password.
