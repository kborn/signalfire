# HttpOnly Cookie

## Core Idea

`HttpOnly` means browser JavaScript cannot read the cookie.

## In This Repo

The admin session cookie should be `HttpOnly` so the browser can still send it
with requests, but client-side code cannot inspect or copy the session token.

## Why

This reduces accidental exposure of the session token to frontend code.

## Common Mistake

Assuming `HttpOnly` means the cookie is hidden from the browser entirely. The
browser still stores it and still sends it on matching requests.
