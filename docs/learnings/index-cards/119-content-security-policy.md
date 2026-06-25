# Content Security Policy (CSP)

## Core Idea

A Content Security Policy is an HTTP header that tells the browser exactly
which sources of content (scripts, styles, images, fonts) are allowed to
load on your page. Anything not on the allowlist is blocked. It is the most
powerful browser-level defense against **Cross-Site Scripting (XSS)** attacks.

## What XSS Is

XSS happens when an attacker gets malicious JavaScript onto your page —
usually by injecting it through user input that your app renders without
properly sanitizing. If the script runs, it can steal cookies, read form
data, or make requests on behalf of the user.

A strict CSP prevents injected scripts from executing because they would not
be on the allowlist, even if they somehow got onto the page.

## What a CSP Header Looks Like

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://analytics.example.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' https://fonts.gstatic.com;
```

Each directive covers a content type (`script-src`, `style-src`, etc.).
`'self'` means "same origin only." You explicitly list every external source
your site legitimately uses.

## Why It Was Deferred for This Repo

Next.js complicates CSP in several ways:

- It injects inline `<script>` tags for RSC (React Server Components) payload
  hydration. These require either `'unsafe-inline'` (which defeats CSP for
  scripts) or a **nonce** — a unique random value injected into every response
  and matching header that has to be wired through the entire rendering pipeline.
- `next/font` loads fonts in ways that can conflict with strict `font-src`
  rules depending on the configuration.
- Getting CSP wrong silently breaks the app (pages go blank, JS stops
  working) rather than failing gracefully.

The correct approach for Next.js is a **nonce-based CSP** using middleware,
which is meaningful work to get right. It is listed as a Milestone 2
candidate in `docs/runbooks/web-infrastructure-hygiene.md`.

## Common Mistake

Adding `'unsafe-inline'` to `script-src` to make things work quickly. This
defeats the entire purpose of CSP for scripts — injected code can still run.
If you cannot use a nonce, a CSP without `script-src` is still worth having
for the other directives (style, image, frame, etc.).
