# Object property shorthand

When an object property name is the same as the variable name you want to use,
JavaScript and TypeScript let you write the name once.

## Why it matters here

Prisma query objects often include nested filters where the field name and local
variable name match. Property shorthand keeps those filters compact without
changing what object gets created.

## Tiny example or rule of thumb

These two objects are equivalent:

```ts
{
  submissionId: submissionId,
}
```

```ts
{
  submissionId,
}
```

Use the explicit form when the names differ:

```ts
{
  submissionId: id,
}
```

Rule of thumb:
If the key and variable have the same name, shorthand is just a shorter way to
write `key: key`.
