# ARIA Current And Active Nav

`aria-current="page"` is an accessibility attribute that marks the link for the
page the user is currently on.

Why it matters here:
Phase 9.1 wants the active nav state to be semantic as well as visual. That
means the current link should tell assistive technology "this is the current
page" and also be available for CSS styling.

Tiny example:
If the current route is `/topics`, the Topics link can render as
`<a href="/topics" aria-current="page">Topics</a>`, and CSS can target it with
`.site-nav a[aria-current='page']`.

Rule of thumb:
`"page"` is not a made-up string for this repo. It is a standardized ARIA value,
so use it for its semantic meaning first and then match that same real value in
CSS.
