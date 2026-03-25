# Semantic HTML Page Structure

Tags like `header`, `nav`, `main`, and `section` describe what a part of the
page is for, not just how it looks.

Why it matters here:
Phase 6.1 is easier to reason about when `layout.tsx` uses semantic structure
for the shared shell and `page.tsx` focuses on route content.

Rule of thumb:
Use the most specific meaningful tag that fits. Reach for `div` only when you
just need a generic container.
