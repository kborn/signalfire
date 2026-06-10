# Cookie Name And Value Purpose

## Core Idea

A cookie needs a name and a value.

- the name tells the browser and server which cookie this is
- the value carries the piece of data the server wants back later

## In This Repo

For Phase 11.9:

- cookie name identifies the admin auth cookie, for example `signal-fire-admin`
- cookie value should be the session token, not the raw user id or password

## Why

The server uses the value to look up the `AdminSession` record on later
requests.

## Common Mistake

Putting too much meaning into the cookie value itself. For a DB-backed session,
the cookie should usually carry only the session token.
