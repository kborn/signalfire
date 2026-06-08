# Cookie Path

## Core Idea

`Path` limits which request paths receive the cookie.

## In This Repo

A simple Release 1 choice is often `Path=/` so the cookie is available wherever
admin auth checks need it.

## Why

The browser sends the cookie only when the request path matches the cookie path
rules.

## Common Mistake

Using a path that is too narrow and then wondering why a protected request does
not include the cookie.
