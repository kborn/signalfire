# React Fragments Group JSX Without Adding HTML

A React fragment lets one expression return multiple sibling elements:

```tsx
<>
  <dt>Created record</dt>
  <dd>Article</dd>
</>
```

Unlike a `<div>` or `<section>`, `<>...</>` does not create an extra element in
the browser DOM.

Why it matters here:

A description list expects its labeled rows to be direct `dt` and `dd`
children. Conditional JSX still needs one outer value:

```tsx
{
  createdRecord && (
    <>
      <dt>Created record</dt>
      <dd>{createdRecord.recordType}</dd>
    </>
  );
}
```

Wrapping that condition in `<section>` would add real HTML and interrupt the
definition-list structure. A fragment satisfies React without changing the
semantic HTML.

Rule of thumb:

- use a real element when the group needs semantic meaning, layout, styling, or
  accessibility behavior
- use a fragment when React needs grouping but the HTML should remain siblings
