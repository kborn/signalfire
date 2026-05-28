# Route Groups In Next App Router

A folder wrapped in parentheses groups routes without changing the URL.

Example:

```text
app/
  (public)/
    page.tsx
    topics/page.tsx
  admin/
    page.tsx
```

URLs:

- `app/(public)/page.tsx` -> `/`
- `app/(public)/topics/page.tsx` -> `/topics`
- `app/admin/page.tsx` -> `/admin`

Why it matters here:

Phase 11.5 needs a public `Find Your Fight` shell without forcing that public
branding onto `/admin`.

Use:

- `app/layout.tsx` for the required document shell: `<html>`, `<body>`, global
  CSS import
- `app/(public)/layout.tsx` for public wordmark, public nav, and public visual
  wrapper
- `app/admin/layout.tsx` for admin navigation and admin workspace layout

Rule of thumb:

Route groups organize layout ownership. They do not add URL segments.

Common mistake:

Do not put `<html>` or `<body>` in a route-group layout. Only the root layout
owns the document. A route-group layout should return normal markup such as:

```tsx
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <div className="publicShell">{children}</div>;
}
```
