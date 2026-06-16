# Component Mount Vs Re-render

A component mounts when React creates that instance and inserts it into the UI
tree.

A re-render is different: the same mounted instance runs again with new props
or state.

Why it matters here:

`useState(initialValue)` uses `initialValue` on mount, not on every render.

Tiny example:

```tsx
const [city, setCity] = useState(params.city ?? '');
```

Rule of thumb:

- first mount: initialize state
- later re-renders: reuse stored state
- typing into an input usually causes a re-render, not a new mount
