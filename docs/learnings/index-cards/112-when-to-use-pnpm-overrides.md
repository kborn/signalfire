# When to use `pnpm.overrides`

Use `pnpm.overrides` when a vulnerability or bad transitive version remains
after the parent packages are already as current as you can reasonably take
them.

## Good use cases

- a vulnerable package is only present transitively
- `pnpm up` no longer changes the resolved version
- the fix is a patch-level or otherwise compatible transitive release
- the direct parent update would require an unnecessary major-version jump

## Typical workflow

1. Confirm the remaining path from audit output:

```bash
pnpm audit
```

2. Check the resolved version in the lockfile:

```bash
rg -n 'vite@|postcss@|flatted@' pnpm-lock.yaml
```

3. Add the smallest override set at the workspace root:

```json
{
  "pnpm": {
    "overrides": {
      "vite": "7.3.5",
      "postcss": "8.5.15"
    }
  }
}
```

4. Reinstall and re-audit:

```bash
pnpm install
pnpm audit --prod
pnpm audit
```

## What overrides are not for

- skipping normal parent-package refreshes
- hiding breakage from a major dependency change
- permanently pinning large parts of the graph without review

## Risk check

Overrides are most comfortable when they are:

- patch-level
- clearly compatible
- tied to one known advisory path

If the override changes behavior across major lines or affects many parents, it
deserves the same caution as a direct dependency upgrade.
