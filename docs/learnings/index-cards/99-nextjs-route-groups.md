# Next.js Route Groups

## What it is

A route group is a folder in the Next.js App Router wrapped in parentheses,
for example `(auth)` or `(workspace)`.

The folder helps organize layouts and page trees, but its name does not appear
in the URL.

## Why it matters

Route groups let you split different layout shells without changing the public
route structure.

That is useful when two pages should share a URL prefix but should not share the
same layout.

## Example

Filesystem:

```text
app/
  admin/
    (auth)/
      login/
        page.tsx
    (workspace)/
      layout.tsx
      page.tsx
      events/
        page.tsx
```

URLs:

- `/admin/login`
- `/admin`
- `/admin/events`

The `(auth)` and `(workspace)` folder names do not appear in the URL.

## Why this helps in admin auth

It lets you keep:

- `/admin/login` outside the authenticated admin shell
- `/admin/*` workspace pages inside the admin shell

So the login page can avoid rendering admin navigation or logout controls,
without renaming the route.

## Rule of thumb

Use route groups when:

- the URL should stay the same
- but the layout or rendering boundary should differ

Do not use them when you actually want the extra path segment visible in the
URL.
