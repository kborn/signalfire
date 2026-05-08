# URL state vs local filter state

Filters can live in the URL or only in browser component state. URL state is
usually better when the filtered view should survive refreshes, browser history,
or sharing.

## Why it matters here

The admin submissions queue can be represented by URLs like:

```txt
/admin/submissions?status=APPROVED&type=ARTICLE
```

That URL means the page should show approved article submissions. The URL is the
source of truth for the queue view.

## Tiny example or rule of thumb

URL-driven filters:

```txt
/admin/submissions?status=PENDING&type=EVENT
```

Benefits:

- refresh preserves the current filters
- browser back and forward work naturally
- filtered views can be bookmarked or shared
- server-rendered pages can fetch the right data immediately

Local-only filters:

```tsx
const [status, setStatus] = useState('PENDING');
```

This can work for highly interactive widgets, but refresh, browser history, and
shared links do not preserve the filter unless the state is also synced back to
the URL.

Rule of thumb:
If a filter changes which records a page represents, prefer query params as the
source of truth.
