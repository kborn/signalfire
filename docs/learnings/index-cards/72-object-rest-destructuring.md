# Object rest destructuring

Object rest destructuring lets you pull one or more properties out of an object
and keep the remaining properties in a new object.

## Why it matters here

Repository inputs sometimes contain helper fields that are not real Prisma
columns. For example, `topicIds` is useful for creating join-table rows, but it
does not belong directly inside `article.create` or `event.create` data.

Object rest destructuring lets you separate those pieces cleanly before calling
Prisma.

## Tiny example or rule of thumb

Given this object:

```ts
const input = {
  eventData: {
    title: 'Tenant Rights Rally',
    summary: 'Public rally',
    status: 'PUBLISHED',
    topicIds: [1, 2],
  },
};
```

This line:

```ts
const { topicIds, ...eventData } = input.eventData;
```

creates:

```ts
const topicIds = [1, 2];
const eventData = {
  title: 'Tenant Rights Rally',
  summary: 'Public rally',
  status: 'PUBLISHED',
};
```

Then `eventData` can be spread into Prisma create data, while `topicIds` can be
mapped into nested join rows.

Rule of thumb:
Use object rest destructuring when one object contains both direct entity fields
and extra workflow fields that need different handling.
