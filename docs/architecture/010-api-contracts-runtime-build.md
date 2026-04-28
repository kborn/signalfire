# API Contracts Runtime Build

## Purpose

Define why `@signal-fire/api-contracts` must emit built JavaScript when it
exports runtime values in addition to types.

## Decision

`@signal-fire/api-contracts` must build to `dist/` and publish runtime imports
from compiled JavaScript entrypoints rather than exposing raw TypeScript source
as its runtime surface.

The package may continue to define both shared type contracts and small shared
runtime constants, but any runtime consumer must load compiled `.js` output from
`dist/`.

## Why This Is Necessary

Before this change, `@signal-fire/api-contracts` exposed `index.ts` directly as
both its type surface and runtime surface.

That was workable while the package only exposed type-only contracts, because
type-only imports and exports are erased by TypeScript and never become runtime
module edges.

Phase 10 requires a shared runtime Event type list for the submission UI.
Adding a runtime export exposed a real module-resolution problem:

- `apps/web` resolves package imports with `moduleResolution: bundler`
- `apps/api` resolves package imports with `moduleResolution: nodenext`
- raw TypeScript package files with internal runtime re-exports were not
  resolved consistently across those two consumers

The problem is not that the package contains types. The problem is that a
runtime value creates a runtime module edge, and raw source exports were not a
stable runtime contract for both consumers.

Compiled JavaScript fixes that by making the runtime module graph explicit and
real:

- `dist/index.js`
- `dist/common.types.js`
- `dist/event-type.constants.js`

Once those files exist, internal runtime imports such as
`./event-type.constants.js` are ordinary ESM imports rather than source-level
assumptions interpreted differently by each consumer.

## Rules

When `@signal-fire/api-contracts` exports runtime values:

1. define runtime exports in normal TypeScript modules inside the package
2. build the package to `dist/`
3. point package runtime exports at built JavaScript in `dist/`
4. point package type exports at built declarations in `dist/`
5. ensure consumer scripts build the contracts package before runtime-oriented
   commands such as app dev, app build, and browser-driven tests

Type-only changes may appear to work without this build step, but runtime
exports must not rely on raw-source package resolution.

## Implications

- Shared enums/constants such as `EVENT_TYPES` may now serve as actual
  single-source runtime definitions
- Future runtime constants added to `@signal-fire/api-contracts` should follow
  the same built-package pattern
- Consumer tooling should treat `@signal-fire/api-contracts` as a compiled
  dependency for runtime use, even inside the monorepo
