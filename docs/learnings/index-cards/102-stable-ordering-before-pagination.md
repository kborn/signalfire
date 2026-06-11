# Stable Ordering Before Pagination

Pagination only works if the list has a deterministic order first.

Bad mental model:

- "just take 12 items and then the next 12"

Correct mental model:

- "take 12 items from a list sorted the same way every time"

If the ordering is unstable, items can:

- appear on multiple pages
- disappear between pages
- move around unexpectedly

A good public collection sort usually has:

1. the main business ordering field
2. a tie-breaker field

Example:

- `publishedAt desc`
- then `id asc`

Define the ordering before you implement the page slice.
