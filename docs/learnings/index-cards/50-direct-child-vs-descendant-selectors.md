# Direct Child Vs Descendant Selectors

A selector like `.home-cta-group > *` targets only direct children, while
`.home-cta-group *` targets any nested descendant inside the container.

Why it matters here:
This distinction controls whether a CSS rule affects just the first layer of a
layout group or everything nested inside it. That is often the difference
between a clean layout rule and accidentally styling too much.

Tiny example:
Use `.parent > *` when you mean "only the immediate children of this wrapper."
Use `.parent *` when you mean "anything anywhere inside this wrapper."
