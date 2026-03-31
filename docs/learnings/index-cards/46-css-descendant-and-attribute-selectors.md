# CSS Descendant And Attribute Selectors

A selector like `.site-nav a[aria-current='page']` targets anchor elements inside
`.site-nav`, but only when they also have a matching HTML attribute.

Why it matters here:
Phase 9.1 nav styling uses more than simple class selectors. You need to read
`.site-nav a`, `.site-nav a:hover`, and `.site-nav a[aria-current='page']` as
"which element is being targeted" plus "which state or attribute narrows the match."

Tiny example:
`.site-nav a` means "all links inside the nav." Adding `[aria-current='page']`
means "only the current-page link inside that nav."
