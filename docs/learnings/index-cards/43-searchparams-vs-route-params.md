# `searchParams` vs route params

`[slug]` is for path identity, while `searchParams` is for optional collection state.

## Why it matters here

Phase 8.2 uses `/events?topicSlug=<slug>`, so the Event filter belongs on the
collection page instead of creating a new dynamic route just for the filter.

## Tiny example or rule of thumb

- `/topics/climate` -> route param from `[slug]`
- `/events?topicSlug=climate` -> query state from `searchParams`

Rule of thumb:
If the value changes which record you are viewing, it is usually a route param.
If the value changes how a collection is filtered or presented, it is usually
query state.
