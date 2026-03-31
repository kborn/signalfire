# `?.` vs `??`

`?.` safely reads a property when a value might be missing, while `??` provides a fallback when a value is `null` or `undefined`.

## Why it matters here

Next page props like `searchParams` may be absent or undefined in some test and
route setups, so Event page code often needs both safe access and a fallback
object.

## Tiny example or rule of thumb

Optional chaining:

```ts
const topicSlug = searchParams?.topicSlug;
```

Meaning:
Use `topicSlug` if `searchParams` exists. Otherwise return `undefined` instead
of throwing.

Nullish coalescing:

```ts
const params = searchParams ?? {};
```

Meaning:
If `searchParams` is `null` or `undefined`, use `{}` instead.

Combined:

```ts
const { topicSlug } = searchParams ?? {};
```

Rule of thumb:
Use `?.` when you want safe property access. Use `??` when you want a default
value.
