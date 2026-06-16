# useEffect Runs After Render

`useEffect` lets React run follow-up code after a render has committed.

Tiny shape:

```tsx
useEffect(() => {
  doSomething();
}, [valueA, valueB]);
```

How to read it:

- render the component
- after render, run the effect body
- on later renders, run it again only when one listed dependency changed

The dependency array answers:

> "Which state or props changes should cause this follow-up work to run again?"

Why it matters here:

An editor form or filter component often has:

- direct user events handled in `onChange` / `onClick`
- derived follow-up work that should happen after React has rendered new state

Example:

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

When those tracked values change, tell the parent about the latest normalized
payload after React finishes rendering.

Rule of thumb:

- use event handlers for direct user actions like typing or clicking
- use `useEffect` when some state change should trigger follow-up work after
  render
- `useEffect` is not "async magic"; it is a lifecycle hook tied to render
