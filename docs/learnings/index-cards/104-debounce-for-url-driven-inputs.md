# Debounce For URL-Driven Inputs

When a text filter is URL-driven, you often want two layers of state:

- local draft state while the user is typing
- committed URL state after typing settles

Why it matters here:

Routing on every keystroke is noisy, but the filter still needs to be shareable
and refresh-safe through the URL.

Tiny shape:

```tsx
const [city, setCity] = useState(params.city ?? '');
const debouncedCity = useDebounce(city, 700);

useEffect(() => {
  setCity(params.city ?? '');
}, [params.city]);

useEffect(() => {
  const next = debouncedCity.trim();
  const current = (params.city ?? '').trim();

  if (next === current) return;
  commitFilters({ city: next || undefined });
}, [debouncedCity, params.city]);
```

How to read it:

- input renders from local `city`
- URL changes can still sync back into local `city`
- only the debounced value decides when to route
- comparing against `params.city` avoids redundant reroutes

Rule of thumb:

- keep a local draft value while the user is typing
- debounce the draft value
- only route when the debounced value differs from the URL value
