# CSS Class Selectors

A rule like `.site-header { padding: 24px 0; }` is a CSS class selector with a
declaration block that applies styles to any element using that class name.

Why it matters here:
Phase 6.1 layout styling will mostly come from simple shared classes added in
`globals.css` and referenced from JSX with `className`.

Tiny example:
Define `.site-header` in CSS, then use `<header className="site-header">` in
`layout.tsx` to apply that shared style to the header element.
