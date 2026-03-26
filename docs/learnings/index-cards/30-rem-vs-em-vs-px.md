# rem Vs em Vs px

`px` is a fixed CSS pixel unit, `rem` is relative to the root font size, and
`em` is relative to the current element's font size.

Why it matters here:
In Phase 6 UI, spacing and typography often feel easier to scale with `rem`,
while `px` is useful for small fixed details and `em` is useful when spacing
should grow with a component's own text size.

Rule of thumb:
Use `rem` for most layout spacing and font sizing, use `px` for small precise
details, and use `em` when a value should scale with the element itself.
