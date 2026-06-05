# `findUnique` vs `findFirst`

`findUnique` is for selectors that the schema marks as unique. `findFirst` is
for queries that add extra filters or do not map to a unique selector.

Why it matters:

- Prisma uses the schema to decide what counts as a unique lookup.
- If your selector is only unique because of business logic, not schema
  constraints, `findFirst` is usually the safer query method.

Rule of thumb:

- Use `findUnique` for identity lookups.
- Use `findFirst` for identity plus extra conditions.
- Use `findMany` for lists and non-unique searches.
