# CORS What It Is

## Core Idea

CORS stands for Cross-Origin Resource Sharing.
It is a browser security system that controls whether one origin may make web
requests to another origin.

## In This Repo

If the web app and API run on different origins, browser requests from the web
app to the API must satisfy CORS rules.

## Why It Matters

Without the right CORS configuration:

- the API may respond
- but the browser may still block the frontend from using that response

## Common Mistake

Thinking CORS is an API authentication system. It is not. CORS is a browser
access rule, not a substitute for admin auth.
