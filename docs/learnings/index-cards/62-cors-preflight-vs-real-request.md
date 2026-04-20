# CORS Preflight Vs Real Request

An `OPTIONS` preflight request is the browser asking permission for a
cross-origin request before it sends the real `POST`.

Why it matters here:

In Phase 10.4, the article form can submit JSON from the web app origin to the
API origin. That often triggers a preflight before the real submission request.

Tiny rule of thumb:

- `OPTIONS` failure usually means a CORS/preflight problem
- `POST` failure usually means the real route or request handling is the issue
