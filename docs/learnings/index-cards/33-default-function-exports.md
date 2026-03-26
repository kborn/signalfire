# Default Function Exports

`export default function Name() { ... }` defines a function and marks it as the
main export of that file.

Why it matters here:
In Next App Router files like `page.tsx` and `layout.tsx`, the framework expects
the route component to be the file's default export.

Rule of thumb:
Use a default export when the file has one primary thing to export; use named
exports when the file intentionally exposes several separate items.
