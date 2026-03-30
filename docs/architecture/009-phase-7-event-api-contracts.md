# Phase 7 Event API Contracts

## Purpose

Capture the public Event API contract for Phase 7 so repository, service, API,
and downstream UI work all share the same payload, ordering, and relationship
expectations.

This document is the canonical Phase 7.2 contract artifact for:

- Event summary and detail response shapes
- default Event collection ordering
- public Event relationship inclusion rules
- known contract deferrals that remain outside Release 1 Phase 7 scope

This document does not define:

- frontend Event page behavior
- admin/editorial Event write APIs
- submission workflows
- maps, radius search, or geocoding pipelines
- pagination or search

---

## Scope

### In Scope

- public Event list and detail response shapes
- Release 1 public relationship depth for Events
- deterministic ordering rules for Event collections
- publication-aligned payload expectations for direct and relationship-driven
  Event reads

### Out Of Scope

- Event write routes
- recurring-event modeling
- geospatial proximity search
- Event ingestion automation
- pagination
- search

---

## Contract Shapes

These shapes are defined in `@signal-fire/api-contracts` and should be treated
as the runtime target for Phase 7 public responses.

### Event Summary

Used for Event collection payloads.

```json
{
  "id": 101,
  "title": "Downtown Tenant Rights Rally",
  "summary": "A public rally supporting stronger tenant protections.",
  "eventType": "RALLY",
  "startTime": "2026-04-12T17:00:00.000Z",
  "endTime": "2026-04-12T19:00:00.000Z",
  "city": "Philadelphia",
  "region": "PA",
  "postalCode": "19107",
  "country": "USA"
}
```

Summary field set:

- `id`
- `title`
- `summary`
- `eventType`
- `startTime`
- `endTime`
- `city`
- `region`
- `postalCode`
- `country`

Summary exclusions:

- no full `description`
- no full street/location text beyond broad discovery fields
- no `publishedAt` or `updatedAt`
- no nested relationships

### Event Detail

Used for the public Event detail endpoint.

```json
{
  "id": 101,
  "title": "Downtown Tenant Rights Rally",
  "summary": "A public rally supporting stronger tenant protections.",
  "description": "Join local organizers and housing advocates for a rally and speaker program focused on tenant protections.",
  "eventType": "RALLY",
  "startTime": "2026-04-12T17:00:00.000Z",
  "endTime": "2026-04-12T19:00:00.000Z",
  "locationName": "City Hall North Plaza",
  "addressRaw": "1400 John F Kennedy Blvd, Philadelphia, PA 19107",
  "city": "Philadelphia",
  "region": "PA",
  "postalCode": "19107",
  "country": "USA",
  "latitude": null,
  "longitude": null,
  "publishedAt": "2026-04-01T15:00:00.000Z",
  "updatedAt": "2026-04-02T12:00:00.000Z",
  "topics": [],
  "articles": [],
  "actions": []
}
```

Detail field set:

- all Event summary fields
- `description`
- `locationName`
- `addressRaw`
- `latitude`
- `longitude`
- `publishedAt`
- `updatedAt`
- `topics`
- `articles`
- `actions`

Detail exclusions:

- no recursive relationship nesting
- no submission or moderation fields
- no internal persistence fields such as `status` or `createdAt`

---

## Relationship Inclusion Rules

Define what relationship data public Event payloads include in Release 1.

| Endpoint      | Include Topics | Include Articles | Include Actions | Notes                                      |
| ------------- | -------------- | ---------------- | --------------- | ------------------------------------------ |
| `/events`     | no             | no               | no              | collection returns direct Event summaries  |
| `/events/:id` | yes            | yes              | yes             | detail returns one-level related summaries |

Decisions:

- Event collections return direct Event summary fields only
- Event detail returns one level of related Topic, Article, and Action summary
  arrays
- Nested related arrays stop at summary depth and do not recursively include
  their own relationships
- Related content included in Event detail must already fit approved Release 1
  relationships present in the schema:
  - Topics are required discovery relationships for Events
  - Articles and Actions are optional related discovery context

Release 1 exclusions:

- no Event-to-Event related content
- no submission metadata
- no moderation or editorial data
- no computed attendance, distance, or map metadata

---

## Ordering Rules

Define deterministic ordering for public Event results.

### Collection Ordering

Default Event collection ordering is:

1. `startTime` ascending
2. `id` ascending as a deterministic tie-breaker

Rationale:

- Event discovery is time-oriented in a way Article and Action discovery is not;
  upcoming events are more useful than older or later events for public browsing
- `startTime` ascending aligns the API with likely Phase 8 list behavior without
  introducing extra ranking logic
- `id` ascending keeps responses stable when multiple Events share the same
  start time

### Detail Relationship Ordering

Nested `topics`, `articles`, and `actions` arrays inside Event detail should use
the established summary ordering conventions from prior phases:

- `topics`: `id` ascending
- `articles`: `publishedAt` descending, then `id` ascending
- `actions`: `publishedAt` descending, then `id` ascending

Rationale:

- Event detail should remain consistent with the already-documented public
  ordering model for Topic, Article, and Action summaries

---

## Publication And Visibility Rules

Public Event contracts follow the same public-read visibility posture used in
prior phases.

Decisions:

- public Event collection routes return published Events only
- public Event detail routes resolve unpublished or missing Events as `404`
- nested `topics`, `articles`, and `actions` arrays on Event detail exclude
  unpublished related content

Additional note:

- missing and unpublished public Event detail resources are intentionally
  indistinguishable

---

## Boundary Decisions

For Phase 7 public Event reads:

- repositories own Event query composition, filtering, and ordering
- services assemble final detail payloads when Event endpoints require data from
  Topic, Article, and Action repositories
- controllers return shaped contract responses and translate missing published
  resources into `404`

This keeps Event API implementation aligned with the repository/service pattern
already used for Topic, Article, and Action public reads.

Topic-related Event discovery should be handled through the filtered Event
collection surface, for example by linking users from Topic pages into an
`/events` view prefiltered by topic, rather than embedding unfiltered Event
arrays inside Topic detail payloads.

---

## Deferrals

These concerns remain outside the approved Phase 7 contract scope:

- pagination
- free-text search
- radius or bounding-box filtering
- map payloads
- recurring-event series support
- slug-based Event public identifiers
- derived status such as `isUpcoming` or `isPast`
- embedding Event arrays into Topic detail payloads
- Topic-page Event entry points or calls to action, which are deferred to Phase 9
