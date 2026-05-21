# useEffect Runs After Render

`useEffect` tells React to run code after a component has rendered.

Tiny shape:

```tsx
useEffect(() => {
  doSomething();
}, [valueA, valueB]);
```

The first argument is the function React will run. The second argument is the
dependency array.

How to read it:

- render the component
- after render, run the effect
- on later renders, run it again only when one listed dependency changed

Why it matters here:

An Article or Event normalization form owns its field state, but the parent
review component owns the approval buttons. The form can use `useEffect` to
send the latest normalized payload back to the parent after any tracked field
changes.

```tsx
useEffect(() => {
  onChange({
    title,
    summary,
    content,
    author: author.trim() || 'anonymous',
    topicSlugs,
  });
}, [title, summary, content, author, topicSlugs, onChange]);
```

In plain English:

When `title`, `summary`, `content`, `author`, `topicSlugs`, or `onChange`
changes, call `onChange(...)` with the latest payload after React finishes
rendering.

Rule of thumb:

- use event handlers for direct user events like typing or clicking
- use `useEffect` when some state change should trigger follow-up work after
  render, such as notifying a parent about a derived form value
