# HTTP Security Headers

## Core Idea

Security headers are HTTP response headers that tell the browser how to
behave when displaying your page. They are a first line of defense against
common web attacks. The server sets them; the browser enforces them.

## The Four Headers in This Repo

Set in `apps/web/next.config.ts` via `headers()` and applied to every route.

### X-Content-Type-Options: nosniff

Prevents the browser from guessing the content type of a response. Without
this, a browser might execute a file uploaded as an image if it "looks like"
JavaScript. `nosniff` tells the browser to trust the declared `Content-Type`
header exactly.

### X-Frame-Options: DENY

Prevents your pages from being embedded inside an `<iframe>` on another site.
This blocks **clickjacking** — an attack where an attacker puts your page in
an invisible frame over their own page and tricks users into clicking things
they did not intend to click.

### Referrer-Policy: strict-origin-when-cross-origin

Controls what URL is sent in the `Referer` header when a user clicks a link
leaving your site. `strict-origin-when-cross-origin` sends only the domain
(not the full path) when navigating to a different origin. This prevents
leaking URL parameters (which might contain sensitive data) to third parties.

### Permissions-Policy: camera=(), microphone=(), geolocation=()

Tells the browser that this site will never ask for camera, microphone, or
location access. If JavaScript on the page (or an injected script) tries to
request these, the browser blocks it before the permission prompt ever
appears.

## What's Not Here (and Why)

**Content-Security-Policy (CSP)** is the most powerful security header but
was deferred. See card 119.

## Checking Your Headers

After deploying, paste the URL into [securityheaders.com](https://securityheaders.com)
to see a report card with explanations of what is and is not in place.
