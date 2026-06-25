# Web Infrastructure Hygiene

Quick-reference for the low-level site health items that are easy to forget
but matter for indexing, security scanners, and real-visitor analytics.

---

## What's in place

### robots.txt — `apps/web/src/app/robots.ts`

Tells crawlers what to index. Served automatically by Next.js at `/robots.txt`.

Current rules:

- Allow: `/` (all public routes)
- Disallow: `/admin`, `/api/`

robots.txt is a courtesy protocol. Well-behaved crawlers (Google, Bing) follow
it. Malicious scanners ignore it.

---

### sitemap.xml — `apps/web/src/app/sitemap.ts`

Served by Next.js at `/sitemap.xml`. Async — fetches topics, articles, and
actions from the public API at generation time.

Covers:

- Static public routes (home, about, issues, articles, actions, events, search, submit)
- Dynamic topic, article, and action detail pages

Does NOT cover events (no stable slug, time-sensitive content).

`robots.ts` references this URL so Google discovers it automatically.

---

### Security headers — `apps/web/next.config.ts`

Applied to all routes via `headers()` in Next.js config:

| Header                   | Value                                      | Purpose                             |
| ------------------------ | ------------------------------------------ | ----------------------------------- |
| `X-Content-Type-Options` | `nosniff`                                  | Prevents MIME-type sniffing attacks |
| `X-Frame-Options`        | `DENY`                                     | Prevents clickjacking via iframes   |
| `Referrer-Policy`        | `strict-origin-when-cross-origin`          | Limits referrer header leakage      |
| `Permissions-Policy`     | `camera=(), microphone=(), geolocation=()` | Disables unused browser APIs        |

Verify at [securityheaders.com](https://securityheaders.com) after deploy.

---

## What's not in place (Milestone 2 candidates)

### Analytics

The overnight traffic in Railway logs is a mix of legitimate crawlers and
background bots. To see real human visitor counts, add a JS-beacon analytics
tool — crawlers don't execute JavaScript so they're naturally excluded.

Options considered:

- **Plausible** — $9/month hosted, privacy-friendly, no cookies
- **Umami** — open source, self-hostable on Railway, free

Either integrates as a single `<script>` tag in the root layout.

### Content Security Policy (CSP)

A strict CSP would further reduce XSS risk but requires enumerating every
script, style, and font source. Deferred because it can break Next.js
internals if misconfigured. Revisit when the stack stabilises.

### Canonical URL tag

If the site is ever accessible at multiple URLs (www vs non-www, Railway URL
vs custom domain), add `<link rel="canonical">` in the root layout metadata
to tell Google which URL is authoritative.
