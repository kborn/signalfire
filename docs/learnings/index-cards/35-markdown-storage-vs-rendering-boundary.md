# Markdown Storage Vs Rendering Boundary

Store article content as Markdown source, then render it at the display
boundary with a Markdown library such as `react-markdown`.

Why it matters here:
`/articles/[slug]` should fetch article text from the API, but the web app
should decide how to turn that text into headings, lists, links, and
paragraphs.

Rule of thumb:

- database/API: text source
- markdown-content component: `react-markdown` render step
- CSS: presentation of the rendered output
