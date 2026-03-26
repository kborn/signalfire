# Collection Vs Detail API Shapes

Collection endpoints usually return summary items for many records, while detail
endpoints usually return one record with more fields or related content.

Why it matters here:
In Phase 6.2, `GET /topics` returns `{ items: TopicSummary[] }`, but
`GET /topics/:slug` returns one topic with embedded related article and action
summaries.

Rule of thumb:
Do not force collection and detail pages through one identical rendering model;
start from the real contract each route returns.
