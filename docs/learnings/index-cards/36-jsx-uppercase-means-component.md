# JSX Uppercase Means Component

In JSX, capitalized tags mean "render a React component," while lowercase tags
mean "render an HTML element."

Why it matters here:
`<ArticleBody />` works because `ArticleBody` is a component function. If you
wrote `<articleBody />`, React would treat it like a DOM/custom element tag
instead of calling your component.

Rule of thumb:

- `div`, `section`, `p`: built-in HTML elements
- `ArticleBody`, `ReactMarkdown`: React components
- component functions should use PascalCase so JSX can recognize them
