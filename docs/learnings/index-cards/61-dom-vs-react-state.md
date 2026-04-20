# DOM Vs React State

The DOM is the browser's in-memory representation of the current page, while
React state is the component's remembered data that can drive what the page
shows.

Why it matters here:

In Phase 10.4 forms, you usually want React state to own the current field
values so validation, submit errors, pending state, and success behavior all
work predictably.

Tiny example:

- DOM-only idea: the browser input box visually contains `"Hello"`
- React-state idea: `title === "Hello"` and the input displays `title`

Rule of thumb:

- if the value must affect form logic, let React state own it instead of
  relying on the DOM as the only place that remembers it
