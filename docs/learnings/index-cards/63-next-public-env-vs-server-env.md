# Next Public Env Vs Server Env

In Next, browser code can only read env vars prefixed with `NEXT_PUBLIC_`.

Why it matters here:

The article submission form is a client component, so its browser-side API
calls need a public env var such as `NEXT_PUBLIC_API_BASE_URL`.

Tiny example:

- browser-safe: `process.env.NEXT_PUBLIC_API_BASE_URL`
- server-only: `process.env.API_BASE_URL`

Rule of thumb:

- if the code runs in a client component, treat normal env vars as unavailable
  unless they are explicitly public
