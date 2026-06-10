# Authentication Vs Authorization

## Core Idea

Authentication answers who the user is.
Authorization answers what the user is allowed to do.

## In This Repo

For Phase 11.9:

- authentication proves someone is a signed-in internal operator
- authorization decides whether that operator may use `/admin` routes and admin
  APIs

## Quick Example

- signed in but not allowed to moderate: authenticated, not authorized
- signed in and allowed to use admin: authenticated and authorized

## Common Mistake

Treating "user exists" as enough to permit admin actions.
