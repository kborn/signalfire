# Shared Component Variants By Layout Context

When the same entity summary appears in two different page contexts, the data can
stay the same while the presentation changes.

Why it matters here:
Phase 9.3 detail pages need smaller, tighter related-content summaries than the
larger collection-page previews from Phase 9.2. Reusing one component is fine,
but the component needs an explicit layout variant like `collection` or
`related` instead of one hard-coded set of classes.

Rule of thumb:
If the markup shape is mostly the same but the hierarchy, spacing, or heading
level changes by page context, keep one component and make the context explicit
with a prop. If the markup structure itself diverges a lot, split into separate
components.
