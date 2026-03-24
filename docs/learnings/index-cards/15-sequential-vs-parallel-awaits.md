# Learning Card 15: Sequential vs Parallel Awaits

If async tasks are independent:

- sequential `await` = total time adds up
- `Promise.all(...)` = total time is closer to the slowest task

Sequential:

```ts
const a = await getA();
const b = await getB();
```

Parallel:

```ts
const [a, b] = await Promise.all([getA(), getB()]);
```

Use parallel only when tasks do not depend on each other.
