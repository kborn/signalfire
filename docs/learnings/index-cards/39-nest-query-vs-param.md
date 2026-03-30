# Nest Query Vs Param

Use `@Param(...)` for values that are part of the route path itself, such as
`GET /events/:id` or `GET /topics/:slug`.

Use `@Query(...)` for optional or filter-style inputs that come after `?`, such
as `GET /events?startDate=2025-03-15&region=PA&topicSlug=democracy`.

Why it matters here:
`GET /events` is a collection route. Its filters do not change the route shape;
they narrow the collection being returned. That makes them query parameters, not
path parameters.

Rule of thumb:
If the value identifies which resource path you are on, use `@Param`.
If the value refines or filters the response for the same path, use `@Query`.
