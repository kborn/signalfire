# Nullish checks vs truthy checks

JavaScript has several compact ways to handle missing values. They are similar
enough to confuse, but they answer different questions.

## Why it matters here

API payloads often use optional fields like `website?: string | null`. Repository
inputs usually want a stricter shape like `website: string | null`. The service
layer should intentionally convert `undefined` to `null` instead of relying on
truthy checks.

## Tiny example or rule of thumb

Use `value == null` when you mean "missing as null or undefined":

```ts
function parseOptionalDate(value: string | null | undefined): Date | null {
  return value == null ? null : new Date(value);
}
```

This matches only:

- `null`
- `undefined`

It does not match `''`, `0`, or `false`.

Use `??` when you want a fallback only for `null` or `undefined`:

```ts
website: payload.website ?? null;
```

This keeps real values and converts missing values:

```ts
'https://example.org' -> 'https://example.org'
null -> null
undefined -> null
```

Avoid truthy checks when an empty string might be meaningful:

```ts
// Also treats '' as missing.
endTime: payload.endTime ? new Date(payload.endTime) : null;
```

Optional chaining `?.` is different. It safely reads through possibly missing
objects:

```ts
payload.contact?.email;
```

Rule of thumb:
Use `== null` or `??` for null/undefined normalization. Use `?.` for safe
property access. Use truthy checks only when all falsy values should behave the
same way.
