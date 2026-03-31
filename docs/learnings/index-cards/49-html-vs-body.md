# HTML Vs Body

`html` is the root document element, while `body` is the main page content area
inside it.

Why it matters here:
Global CSS often sets document-level behavior on `html` and page-level visual
defaults on `body`. Knowing the difference makes rules like `html, body { ... }`
much easier to read.

Tiny example:
Use `body` for text color, font, and page background defaults. Use `html` when
you need document-level behavior that sits above the body in the page tree.
