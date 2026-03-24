# Learning Card 06: CLI Tools

- `pnpm` = package manager used here
- `npm` = default package manager, not preferred here
- `npx` = run one-off package command
- `pnpm dlx` = `pnpm` version of `npx`
- `tsx` = run TS files directly
- `rg` = fast repo text search
- `eslint` = linter CLI
- `prettier` = formatter CLI
- `husky` = git hook manager

Examples:

```bash
pnpm dev
pnpm --filter api typecheck
pnpm dlx create-next-app@latest
rg "SubmissionRepository" apps/api/src
pnpm format:check
```

Pattern:

```bash
pnpm --filter api prisma:generate
```

= run the `api` package's `prisma:generate` script

Useful checks:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm build
```
