# Zod Discriminated Unions

A discriminated union is a schema made of multiple object shapes where one field
selects which shape is valid.

In Phase 10.3, the discriminator is:

- `submissionType`

That means:

- `submissionType: 'ARTICLE'` must match the article payload schema
- `submissionType: 'EVENT'` must match the event payload schema

Why this is useful:

- one endpoint can accept multiple related request shapes
- validation stays explicit
- branching logic is driven by one field instead of manual nested `if` checks

Small idea:

```ts
z.discriminatedUnion('submissionType', [articleSchema, eventSchema]);
```

Rule of thumb:

- use a discriminated union when one known field determines the rest of the
  object structure
