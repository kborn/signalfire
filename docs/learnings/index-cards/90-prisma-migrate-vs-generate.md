# Prisma Migrate Vs Generate

## Core Idea

`prisma migrate` and `prisma generate` do different jobs.

- `migrate` updates the database schema
- `generate` updates the Prisma Client code and types used by the app

They are related, but they are not the same step.

## What Each One Changes

`prisma migrate`:

- applies migration SQL to the database
- changes tables, columns, constraints, indexes, and related DB state

`prisma generate`:

- reads `schema.prisma`
- regenerates `@prisma/client`
- refreshes generated enums, model delegates, and TypeScript types

## When `generate` Is Needed

Run `prisma generate` when:

- `schema.prisma` changed
- dependencies were reinstalled and generated Prisma artifacts may be missing
- Prisma imports, enums, or client types stop resolving correctly

## When `migrate` Is Needed

Run `prisma migrate` when:

- the database structure needs to change
- you created a new migration
- you need to apply existing migrations to a database

## Rule Of Thumb

- database change: `migrate`
- Prisma client/type change from schema updates: `generate`
- schema change that affects both app and DB: usually run both

## In This Repo

Typical paths:

- `pnpm --filter api prisma:migrate:dev`
- `pnpm --filter api prisma:generate`

If lint or TypeScript suddenly treats Prisma enums or client types as missing
after a reinstall, the generated client is a likely suspect.
