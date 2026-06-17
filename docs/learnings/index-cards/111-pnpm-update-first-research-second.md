# `pnpm up` first, research second

When a dependency audit or stale package list points at a problem, the first move
is usually a targeted package-manager update, not manual research on every
package in the graph.

## Default workflow

1. Inspect what is outdated for the affected workspace:

```bash
pnpm outdated --filter web
pnpm outdated --filter api
```

2. Refresh the nearest parent packages you actually own:

```bash
pnpm --filter web up
pnpm --filter api up
```

Or update a smaller set if the problem is clearly localized:

```bash
pnpm --filter web up next eslint-config-next vitest
pnpm --filter api up prisma @prisma/client @testcontainers/postgresql
```

3. Verify immediately:

```bash
pnpm typecheck
pnpm test
pnpm audit --prod
pnpm audit
```

## Why this order works

- Many advisories disappear when the parent package graph moves forward.
- Package-manager output tells you what still remains without guessing.
- Verification results show where deeper attention is actually needed.

## When to stop and research

Manual research becomes necessary when:

- the remaining issue is still present after the parent update
- only `--latest` or a major-version jump would move the package
- tests or typecheck fail after the update
- the remaining finding is transitive and no longer controlled by a normal
  parent-package refresh

## Rule of thumb

Do not pre-research every dependency in the tree.

Update narrowly, verify quickly, and only research the packages where the
package-manager path stops being enough.
