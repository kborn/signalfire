# useEffect Return Value

The function passed to `useEffect` may return either:

- nothing / `undefined`
- a cleanup function

Tiny examples:

No cleanup:

```tsx
useEffect(() => {
  loadDraftFromStorage();
}, [draftKey]);
```

Cleanup:

```tsx
useEffect(() => {
  window.addEventListener('resize', onResize);

  return () => {
    window.removeEventListener('resize', onResize);
  };
}, []);
```

Why it matters here:

Effects that only do immediate work do not need cleanup. Effects that start a
timer or listener usually do.

Rule of thumb:

- valid returns are `undefined` or a cleanup function
- do not return arbitrary values like numbers, objects, or promises
- an early `return;` inside an effect simply means "no cleanup for this run"
