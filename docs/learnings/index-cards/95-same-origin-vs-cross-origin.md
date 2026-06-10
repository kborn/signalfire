# Same-Origin Vs Cross-Origin

## Core Idea

Two URLs are the same origin only if they have the same:

- scheme
- host
- port

If any one of those differs, the request is cross-origin.

## In This Repo

Examples:

- `http://localhost:3000` and `http://localhost:3000` = same origin
- `http://localhost:3000` and `http://localhost:3001` = cross-origin
- `http://localhost:3000` and `https://localhost:3000` = cross-origin
- `https://app.example.com` and `https://api.example.com` = cross-origin

## Why It Matters

Cookie sending, browser security rules, and CORS behavior depend heavily on
whether requests are same-origin or cross-origin.

## Common Mistake

Thinking two localhost URLs are same-origin just because the hostname text is
similar. Different ports still mean different origins.
