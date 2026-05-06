# CSS grid lays out direct children

A grid container lays out its direct children as grid items. Nested descendants
inside those children stay inside their parent item.

## Why it matters here

The admin dashboard uses `.adminGrid` to lay out panels. Each `.adminPanel`
should be one direct child of `.adminGrid`. If the panel wrapper is removed, the
heading, stat, helper text, and link each become separate grid items and spread
across columns.

## Tiny example or rule of thumb

Grouped as one grid item:

```tsx
<div className="adminGrid">
  <section className="adminPanel">
    <h3>Pending review</h3>
    <p>--</p>
    <p>Submissions awaiting review...</p>
  </section>
</div>
```

Spread as separate grid items:

```tsx
<div className="adminGrid">
  <h3>Pending review</h3>
  <p>--</p>
  <p>Submissions awaiting review...</p>
</div>
```

Rule of thumb:
If several elements should move as one unit in a grid, wrap them in one direct
child container.
