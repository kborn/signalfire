# Controlled Inputs In React

A controlled input is a form field whose current displayed value comes from
React state.

Why it matters here:

Phase 10.4 needs inline errors, preserved values after failed submit, and
success/failure UI changes. Controlled inputs make that behavior predictable.

Tiny example:

- `const [title, setTitle] = useState('')`
- `<input value={title} onChange={(event) => setTitle(event.target.value)} />`

Rule of thumb:

- if your React form needs validation or submit UX, let state own the current
  value instead of leaving the DOM as the only source of truth
