# Phase 8 --- Events Index Page

## Goal

Enable users to:

- browse Events on the public Events surface
- view basic Event info (what, when, where)
- optionally view Events filtered by topic using URL query state

This document records the original Phase 8 baseline. Phase 12 later refines the
public `/events` experience into a filter-led finder flow; when these documents
conflict, the later Phase 12 spec and decisions control current behavior.

---

## Route

/events

Optional query params:

/events?topicSlug=`<slug>`{=html}\

---

## Data Contract (assumed)

- The page consumes the simplified public Event collection API response
- The collection returns upcoming published Events by default, covering roughly
  now through the next three months
- Optional public filter:
  - `topicSlug`
- Event collections are ordered by:
  - `startTime` ascending
  - `id` ascending as a tie-breaker
- UI-consumed fields per Event:
  - `id`
  - `title`
  - `summary`
  - `startTime`
  - `region`
  - `eventType`
- Available but not required for the initial Phase 8 list UI:
  - `endTime`
  - `city`
  - `postalCode`
  - `country`
- The public contract does not require `region`, `startDate`, or `endDate`
  inputs

---

## Page Structure

### 1. Header

- Title: Events
- Optional subtitle:
  - "Find upcoming events to participate in"

---

### 2. Optional Context Banner

Only if query param present:

- Topic: Events related to `<Topic>`{=html}

---

### 3. Event List (primary content)

Simple vertical list.

Each item:

Event Title\
Short summary\
Date/Time • Region

Optional: - event type (small label)

---

## Interaction

### Click event

Routes to:

/events/\[id\]

---

## Filtering (Phase 8 scope)

### Supported

- Topic via `topicSlug`

---

### Not Supported (no UI controls yet)

- No filter UI
- No search input
- No location picker
- No map
- No sorting controls

---

## Empty States

- No events: No upcoming events found

- With topic: No events found for this topic

---

## Out of Scope

- pagination
- infinite scroll
- maps
- radius search
- user location detection
- advanced filtering UI

---

## Notes

- This is a read-only discovery surface
- Location intelligence deferred to Phase 12
- UI intentionally minimal
- Topic-related Event discovery in Phase 8 belongs on `/events`, not on Topic detail pages
- Topic pages may link into `/events?topicSlug=<slug>` as passthrough navigation without changing Topic API payloads
- That Topic-page passthrough is integration behavior for the Events surface, not a separate Topic-page spec

---

## Definition of Done

- [ ] /events route implemented
- [ ] Events rendered as list
- [ ] Ordering matches API contract
- [ ] Default upcoming-event behavior is respected without requiring region/date inputs
- [ ] Query params respected (`topicSlug` only)
- [ ] Event click navigates to detail page
- [ ] Empty states implemented
