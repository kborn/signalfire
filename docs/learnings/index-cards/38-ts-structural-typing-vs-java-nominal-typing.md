# TS Structural Typing Vs Java Nominal Typing

TypeScript usually accepts a value based on whether it has the required fields,
while Java usually cares whether the value was declared as a specific class or
interface type.

Why it matters here:
A component like `TopicSummary` can accept a small shared shape such as
`{ slug, name, description }` and then work with topic objects coming from
different API response types, as long as each object has those fields.

Rule of thumb:
In TypeScript, ask "does this object have the shape I need?" before asking
"what exact named type did this come from?"
