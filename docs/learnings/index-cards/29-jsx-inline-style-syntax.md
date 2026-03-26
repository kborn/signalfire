# JSX Inline Style Syntax

In JSX, inline styles are passed through the `style` prop as a JavaScript
object, not as raw CSS text.

Why it matters here:
When styling a small element in Phase 6 UI, `<p padding-left: 1rem;>` is not
valid JSX. The correct form is `style={{ paddingLeft: '1rem' }}`.

Rule of thumb:
Use `style={{ ... }}` for inline styles, camelCase the property name, and pass
CSS values as strings when needed.
