# CSS Media Queries

`@media` is the CSS mechanism for applying rules only when certain conditions
are true, such as screen width, orientation, or print mode.

Why it matters here:
Responsive styling in this repo uses `@media` blocks to change layout and
typography at the small-screen breakpoint. The `@media` part is the conditional
tool; the expression inside it defines the actual condition.

Tiny example:
`@media (max-width: 640px) { ... }` means "apply these rules only when the
viewport is 640px wide or smaller." That is often used for mobile, but `@media`
itself does not mean mobile.
