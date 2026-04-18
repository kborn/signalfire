# React Component Props Are One Object

A React component receives one props object, not multiple JSX attributes as
separate function arguments.

Why it matters here:

If you render `<ArticleSubmissionForm topics={topics.items} />`, the component
should accept something shaped like `{ topics: TopicSummary[] }`, not
`TopicSummary[]` directly.

Tiny example:

- JSX: `<Example count={3} />`
- component: `function Example({ count }: { count: number }) {}`

Rule of thumb:

- when JSX passes named attributes, your component parameter should usually be
  a props object that you destructure
