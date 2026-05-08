# HTML table structure

HTML tables align rows and columns automatically when each row has matching
cells.

## Why it matters here

Admin screens often show repeated records or compact management overviews. When
each item has the same fields, such as `Area`, `Purpose`, and `Status`, a table
is simpler and more semantic than manually aligning columns with generic layout
containers.

## Tiny example or rule of thumb

```tsx
<table>
  <thead>
    <tr>
      <th>Area</th>
      <th>Purpose</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Actions</td>
      <td>Curated civic actions users can take.</td>
      <td>Open</td>
    </tr>
  </tbody>
</table>
```

- `table` is the whole table.
- `thead` groups header rows.
- `tbody` groups data rows.
- `tr` is one table row.
- `th` is a header cell.
- `td` is a data cell.

Rule of thumb:
Use a table when several rows share the same set of fields and should align by
column.
