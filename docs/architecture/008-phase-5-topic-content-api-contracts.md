# Phase 5 Topic And Content API Contracts

## Purpose

Capture the public API contract for Phase 5 so implementation can proceed without
guessing on routes, payload shape, relationship loading, or publication rules.

This document defines the target endpoint contracts for Phase 5 as a whole.
It does not require Phase 5.1 controller-baseline work to immediately return the
final shaped payloads described below.

Phase 5.1 is allowed to:

- introduce controllers and route wiring
- connect controllers to the existing service layer
- enforce baseline public/not-found behavior
- return persistence-shaped data temporarily while later Phase 5 tasks implement final response shaping

Phase 5.2 through Phase 5.4 are responsible for aligning runtime payloads with the
target contracts in this document.

This document should define:

- which public endpoints exist in Phase 5
- what each endpoint returns
- what related content is included vs excluded
- where response shaping should live
- which concerns are explicitly deferred to later phases

This document should not define:

- frontend page behavior
- Event APIs
- admin/editorial write APIs
- search, filtering, or pagination beyond approved Phase 5 scope

---

## Scope

### In Scope

- public read APIs for Topics
- public read APIs for Articles
- public read APIs for Actions
- published-content visibility rules
- relationship data needed for Phase 6 discovery UI

### Out Of Scope

- Event read APIs
- submission APIs
- moderation workflows
- admin CRUD
- authentication/authorization
- search
- advanced filtering
- pagination, unless explicitly approved for Phase 5

---

## Goals

- [ ] Define the Phase 5 public endpoint list
- [ ] Define route structure for each endpoint
- [ ] Define response shape for each endpoint
- [ ] Define relationship inclusion rules
- [ ] Define not-found and unpublished-content behavior
- [ ] Define controller/service/repository response-shaping boundaries

---

## Route Inventory

List every Phase 5 endpoint here.

| Domain  | Method | Route             | Purpose                                                               | Status   |
| ------- | ------ | ----------------- | --------------------------------------------------------------------- | -------- |
| Topic   | `GET`  | `/topics`         | Return the public list of seeded topics for topic discovery.          | Proposed |
| Topic   | `GET`  | `/topics/:slug`   | Return one topic plus related published article and action summaries. | Proposed |
| Article | `GET`  | `/articles`       | Return the public list of published articles for top-level discovery. | Proposed |
| Article | `GET`  | `/articles/:slug` | Return one published article plus related topic and action summaries. | Proposed |
| Action  | `GET`  | `/actions`        | Return the public list of published actions for top-level discovery.  | Proposed |
| Action  | `GET`  | `/actions/:slug`  | Return one published action plus related topic and article summaries. | Proposed |

Decisions:

- These are the complete Phase 5 public routes.
- Slug routes are sufficient for all public reads in this phase.
- Phase 5 includes collection routes for `/topics`, `/articles`, and `/actions`.

---

## Route Contract Template

The following sections describe the intended steady-state response contracts for
Phase 5 routes after the route-specific tasks in Phase 5.2 through Phase 5.4 are complete.

### `GET /topics`

#### Purpose

Return the public list of topics that serve as the primary discovery entry point.

#### Inputs

- Path params:
  - none
- Query params:
  - none in Phase 5

#### Success Response

Status: `200 OK`

```json
{
  "items": [
    {
      "id": 1,
      "slug": "climate",
      "name": "Climate",
      "description": "Issues related to climate change and environmental policy."
    }
  ]
}
```

#### Response Rules

- Includes topic summary fields only
- Does not include related articles, actions, or counts in Phase 5
- Ordering may be implementation-defined in Phase 5 unless explicitly documented later

#### Failure Behavior

- `400 Bad Request`: not applicable for the Phase 5 contract

#### Notes

- `/topics`, `/articles`, and `/actions` are the Phase 5 collection routes

---

### `GET /topics/:slug`

#### Purpose

Return one public topic plus its related published article and action summaries.

#### Inputs

- Path params:
  - `slug`
- Query params:
  - none in Phase 5

#### Success Response

Status: `200 OK`

```json
{
  "id": 1,
  "slug": "climate",
  "name": "Climate",
  "description": "Issues related to climate change and environmental policy.",
  "articles": [
    {
      "id": 10,
      "slug": "how-local-climate-policy-works",
      "title": "How Local Climate Policy Works",
      "summary": "A guide to city-level climate policy.",
      "publishedAt": "2026-03-10T00:00:00.000Z"
    }
  ],
  "actions": [
    {
      "id": 25,
      "slug": "contact-city-council-about-transit",
      "title": "Contact City Council About Transit",
      "summary": "Ask local officials to expand public transit funding.",
      "actionType": "CONTACT",
      "publishedAt": "2026-03-12T00:00:00.000Z"
    }
  ]
}
```

#### Response Rules

- Includes core topic fields plus nested article and action summary arrays
- Nested related content must be published-only
- Nested content uses summary payloads only, not full article bodies or full action descriptions
- Events are excluded from Phase 5 topic detail even though Topics may relate to Events in the data model

#### Failure Behavior

- `404 Not Found`: topic slug does not exist
- `400 Bad Request`: not applicable for the Phase 5 contract

#### Notes

- This route satisfies the topic-detail and cross-linking needs for Phase 5 and Phase 6

---

### `GET /articles`

#### Purpose

Return the public list of published articles for top-level article discovery.

#### Inputs

- Path params:
  - none
- Query params:
  - none in Phase 5

#### Success Response

Status: `200 OK`

```json
{
  "items": [
    {
      "id": 10,
      "slug": "how-local-climate-policy-works",
      "title": "How Local Climate Policy Works",
      "summary": "A guide to city-level climate policy.",
      "publishedAt": "2026-03-10T00:00:00.000Z"
    }
  ]
}
```

#### Response Rules

- Includes article summary fields only
- Returns published articles only
- Ordered by `publishedAt` descending in Phase 5
- Does not include related Topics or Actions in the collection response

#### Failure Behavior

- `400 Bad Request`: not applicable for the Phase 5 contract

---

### `GET /articles/:slug`

#### Purpose

Return one published article plus the related topic and action summaries needed for discovery.

#### Inputs

- Path params:
  - `slug`
- Query params:
  - none in Phase 5

#### Success Response

Status: `200 OK`

```json
{
  "id": 10,
  "slug": "how-local-climate-policy-works",
  "title": "How Local Climate Policy Works",
  "summary": "A guide to city-level climate policy.",
  "author": "SignalFire Staff",
  "content": "Full article body...",
  "publishedAt": "2026-03-10T00:00:00.000Z",
  "updatedAt": "2026-03-12T00:00:00.000Z",
  "topics": [
    {
      "id": 1,
      "slug": "climate",
      "name": "Climate",
      "description": "Issues related to climate change and environmental policy."
    }
  ],
  "actions": [
    {
      "id": 25,
      "slug": "contact-city-council-about-transit",
      "title": "Contact City Council About Transit",
      "summary": "Ask local officials to expand public transit funding.",
      "actionType": "CONTACT",
      "publishedAt": "2026-03-12T00:00:00.000Z"
    }
  ]
}
```

#### Response Rules

- Includes full article content for the requested article
- Includes the article author for display in the public UI
- Includes related topic summaries and action summaries
- Excludes Events in Phase 5
- Only published articles are retrievable through this public route
- Nested related actions must also be published-only

#### Failure Behavior

- `404 Not Found`: article slug does not exist or article is not published
- `400 Bad Request`: not applicable for the Phase 5 contract

#### Notes

- Public clients should not be able to distinguish missing from unpublished article detail in Phase 5

---

### `GET /actions/:slug`

#### Purpose

Return one published action plus the related topic and article summaries needed for discovery.

#### Inputs

- Path params:
  - `slug`
- Query params:
  - none in Phase 5

#### Success Response

Status: `200 OK`

```json
{
  "id": 25,
  "slug": "contact-city-council-about-transit",
  "title": "Contact City Council About Transit",
  "summary": "Ask local officials to expand public transit funding.",
  "description": "Call or email your local council member and ask for transit investment.",
  "actionType": "CONTACT",
  "publishedAt": "2026-03-12T00:00:00.000Z",
  "updatedAt": "2026-03-12T00:00:00.000Z",
  "topics": [
    {
      "id": 1,
      "slug": "climate",
      "name": "Climate",
      "description": "Issues related to climate change and environmental policy."
    }
  ],
  "articles": [
    {
      "id": 10,
      "slug": "how-local-climate-policy-works",
      "title": "How Local Climate Policy Works",
      "summary": "A guide to city-level climate policy.",
      "publishedAt": "2026-03-10T00:00:00.000Z"
    }
  ]
}
```

#### Response Rules

- Includes full action detail for the requested action
- Includes related topic summaries and article summaries
- Excludes Events in Phase 5
- Only published actions are retrievable through this public route
- Nested related articles must also be published-only

#### Failure Behavior

- `404 Not Found`: action slug does not exist or action is not published
- `400 Bad Request`: not applicable for the Phase 5 contract

#### Notes

- `actionType` is returned as the persisted enum value in Phase 5

---

### `GET /actions`

#### Purpose

Return the public list of published actions for top-level action discovery.

#### Inputs

- Path params:
  - none
- Query params:
  - none in Phase 5

#### Success Response

Status: `200 OK`

```json
{
  "items": [
    {
      "id": 25,
      "slug": "contact-city-council-about-transit",
      "title": "Contact City Council About Transit",
      "summary": "Ask local officials to expand public transit funding.",
      "actionType": "CONTACT",
      "publishedAt": "2026-03-12T00:00:00.000Z"
    }
  ]
}
```

#### Response Rules

- Includes action summary fields only
- Returns published actions only
- Ordered by `publishedAt` descending in Phase 5
- Does not include related Topics or Articles in the collection response

#### Failure Behavior

- `400 Bad Request`: not applicable for the Phase 5 contract

---

## Domain Response Shapes

Define the canonical response shape for each public entity in Phase 5.

### Topic Summary

Purpose:
Used in list responses and nested related-content payloads.

Fields:

- `id`
- `slug`
- `name`
- `description`

Decisions:

- `id` remains exposed in Phase 5 because it is already part of the current persistence shape and may support internal linking or UI keys
- relationship counts are excluded in Phase 5

---

### Topic Detail

Purpose:
Used in the topic detail endpoint.

Fields:

- core topic fields: `id`, `slug`, `name`, `description`
- related articles shape: `Article Summary[]`
- related actions shape: `Action Summary[]`

Decisions:

- related content is embedded in topic detail
- related content uses summary payloads only
- Events are excluded entirely from Phase 5 topic responses

---

### Article Summary

Purpose:
Used in article collection responses and when an Article appears as related content inside another response.

Fields:

- `id`
- `slug`
- `title`
- `summary`
- `publishedAt`

Decisions:

- `publishedAt` is included in article summaries

---

### Article List Response

Purpose:
Used in the article collection endpoint.

Fields:

- `items: Article Summary[]`

Item shape:

- `id`
- `slug`
- `title`
- `summary`
- `publishedAt`

Decisions:

- article collection responses reuse the same `Article Summary` shape used in nested related content
- collection items do not include full article content, author, topics, or actions

---

### Article Detail

Purpose:
Used in the article detail endpoint.

Fields:

- core article fields: `id`, `slug`, `title`, `summary`, `author`, `content`, `publishedAt`, `updatedAt`
- related topics shape: `Topic Summary[]`
- related actions shape: `Action Summary[]`

Decisions:

- full article `content` is returned directly from this endpoint
- unpublished articles resolve as `404` on the public route

---

### Action Summary

Purpose:
Used in action collection responses and when an Action appears as related content inside another response.

Fields:

- `id`
- `slug`
- `title`
- `summary`
- `actionType`
- `publishedAt`

Decisions:

- action summaries include `actionType` because it is useful for discovery UI labeling
- action summaries include `publishedAt` so publication metadata is consistent across public action responses

---

### Action List Response

Purpose:
Used in the action collection endpoint.

Fields:

- `items: Action Summary[]`

Item shape:

- `id`
- `slug`
- `title`
- `summary`
- `actionType`
- `publishedAt`

Decisions:

- action collection responses reuse the same `Action Summary` shape used in nested related content
- collection items do not include full action descriptions, topics, or articles

---

### Action Detail

Purpose:
Used in the action detail endpoint.

Fields:

- core action fields: `id`, `slug`, `title`, `summary`, `description`, `actionType`, `publishedAt`, `updatedAt`
- related topics shape: `Topic Summary[]`
- related articles shape: `Article Summary[]`

Decisions:

- `actionType` is exposed as the persisted enum value in Phase 5
- `publishedAt` is exposed on action detail for consistent public publication metadata

---

## Relationship Inclusion Rules

Define what relationship data is included on each endpoint.

| Endpoint          | Include Topics | Include Articles | Include Actions | Notes                                    |
| ----------------- | -------------- | ---------------- | --------------- | ---------------------------------------- |
| `/topics`         | no             | no               | no              | direct topic summaries only              |
| `/topics/:slug`   | no             | yes              | yes             | nested article and action summaries only |
| `/articles`       | no             | no               | no              | direct article summaries only            |
| `/articles/:slug` | yes            | no               | yes             | nested topic and action summaries only   |
| `/actions`        | no             | no               | no              | direct action summaries only             |
| `/actions/:slug`  | yes            | yes              | no              | nested topic and article summaries only  |

Decisions:

- Detail endpoints return nested related entities
- Collection endpoints return direct entity fields only
- Nested payload depth stops at one level of summary objects; nested summaries do not recursively include their own relationships

---

## Publication And Visibility Rules

Define the public visibility policy for Phase 5.

Baseline assumptions:

- public Phase 5 endpoints should not expose draft content
- related content should follow the same published-only rule unless explicitly documented otherwise

Decisions:

- Direct entity lookup behavior for unpublished content: public detail routes resolve as `404`
- Related entity inclusion rule for unpublished content: unpublished related content is excluded from nested arrays
- Not-found behavior for missing slug: resolve as `404`

Additional rule:

- Missing and unpublished detail resources are intentionally indistinguishable on public routes in Phase 5

---

## Boundary Decisions

Define where logic should live.

For Phase 5, "response shaping" means building the final API response object returned to
the client, including:

- selecting which fields are exposed publicly
- embedding related summary arrays
- excluding fields that belong only to persistence or internal implementation
- keeping nested related resources at summary depth rather than full-detail depth

### Controllers

Responsibilities:

- map HTTP routes to service use cases
- validate and pass route params
- translate service `null` results into `404` responses
- return already-shaped response DTOs or response objects

Should not:

- compose Prisma queries directly
- coordinate multi-repository relationship loading
- own publication filtering rules

### Services

Responsibilities:

- expose Phase 5 use-case methods for topic list/detail and article/action detail
- assemble cross-entity detail payloads when one endpoint requires multiple domain reads
- enforce public published-only read behavior before data reaches controllers

Should not:

- perform HTTP-specific exception mapping beyond returning absence to controllers if that pattern is used
- contain raw Prisma query composition that belongs in repositories

### Repositories

Responsibilities:

- own Prisma queries for entity and relationship reads
- keep published filtering explicit in repository method naming
- return entity-shaped results needed by Phase 5 service orchestration

Should not:

- assemble full multi-entity endpoint payloads
- own HTTP concerns
- introduce generic repository abstractions for this phase

Decisions:

- services assemble cross-entity detail payloads
- repositories remain entity-owned even when one endpoint returns multiple related resource types

Example application of this rule:

- repositories fetch entity and relationship data using Prisma
- services combine those results into the final Phase 5 response shape
- controllers return that shaped result and translate missing resources into `404`

---

## Error Handling

Document the baseline error contract for public endpoints.

Decisions:

- What should a not-found response body look like? Nest default `404` response shape is acceptable in Phase 5.
- Should invalid slugs produce `400` or just `404`? Slugs should resolve as `404` unless route validation later introduces a stricter format rule.
- Do we need a consistent error shape in Phase 5, or is Nest default behavior acceptable for now? Nest default behavior is acceptable for this phase.

---

## Testing Expectations

Define the minimum test coverage required before Phase 5 can be considered complete.

### Controller/API Coverage

- [ ] success cases for each endpoint
- [ ] not-found cases for slug detail endpoints
- [ ] unpublished-content filtering behavior
- [ ] relationship payload behavior

### Phase 5.7 Handoff Assessment

This section records which Phase 5.7 non-code checklist items can be closed from
the current documented contract and existing test evidence, and which items must
remain open.

#### Closed: coherent discovery graph for Phase 6 UI consumption

Status: Closed

Decision drivers:

- The Phase 5 route inventory defines a complete public discovery surface for
  Phase 6: `/topics`, `/topics/:slug`, `/articles`, `/articles/:slug`,
  `/actions`, and `/actions/:slug`.
- Relationship inclusion rules create a one-level discovery graph across the
  three Phase 5 domains:
  - topic detail includes related article and action summaries
  - article detail includes related topic and action summaries
  - action detail includes related topic and article summaries
- This aligns with the active product model and Release 1 scope:
  - Topics are first-class discovery pages
  - Actions are the platform center
  - Events remain excluded from Phase 5 and deferred to Phase 7
- Existing evidence in route and integration tests confirms those paths are
  implemented and shaped as expected:
  - `apps/api/src/topic/topic.controller.route.spec.ts`
  - `apps/api/src/article/article.controller.route.spec.ts`
  - `apps/api/src/action/action.controller.route.spec.ts`
  - `apps/api/test/topic/topic.service.intg-spec.ts`
  - `apps/api/test/article/article.service.intg-spec.ts`
  - `apps/api/test/action/action.service.intg-spec.ts`

Reason for closure:

- Phase 6 needs predictable public navigation and cross-linking, not deeper
  recursive relationship graphs.
- The current contract provides the required entry points and summary-level
  relationship payloads without expanding scope into Events, search, or
  pagination.

#### Closed: publication rules consistently apply across direct and related content

Status: Closed

Decision drivers:

- The publication rules section already defines the intended public visibility
  policy:
  - unpublished detail resources resolve as `404`
  - unpublished related resources are excluded from nested arrays
  - missing and unpublished public detail resources are intentionally
    indistinguishable
- Existing route specs verify public detail `404` behavior for missing and
  unpublished Article and Action routes.
- Existing integration specs verify published-only filtering for:
  - article and action collection routes
  - topic nested article/action relationships
  - article nested action relationships
  - action nested article relationships

Reason for closure:

- The documented policy and current test evidence agree on the core public
  visibility model for all Phase 5 domains.
- No additional non-code clarification is needed before Phase 6 consumes these
  APIs.

#### Closed: final endpoint contracts, relationship behavior, and known deferrals documented

Status: Closed

Decision drivers:

- This document now serves as the canonical Phase 5 handoff artifact covering:
  - final route inventory
  - route-by-route response contracts
  - relationship inclusion rules
  - publication and visibility rules
  - boundary decisions
  - testing expectations
  - phase deferrals
- The contract stays inside the approved Phase 5 boundary and matches the
  governance docs that prevent scope expansion into Event APIs, admin CRUD,
  search, filtering, or pagination.

Reason for closure:

- Downstream Phase 6 UI work has enough contract detail to proceed without
  reinterpreting payload shape or relationship behavior.

#### Open: add or refine integration/e2e coverage for the final Phase 5 endpoint set

Status: Open

Why it remains open:

- Current coverage is split between controller-route specs and service
  integration specs, but there is no end-to-end verification for the final
  Phase 5 route set through the full Nest application.
- The only current e2e spec is `apps/api/test/app.e2e-spec.ts`, which exercises
  the root app route only.

What still needs to be added:

- Add Phase 5 API e2e coverage for all public routes:
  - `GET /topics`
  - `GET /topics/:slug`
  - `GET /articles`
  - `GET /articles/:slug`
  - `GET /actions`
  - `GET /actions/:slug`
- Run those tests against the real `AppModule` with the standard test app boot
  path rather than isolated controller-only modules.
- Use seeded or fixture-created data that exercises both direct entities and
  related entities in the same run.
- Assert the final HTTP contract, not just service return values:
  - collection payload shape
  - detail payload shape
  - `404` behavior for missing resources
  - `404` behavior for unpublished article/action detail
  - published-only nested relationship filtering on topic, article, and action
    detail routes
  - article/action collection ordering by newest `publishedAt` first
- Prefer one discovery-graph scenario that validates cross-link coherence in
  HTTP responses:
  - a topic exposing published article and action summaries
  - an article exposing related published topics and actions
  - an action exposing related published topics and articles

Recommended minimum spec split:

- one e2e spec for Topic routes
- one e2e spec for Article routes
- one e2e spec for Action routes

#### Open: update phase status and notes when all Phase 5 tasks are complete

Status: Open

Why it remains open:

- Phase 5.7 still has unfinished test work.
- The phase cannot be marked complete while the final integration/e2e coverage
  task remains open.

### Out Of Scope For This Phase

- load/performance testing
- consumer contract tooling
- search/filter matrix coverage

---

## Deferrals

Record anything intentionally left for later phases.

- Event-related read contracts and payloads
- Pagination, sorting, and filtering contracts
- Search-oriented API surfaces
- Custom error envelope standardization
- DTO versioning or external contract tooling

---

## Implementation Notes

Use this section to capture short implementation constraints once decisions are made.

- Existing Phase 3 repository methods for relationship lookups may remain as service composition helpers without implying additional public routes.
- Topic detail will likely require `TopicService` orchestration across `ArticleService` and `ActionService`, or equivalent direct service-level composition.
- Article and Action detail responses may require new repository methods for loading related Topics because current Phase 3 services are stronger on article/action relationship lookups than reverse topic lookups for detail payload assembly.
