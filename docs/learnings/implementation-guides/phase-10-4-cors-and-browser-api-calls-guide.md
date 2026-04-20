# Phase 10.4 CORS And Browser API Calls Guide

This guide explains the CORS concepts that matter right now for Phase 10.4:
why the article form can hit the API from the browser, why the request may
fail before the real `POST` happens, and why browser code needs a public API
base URL.

Relevant canonical context:

- `docs/specs/009-phase-10-submission-spec.md`
- `docs/specs/010-phase-10-4-submission-ui.md`

## Concepts To Understand Now

- what "same origin" means
- what CORS is trying to protect
- what a preflight `OPTIONS` request is
- why `Cannot POST /submissions` and `OPTIONS 404` are different failures
- why browser code needs `NEXT_PUBLIC_API_BASE_URL`

## Plain-Language Explanations

### What "origin" means

An origin is the combination of:

- protocol
- host
- port

Examples:

- `http://localhost:3000`
- `http://localhost:3001`

Those are different origins because the ports differ.

### Why the browser cares

When frontend code running on one origin tries to call an API on another
origin, the browser does not just allow it silently.

The browser checks whether the API has explicitly allowed that cross-origin
request.

That browser security system is called CORS:

- Cross-Origin Resource Sharing

### What CORS is protecting against

CORS is not mainly about whether your API route exists.

It is about whether a browser page from origin A is allowed to make requests to
origin B and read the response.

Without CORS rules, a malicious site could try to make a browser call into some
other service from the user's browser context.

### What a preflight request is

For some cross-origin requests, the browser sends a small "permission check"
request first:

- method: `OPTIONS`

This happens before the real request.

For your Phase 10.4 submit flow, the browser will usually preflight because the
request is:

- cross-origin
- `POST`
- JSON (`Content-Type: application/json`)

So the browser flow is often:

1. send `OPTIONS /submissions`
2. if allowed, send real `POST /submissions`

### What `OPTIONS 404` means

If you see:

- request method: `OPTIONS`
- status: `404`

that means the browser never got a valid preflight response.

So the real `POST` is blocked before it starts.

In your case, that meant:

- the browser wanted permission to call the API
- the API did not respond properly to the preflight
- the submit flow failed before payload validation even mattered

### What `Cannot POST /submissions` means

This is a different failure.

It means the browser got far enough to send the real `POST`, but the API server
does not currently have a mounted route for that path.

So:

- `OPTIONS 404` usually points at CORS/preflight handling
- `POST 404` usually points at route wiring or wrong path

These are not the same problem.

### Why client code needs `NEXT_PUBLIC_API_BASE_URL`

Your article submission form is a client component, which means its submit code
runs in the browser.

Browser code cannot rely on normal server-only env vars.

In Next, only env vars prefixed with `NEXT_PUBLIC_` are exposed to browser-side
code.

That is why browser API calls need something like:

- `NEXT_PUBLIC_API_BASE_URL`

not:

- `API_BASE_URL`

### Why this does not force same-origin deployment

Using `NEXT_PUBLIC_API_BASE_URL` does not mean web and API must live on the
same host.

It only means:

- the browser needs to know the API base URL it should call

Example deployment:

- web app: `https://app.example.com`
- API: `https://api.example.com`

And in the web app env:

- `NEXT_PUBLIC_API_BASE_URL=https://api.example.com`

You still need CORS on the API, because those are still different origins.

## Tiny Worked Examples

### Example 1: Same-origin vs cross-origin

- page at `http://localhost:3000`
- API at `http://localhost:3000`

That is same-origin.

- page at `http://localhost:3000`
- API at `http://localhost:3001`

That is cross-origin.

### Example 2: What the browser does

Conceptually:

```text
Browser page -> OPTIONS /submissions
API -> yes/no for this origin, method, and headers
Browser page -> POST /submissions (only if allowed)
```

### Example 3: Public env var usage

Conceptually:

```ts
const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
```

That is allowed in browser code.

Conceptually:

```ts
const apiBase = process.env.API_BASE_URL;
```

That is server-only and should not be the dependency for a client form submit.

## How This Appears In The Repo Today

Relevant files in this repo:

- `apps/web/src/components/article-submission.tsx`
- `apps/web/src/lib/api/base.ts`
- `apps/api/src/main.ts`
- `apps/api/src/submission/submission.module.ts`
- `apps/api/src/submission/submission.controller.ts`

The real debugging sequence you just hit was:

1. client form tried to submit using a server-oriented env assumption
2. API then needed CORS enabled for cross-origin browser calls
3. API route wiring still had to be correct after CORS was fixed

That is a good example of why browser submit bugs can fail at multiple layers:

- frontend config
- browser security
- backend route wiring

## Common Mistakes

- assuming `POST 404` and `OPTIONS 404` mean the same thing
- assuming browser code can use any env var the server can use
- enabling CORS and assuming that automatically creates missing routes
- debugging the request body before confirming the request reaches the real route
- forgetting that `localhost:3000` and `localhost:3001` are different origins

## Tiny Rules Of Thumb

- if browser code calls a different origin, think about CORS immediately
- if the failed request method is `OPTIONS`, think preflight first
- if the failed request method is `POST` with `Cannot POST /...`, think route wiring or wrong path
- use `NEXT_PUBLIC_*` env vars for browser-visible configuration
- CORS allows a request across origins; it does not mount missing backend routes
