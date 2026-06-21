# Admin Auth Posture — CSRF and Session Expiration

## CSRF Posture

Admin mutation routes (`POST`, `PATCH`, `DELETE` to `/api/admin/**`) are protected against
CSRF by two independent mechanisms. No CSRF token or double-submit cookie is required.

### Mechanism 1: SameSite cookie

The admin session cookie is set with `SameSite: 'lax'`. Under the `lax` policy, the browser
omits the cookie on cross-site non-GET requests (POST, PATCH, DELETE). A forged form
submission or fetch from a third-party origin will not include the session cookie, so the
API guard will reject the request with 401.

### Mechanism 2: CORS

The NestJS server enables CORS only for origins listed in the `WEB_ORIGINS` environment
variable (defaults to `http://localhost:3000` in development). Cross-origin mutation
requests are rejected at the preflight stage before they reach any application logic.
`allowedHeaders` is restricted to `Content-Type`, so custom header tricks cannot be used
to bypass the preflight.

### Why both layers matter

`SameSite: lax` handles the cookie attachment case; CORS handles the response-reading case.
Together they cover the full browser CSRF attack surface without requiring application-level
CSRF tokens.

### Limitations

- In production, `WEB_ORIGINS` must be set to the actual web origin. An empty or `*` value
  would defeat the CORS defense — this is enforced by the environment contract.
- `SameSite: 'lax'` does not apply to same-site navigation (e.g., different subdomains
  sharing a root domain). If the admin app and an attacker-controlled page share a registrable
  domain, consider upgrading to `SameSite: 'strict'`. For Release 1 (single domain, no
  subdomains), `lax` is sufficient.

---

## Session Expiration Behavior

### How sessions work

- Sessions are stored in `admin_session` with an `expires_at` timestamp.
- Duration is 12 hours (`SESSION_DURATION_MINS = 60 * 12` in `admin-auth.common.ts`).
- Every authenticated admin request calls `reAuthorize`, which pushes `expires_at` forward
  by another 12 hours, keeping active sessions alive indefinitely.

### What happens when a session expires

1. The user makes any admin request with an expired session cookie.
2. The Next.js middleware calls `GET admin/auth/session` to validate the session.
3. The API returns `401 Unauthorized` because the session record is expired.
4. The middleware redirects to `/admin/login?returnPath=<original-path>` and clears the
   cookie by setting it to an empty value with `Expires` in the past.
5. The login page renders "Sign in to continue" (neutral, not "Session expired").
6. After successful login, the user is redirected back to the original path.

This behavior was verified by code review of `middleware.ts` and `admin-auth.service.ts`
on 2026-06-20. The flow produces a clean redirect with no silent 401, no broken state, and
no stale cookie.

### Idle vs. mid-workflow expiration

Because every authenticated request refreshes the session, expiration only occurs after
12 hours of complete inactivity. Mid-workflow expiration is only possible if the user opens
the admin panel, leaves it idle for 12 hours, then tries to submit a form. In that case:

- The form submission goes to the API admin route.
- The API route is protected by `AdminAuthGuard`, which returns 401.
- The web proxy route (`/api/admin/**`) receives the 401 and forwards it to the client.
- The admin editor form surfaces an error (via `withAdminAuthClientRedirect`, which
  redirects client-side to login when it detects a 401 from an API call).

The result is either a server-side redirect (for page navigations) or a client-side redirect
to login (for form submissions), with the returnPath preserved in both cases.
