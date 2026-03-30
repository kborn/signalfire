# Phase 8 — Event Detail Page

## Goal

Enable users to evaluate a single event by clearly showing:

- what it is
- when it happens
- where it happens
- what related topic/article/action context is available

---

## Route

`/events/[id]`

---

## Data Contract (assumed)

The page consumes the existing Event detail API response. The Event detail
endpoint remains unchanged under the current Phase 8 direction.

UI-consumed fields:

- `title`
- `summary`
- `description`
- `eventType`
- `startTime`
- `endTime`
- `locationName`
- `addressRaw`
- `city`
- `region`
- `topics`
- `articles`
- `actions`

Available but not required for the initial Phase 8 UI:

- `postalCode`
- `country`
- `publishedAt`
- `updatedAt`

---

## Page Structure

### 1. Header

Display:

- event title
- short summary

---

### 2. Event Info

Display prominently:

- start date/time
- end date/time
- location name
- address
- city and region
- event type

This section should be easy to scan.

---

### 3. Description

Display full event description.

---

### 4. Related Topics

Section title: `Related Topics`

- list related topics
- each topic links to `/topics/[slug]`

---

### 5. Learn More

Section title: `Learn More`

- list related articles
- each article links to `/articles/[slug]`

---

### 6. Take Action

Section title: `Take Action`

- list related actions
- each action links to `/actions/[slug]`

---

## Interaction

Supported:

- click topic
- click article
- click action

Not supported:

- RSVP
- save event
- share event
- comments
- attendance tracking

---

## Empty / Missing Related Content

If a related section is empty, omit the section entirely.

Do not render empty placeholders for:

- topics
- articles
- actions

---

## Out of Scope

- maps
- calendar export
- directions integration
- social sharing
- contact/organizer workflows
- related events
- moderation metadata

---

## Notes

- The page should prioritize clarity of time and place over visual polish
- Phase 8 should remain text-first and structurally simple
- UI polish belongs to Phase 9
- Location search/discovery improvements belong to Phase 13
- Missing or unpublished Events should follow the existing backend contract and resolve as not found
- Phase 8 Event API changes are limited to the Events list contract, not Event detail

---

## Definition of Done

- [ ] `/events/[id]` route implemented
- [ ] event title and summary rendered
- [ ] date/time and location rendered prominently
- [ ] full description rendered
- [ ] related topic/article/action sections rendered when present
- [ ] related links navigate correctly
- [ ] empty related sections are omitted
- [ ] missing or unpublished Events render the agreed not-found state
