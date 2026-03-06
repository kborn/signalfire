# Architecture Intent

## Purpose

This document records the **architectural intent** for the system before
implementation begins.

It captures high-level agreements that guide development while leaving
implementation details to the Staff Engineer.

---

## System Overview

SignalFire is a civil action platform that organizes civic participation
around **Topics** and connects users to:

- Actions
- Events
- Articles

The platform prioritizes **issue-driven discovery**, helping users
understand a topic and then take meaningful action.

---

## API Style

Chosen approach: **REST JSON API**

Reasons:

- predictable resource structure
- easy integration with frontend frameworks
- straightforward for future ingestion services

Example resource structure:

/api/topics
/api/actions
/api/events
/api/articles
/api/submissions

Pagination and filtering will follow conventional REST patterns.

---

## Event Location Strategy

Events require flexible geographic data to support discovery.

Initial model will store:

- raw address text
- city
- region/state
- country
- optional latitude/longitude

Coordinates may be added during ingestion or geocoding.

Release 1 discovery will primarily support:

- location filtering
- regional browsing

Advanced geospatial features (maps, radius search) are out of scope.

---

## Content Storage Strategy

Articles represent long-form content.

Release 1 approach:

- store content as **Markdown in TEXT fields**
- convert to HTML during rendering

This keeps the model simple while supporting rich formatting.

Content revisions may be introduced in later releases.

---

## Moderation Workflow

User submissions require moderation before publication.

Release 1 moderation states:

- pending
- approved
- rejected

Administrators can:

- review submissions
- edit content
- approve or reject submissions

Actions remain admin-curated.

---

## Ingestion Boundary

Release 1 does not include automated ingestion.

Future ingestion modules may include:

- event crawlers
- external civic APIs
- structured data imports

Ingestion will produce normalized data that flows through the same
validation and moderation pipeline used for submissions.

---

## Architectural Constraints

The architecture should remain simple and adaptable.

Key constraints:

- maintain clear domain boundaries
- avoid premature scaling complexity
- preserve clean API contracts
- ensure ingestion can be added later without schema redesign
