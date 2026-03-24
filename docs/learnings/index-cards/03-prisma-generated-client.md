# Learning Card 03: Prisma Client

Prisma reads `schema.prisma` and generates code.

In this repo:

- schema: `apps/api/prisma/schema.prisma`
- use client from `@prisma/client`

Imports:

- `PrismaClient` = runtime client
- `Prisma` = generated types
- `EntityStatus` = generated enum

Examples:

- `model Topic` -> `prisma.topic`
- `Prisma.TopicWhereUniqueInput` = typed `where` for `findUnique`

Generate:

```bash
pnpm api:prisma:generate
```
