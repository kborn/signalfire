# setState Triggers Re-render

Calling a React state setter schedules another render for that component.

Why it matters here:

The debounce timer does not manually pass a value back to the page. It calls a
state setter, and React re-renders the component so the new value is returned
from the hook on the next render.

Tiny example:

```tsx
setDebouncedValue(value);
```

Read it as:

- update stored state
- React schedules another render
- next render sees the updated state

Rule of thumb:

- state setters do not directly mutate JSX already on the page
- they request a new render using the updated state
