# React List Keys

A `key` gives React a stable identity for each item in a rendered list so it
can match old items to new items correctly between renders.

Why it matters here:
In Phase 6.2, topic, article, and action summaries are often rendered with
`.map(...)`. Each returned item should use a stable unique key such as `id` on
the outermost element returned for that list item.

Rule of thumb:
Put `key` on the first element returned by `.map(...)`, and prefer stable ids
over array indexes when real ids exist.
