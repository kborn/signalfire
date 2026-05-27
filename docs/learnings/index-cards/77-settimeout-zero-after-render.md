# setTimeout(..., 0) Is Not A Render Guarantee

`setTimeout(fn, 0)` does not mean "run after exactly zero milliseconds."

It means:

```ts
setTimeout(() => {
  doSomething();
}, 0);
```

Run `doSomething` later, after the current JavaScript work finishes and the
timer callback is scheduled for another turn.

Why it matters here:

React state updates do not change the DOM immediately on the same line.

```tsx
setErrors(nextErrors);
scrollToFirstError(nextErrors);
```

The scroll may run before React has rendered the new error element.

This delay may appear to work, but is not tied to React committing the new DOM:

```tsx
setErrors(nextErrors);
setTimeout(() => scrollToFirstError(nextErrors), 0);
```

The reliable shape for work that requires rendered error elements is:

```tsx
setErrors(nextErrors);

useEffect(() => {
  if (Object.keys(errors).length > 0) {
    scrollToFirstError(errors);
  }
}, [errors]);
```

In plain English:

Set errors, let React render them, then perform the DOM-dependent scroll as an
effect of the committed error state.

Rule of thumb:

- use direct code when the element already exists
- use `useEffect` when the action depends on DOM that appears because React
  rendered new state
- do not treat `setTimeout(..., 0)` as proof that a React render finished
