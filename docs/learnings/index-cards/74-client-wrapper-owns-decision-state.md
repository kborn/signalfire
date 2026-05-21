# Client Wrapper Owns Decision State

In React, a parent cannot reach into a child component and read its local
`useState` variables. Data flows down through props. Changes flow back up
through callbacks.

Why it matters here:

The admin submission detail page fetches initial data on the server, but the
moderation decision needs browser state: review notes, edited normalized
fields, selected topic slugs, loading state, and API errors.

Use a client wrapper for that interactive review state:

- server page fetches the submission and available topics
- client wrapper owns review notes, submit status, and API error state
- article/event normalization forms own field state
- normalization forms emit the current approval payload through `onChange`
- decision buttons submit the latest emitted payload

Rule of thumb:

- do not pull many child state variables up one field at a time unless the
  parent truly needs to edit them directly
- for a typed form section, let the child emit one complete value object such as
  `ArticleApprovalPayload` or `EventApprovalPayload`
