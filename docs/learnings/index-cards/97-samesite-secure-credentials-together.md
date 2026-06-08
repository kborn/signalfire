# SameSite Secure And credentials:true

## Core Idea

These three settings affect different parts of cookie-based auth.

- `SameSite` tells the browser when it may send the cookie
- `Secure` tells the browser to send the cookie only over HTTPS
- `credentials: true` tells browser-based cross-origin requests they may include
  cookies when the server also allows it

## In This Repo

For a cookie-authenticated admin API:

- `SameSite` affects whether the browser will attach the cookie
- `Secure` affects whether the browser will send it over HTTP vs HTTPS
- `credentials: true` affects whether browser requests to another origin may
  carry cookies at all

## Why It Matters

A cookie can exist and still not be sent if any of these rules block it.

## Common Mistake

Changing only one of these and expecting cross-origin cookie auth to start
working automatically.
