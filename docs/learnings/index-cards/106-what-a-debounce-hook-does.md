# What A Debounce Hook Does

A debounce hook gives you a delayed copy of a value.

Tiny shape:

```tsx
function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

How it works at a low level:

- the hook runs on every render
- the effect starts a timer for the current `value`
- if `value` changes before the timer finishes, React runs the previous cleanup
- that cleanup clears the old timer
- the newest timer is the only one left alive
- when that timer finishes, `debouncedValue` updates

Important distinction:

- the hook itself runs every render
- `debouncedValue` does **not** update every render
- it updates only when one timer survives for the full delay

Rule of thumb:

- the hook does not perform the side effect itself
- it only gives you the delayed value
- a separate `useEffect` or handler should decide what to do with that value
