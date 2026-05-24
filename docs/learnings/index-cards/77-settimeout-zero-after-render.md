# setTimeout(..., 0) Runs Later

`setTimeout(fn, 0)` does not mean "run after exactly zero milliseconds."

It means:

```ts
setTimeout(() => {
  doSomething();
}, 0);
```

Run `doSomething` very soon, after the current JavaScript work finishes and the
browser gets another turn.

Why it matters here:

React state updates do not change the DOM immediately on the same line.

```tsx
setErrors(nextErrors);
scrollToFirstError(nextErrors);
```

The scroll may run before React has rendered the new error element.

This gives React a chance to render first:

```tsx
setErrors(nextErrors);
setTimeout(() => scrollToFirstError(nextErrors), 0);
```

In plain English:

Set the errors now, then scroll after the page has had a chance to show those
errors.

Rule of thumb:

- use direct code when the thing already exists
- use `setTimeout(..., 0)` sparingly when the next step depends on DOM that
  appears after a state update
