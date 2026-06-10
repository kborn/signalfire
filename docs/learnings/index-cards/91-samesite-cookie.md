# SameSite Cookie

## Core Idea

`SameSite` controls when the browser will send a cookie in cross-site request
situations.

## In This Repo

A good first choice is usually `SameSite=Lax` unless the web/API origin setup
forces a different behavior.

## Why

This helps the browser decide whether a request should include the cookie when
navigation and request origins get more complex.

## Common Mistake

Treating `SameSite` as a generic security toggle without checking whether the
web app and API are same-origin or cross-origin in local and deployed setups.
