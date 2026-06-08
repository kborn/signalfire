# Opaque Vs Structured Session Cookie

## Core Idea

A session cookie can either carry:

- an opaque token
- or a structured payload

## In This Repo

Release 1 uses an opaque session cookie:

- cookie value is just a session token
- server looks up the real session state in the database

A structured session cookie would instead store several values directly inside
one cookie value, such as:

- admin user id
- expiration time
- issued-at time
- signature

## Why It Matters

Opaque DB-backed cookies are easier to reason about first.
Structured signed cookies are more subtle because the cookie itself carries
trusted session state.

## Common Mistake

Assuming multiple values require multiple cookies. A single cookie can store a
structured encoded value.
