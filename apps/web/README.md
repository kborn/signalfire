# Find Your Fight Web App

This package contains the Next.js App Router frontend for Find Your Fight.

Use the root README for setup, commands, demo seed guidance, and repository
status:

- `../../README.md`

The web app expects the NestJS API to be available through the configured
`NEXT_PUBLIC_API_BASE_URL`.

Public routes live under the `(public)` route group in source while preserving
the visitor-facing URLs such as `/topics`, `/articles`, `/actions`, `/events`,
and `/submit`. Admin routes live under `/admin`.

Useful package-local validation from the repository root:

```bash
pnpm --filter web typecheck
pnpm --filter web lint
pnpm --filter web test
```
