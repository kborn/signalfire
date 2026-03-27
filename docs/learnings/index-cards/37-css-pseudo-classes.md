# CSS Pseudo-Classes

A selector like `.primaryCTA:hover` applies styles to the same element class,
but only when that element is in a specific state such as hover, focus, or active.

Why it matters here:
In Phase 6 UI work, you will often define a base class like `.primaryCTA` in
`globals.css` and then add state-specific rules like `.primaryCTA:hover`
without changing the JSX beyond `className="primaryCTA"`.

Rule of thumb:
Use `.className` for the default appearance, then add selectors like
`.className:hover`, `.className:focus-visible`, or `.className:active` for
state-specific behavior that the browser applies automatically.
