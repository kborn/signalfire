# Div vs Section vs Main

`main` is for the page's primary content area, `section` is for a meaningful
chunk inside that content, and `div` is a generic container.

Why it matters here:
The starter homepage currently acts like it owns the full page, but in Phase
6.1 the shared layout should usually own the main page shell.

Tiny example:
`layout.tsx` can render `<main>{children}</main>`, while `page.tsx` can return
`<section><h1>SignalFire</h1></section>` inside that shared main area.
