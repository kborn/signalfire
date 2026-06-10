# Same-Origin Vs Same-Site

## Core Idea

Same-origin and same-site are not the same rule.

- same-origin compares scheme, host, and port exactly
- same-site is broader and is used by browser cookie rules like `SameSite`

## In This Repo

Two URLs can be cross-origin but still be treated as same-site for some cookie
behavior.

Example:

- `https://app.example.com`
- `https://api.example.com`

These are cross-origin because the host differs.
They may still be considered same-site for cookie policy purposes.

## Why It Matters

You can have:

- cross-origin requests that still behave as same-site for cookies
- cross-origin requests that need CORS handling even when cookies are allowed

## Common Mistake

Using same-origin and same-site as if they mean the same thing. They affect
related but different browser behaviors.
