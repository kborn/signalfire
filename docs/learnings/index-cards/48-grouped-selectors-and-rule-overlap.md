# Grouped Selectors And Rule Overlap

A rule like `html, body { ... }` applies the same declarations to both elements,
while a later `body { ... }` rule can add or override styles just for `body`.

Why it matters here:
Global CSS often gives `html` and `body` shared baseline layout behavior, then
adds visual defaults only to `body`. You need to know which declarations are
shared and which ones are overridden later.

Tiny example:
If both rules set `overflow-x`, the `body { ... }` value wins for `body`
because it targets the same element more specifically. The `html` element still
keeps the value from `html, body { ... }`.
