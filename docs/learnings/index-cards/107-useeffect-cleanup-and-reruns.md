# useEffect Cleanup And Reruns

An effect can optionally return a cleanup function.

Tiny shape:

```tsx
useEffect(() => {
  const timer = setTimeout(doThing, 500);

  return () => {
    clearTimeout(timer);
  };
}, [value]);
```

What React does:

- render with `value`
- run the effect body
- store the returned cleanup function
- if `value` changes later:
  - run the stored cleanup from the previous effect run
  - run the new effect body
  - store the new cleanup

Why it matters here:

Debounce works because the old timer is cleaned up before the new timer takes
over.

Rule of thumb:

- return nothing when the effect just reads data or sets state and is done
- return cleanup when the effect starts something that can outlive that render,
  such as a timer, event listener, subscription, or observer
