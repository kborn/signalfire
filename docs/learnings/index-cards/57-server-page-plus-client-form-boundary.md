# Server Page Plus Client Form Boundary

In the Next App Router, a route can stay server-first even when one child form
component uses `'use client'`.

Why it matters:
Phase 10.4 should fetch approved topics in the server route page, then pass
them into a client form component that handles field state, validation UX, and
submission behavior.

Rule of thumb:
If the page needs initial data and the form needs browser interactivity, keep
the page server-side and move only the form to the client.
