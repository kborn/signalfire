# JSX Uppercase Means Component

In JSX, capitalized tags mean "render a React component," while lowercase tags
mean "render an HTML element."

Why it matters here:
`<MarkdownContent />` works because `MarkdownContent` is a component function. If you
wrote `<markdownContent />`, React would treat it like a DOM/custom element tag
instead of calling your component.

Rule of thumb:

- `div`, `section`, `p`: built-in HTML elements
- `MarkdownContent`, `ReactMarkdown`: React components
- component functions should use PascalCase so JSX can recognize them
