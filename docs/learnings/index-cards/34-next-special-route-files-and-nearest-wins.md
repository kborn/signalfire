# Next Special Route Files And Nearest Wins

Files like `page.tsx`, `layout.tsx`, `error.tsx`, `loading.tsx`, and
`not-found.tsx` have special meaning in the Next App Router, and the nearest
matching file in the route tree controls that route segment.

Why it matters here:
An app-level `app/error.tsx` handles unexpected errors broadly, but a more local
file such as `app/topics/error.tsx` can override it for the topics section.

Rule of thumb:
Use the special filenames exactly as Next expects, and remember that more local
route-segment files override broader app-level ones.
