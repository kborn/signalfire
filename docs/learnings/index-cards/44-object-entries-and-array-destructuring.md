# `Object.entries()` and array destructuring

`Object.entries(obj)` gives you `[key, value]` pairs, and array destructuring lets you unpack them directly into variables.

## Why it matters here

When building query strings with `URLSearchParams`, you often need to loop over
an object like `{ topicSlug: 'climate' }` and turn each entry into
`params.set(key, value)`.

## Tiny example or rule of thumb

Without destructuring:

```ts
Object.entries(queryParams).forEach((entry) => {
  const key = entry[0];
  const value = entry[1];
  params.set(key, value);
});
```

With destructuring:

```ts
Object.entries(queryParams).forEach(([key, value]) => {
  params.set(key, value);
});
```

Rule of thumb:
If each array item is a two-part pair like `[key, value]`, destructuring lets
you grab both parts directly instead of indexing into the array manually.
