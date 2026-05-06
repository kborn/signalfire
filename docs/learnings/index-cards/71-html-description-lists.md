# HTML Description Lists

Use a `<dl>` when the UI is showing labeled facts about one thing.

The pieces are:

- `<dl>`: description list, the wrapper for the whole group
- `<dt>`: description term, the label or field name
- `<dd>`: description detail, the value for that label

Example:

```tsx
<dl>
  <dt>Title</dt>
  <dd>Sample submission</dd>

  <dt>Summary</dt>
  <dd>A short summary of the submitted content.</dd>

  <dt>Topics</dt>
  <dd>Democracy, Local Community</dd>
</dl>
```

Use a table when you are comparing multiple records across shared columns. Use a
description list when you are showing fields for one record, such as submission
metadata or read-only admin detail values.
