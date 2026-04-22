# Practical Debugging With console.dir And JSON.stringify

Use plain `console.log(...)`, `console.dir(...)`, and `JSON.stringify(...)`
before reaching for a formal logger when you are just trying to understand what
the code is doing.

Why it matters here:

In Phase 10.4, you often need to answer small debugging questions such as:

- did this submit handler run?
- what exact payload am I sending?
- what did the API error body actually contain?

Tiny examples:

- branch check: `console.log('entered submission catch')`
- nested object: `console.dir(error, { depth: null })`
- exact JSON shape: `console.log(JSON.stringify(body, null, 2))`

Rule of thumb:

- log the smallest thing that answers the current question instead of dumping
  one huge object and hoping it is useful
