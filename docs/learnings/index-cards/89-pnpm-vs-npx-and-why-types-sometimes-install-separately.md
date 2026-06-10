# Pnpm Vs Npx And Why Types Sometimes Install Separately

## Core Idea

`pnpm` is the package manager used in this repo. Use it when you want to add,
remove, or run project dependencies.

`npx` is mainly for running a package command, often as a one-off tool. It is
not the normal way to install project dependencies in this repo.

## `pnpm` Vs `npx`

- `pnpm add bcryptjs` means "install this package into the project"
- `pnpm --filter api add bcryptjs` means "install it into the `api` workspace"
- `npx some-tool` means "run this package command"

In a `pnpm` workspace, the closest equivalent to one-off `npx` usage is often:

- `pnpm dlx some-tool`

## Why `pnpm` Is Correct Here

This repo already standardizes on `pnpm`.

That matters because:

- it updates the correct workspace `package.json`
- it updates the shared lockfile consistently
- it uses the same package manager the repo expects in scripts and CI

## What `-D` Means

`-D` is short for `--save-dev`.

It adds a package to `devDependencies` instead of `dependencies`.

Use `dependencies` for packages the app needs at runtime.
Use `devDependencies` for packages mainly needed during development, type
checking, testing, or build tooling.

## Why Types Are Sometimes Separate

JavaScript packages do not all ship TypeScript type definitions.

There are two common cases:

1. the package includes its own types
2. the package needs a separate `@types/...` package

Example:

- `bcryptjs` usually ships its own types
- `cookie-parser` commonly needs `@types/cookie-parser`

## Rule Of Thumb

- runtime library used by the app in production: `dependencies`
- type-only helper package: usually `devDependencies`
- one-off command runner: `npx` or `pnpm dlx`, not project installation

## In This Repo

For Nest API auth work, use:

- `pnpm --filter api add bcryptjs cookie-parser`
- `pnpm --filter api add -D @types/cookie-parser`
