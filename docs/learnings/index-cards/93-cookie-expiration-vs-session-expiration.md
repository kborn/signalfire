# Cookie Expiration Vs Session Expiration

## Core Idea

Cookie expiration and server-side session expiration are different checks.

## In This Repo

- cookie expiration decides whether the browser keeps sending the cookie
- `AdminSession.expiresAt` decides whether the server still accepts the session

## Why

The browser controls cookie transport lifetime. The server controls auth
validity.

## Common Mistake

Assuming that because the browser still sends a cookie, the server must still
accept the session.
