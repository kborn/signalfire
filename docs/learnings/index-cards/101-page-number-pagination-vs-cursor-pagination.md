# Page Number Pagination Vs Cursor Pagination

Page-number pagination asks for a numbered slice like:

- `page=1`
- `page=2`

The server usually computes:

- `skip = (page - 1) * pageSize`
- `take = pageSize`

Why it is good:

- easy to understand
- easy to debug
- easy to render previous/next controls

Cursor pagination asks for the next slice after a specific record marker.

Why it is good:

- stronger for larger or fast-changing datasets
- avoids large offsets

Why it is harder:

- cursor encoding/decoding adds complexity
- the contract is less intuitive for a beginner

For a first public discovery pagination pass, page-number pagination is often
the simpler teaching and implementation choice unless you already know you need
cursor behavior.
