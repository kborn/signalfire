# UI Route Protection Vs API Protection

## Core Idea

Protecting an admin page and protecting an admin API are related, but they are
not the same check.

## In This Repo

For Phase 11.9:

- `apps/web/src/app/admin/...` should block or redirect unauthorized page visits
- admin API endpoints in `submission`, `action`, `article`, and `event` should
  reject unauthorized HTTP requests

## Why Both Matter

If only the UI is protected, direct API calls can still attempt admin actions.
If only the API is protected, blocked users can still reach confusing admin page
states.

## Common Mistake

Assuming the frontend gate makes API authorization unnecessary.
