# Immediate Vs Debounced Values

In a debounced input, you usually have two values:

- the immediate value: what the user is typing right now
- the debounced value: the same value, but only after a delay

Why it matters here:

If you trigger the side effect from the immediate value, debounce does nothing.
The delayed value must be the one that drives routing or fetching.

Tiny example:

```tsx
const [city, setCity] = useState('');
const debouncedCity = useDebounce(city, 700);

useEffect(() => {
  fetchOrRouteWith(debouncedCity);
}, [debouncedCity]);
```

Rule of thumb:

- use the immediate value to render the input
- use the debounced value to trigger fetches, routing, or other side effects
