# Release 1 Relationship Matrix
Phase 3 Implementation Contract

## Purpose

This document defines the **allowed and required relationships between core domain entities**
for Release 1 of the platform.

It acts as the **Phase 3 implementation contract** between Product and Engineering to ensure:

- The schema supports required product discovery behavior
- Unnecessary relationship complexity is avoided
- Future extensions remain possible without redesign

This matrix intentionally defines:

- **Required relationships** – must exist in the schema
- **Optional relationships** – may be implemented if helpful
- **Deferred relationships** – intentionally excluded from Release 1

This prevents over-modeling during Phase 3.

---

# Core Entities

The core domain entities are:

- Topic
- Article
- Action
- Event
- Submission

Topics organize the platform’s content.  
Articles provide explanation and context.  
Actions represent concrete civic steps.  
Events represent scheduled participation opportunities.  
Submissions represent pending content awaiting moderation.

---

# Relationship Matrix

Legend:

| Symbol | Meaning |
|------|------|
| **Required** | Must exist for Release 1 |
| **Optional** | May be implemented if useful |
| **Deferred** | Not required for Release 1 |

| From → To | Topic | Article | Action | Event | Submission |
|-----------|------|------|------|------|------|
| **Topic** | — | Required | Required | Required | Deferred |
| **Article** | Required | — | Optional | Optional | Deferred |
| **Action** | Required | Optional | — | Optional | Deferred |
| **Event** | Required | Optional | Optional | — | Deferred |
| **Submission** | Deferred | Required (Article submission) | Deferred | Required (Event submission) | — |

---

# Required Relationships (Release 1)

These relationships must exist because they directly support **content discovery**.

### Topic → Article
Articles must belong to one or more Topics.

Used for:
- Topic pages
- Article discovery by issue

### Topic → Action
Actions must belong to one or more Topics.

Used for:
- Topic pages
- Action discovery by issue

### Topic → Event
Events must belong to one or more Topics.

Used for:
- Topic event discovery
- filtering by issue

### Submission → Article
A submission may represent a **pending Article**.

### Submission → Event
A submission may represent a **pending Event**.

These relationships support the moderation workflow.

---

# Optional Relationships (Release 1)

These relationships are **allowed but not required**.

They may be implemented if they simplify product behavior.

### Article → Action

Articles may reference related actions.

Example:

“Understanding Consumer Boycotts” → Action: “Boycott Company X”

### Article → Event

Articles may reference events.

Example:

“Upcoming Climate March” article referencing the event itself.

### Action → Event

Actions may reference events when an event represents a concrete instance of the action.

Example:

Action: “Attend a protest”  
Event: “March for Climate – Boston”

These should only be implemented if the product actually requires them.

---

# Deferred Relationships

The following relationships are intentionally **not required in Release 1**:

- Topic → Submission
- Submission → Action
- Article ↔ Article cross-linking
- Event ↔ Event cross-linking
- generalized “related content” graph relationships

These can be introduced later without requiring a schema redesign.

---

# Design Principles

Phase 3 schema design should follow these principles.

## 1. Prefer minimal relationships

Only implement relationships that are needed to support:

- Topic discovery
- content linking
- moderation

## 2. Avoid fully connected graphs

The system should **not model every entity referencing every other entity**
unless a clear product need exists.

## 3. Topics are the primary organizing layer

Topics anchor discovery across:

- Articles
- Actions
- Events

## 4. Submissions represent pending content

Submissions exist only to support moderation of:

- Articles
- Events

Actions remain **admin-curated** in Release 1.

---

# Expected Outcome of Phase 3

After Phase 3 implementation:

- Core entity tables exist
- Required relationships are implemented
- Optional relationships are documented if implemented
- The schema cleanly supports Phase 4 API development
