# Arrow Functions vs Function Expressions

Arrow functions are a shorter way to write many callbacks and helper
functions.

These two definitions often do the same job:

```ts
const add = (a: number, b: number) => a + b;

const add2 = function (a: number, b: number) {
  return a + b;
};
```

Rule of thumb:

- use arrow functions for short callbacks and simple helpers
- use `function` when you need traditional function behavior
- arrow functions do not get their own `this`
- `function` expressions do get their own `this`

If `this` is irrelevant, arrow functions are usually the cleaner default.
