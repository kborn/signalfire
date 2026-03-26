# Triple Equals Vs Double Equals

`===` checks strict equality without type coercion, while `==` allows JavaScript
to coerce values before comparing them.

Why it matters here:
In this codebase, you usually want predictable comparisons, so `===` is the
normal operator to use for checks like `error.status === 404`.

Rule of thumb:
Use `===` and `!==` by default; avoid `==` and `!=` unless you intentionally
want JavaScript's type coercion behavior.
