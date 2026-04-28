# Phase 3 Domain Entity Definitions

Release 1 Minimum Entity Contract

## Purpose

This document defines the **minimum Release 1 entity shape** for the core domain model.

It exists to clarify product intent before detailed schema implementation so that
Phase 3 can proceed without the Staff Engineer having to infer core domain behavior.

This document is intentionally **product-level**, not ORM-level.

It defines:

- the role of each entity
- the minimum fields the entity should support
- which concerns are intentionally deferred

---

# Entity Definitions

## Topic

### Purpose

A Topic is a **seeded reference entity** used to organize the platform’s public content.

Topics group:

- Articles
- Actions
- Events

Topics are:

- seeded reference data
- not user-editable in Release 1
- not submitted by visitors
- publicly visible through topic pages

### Minimum fields

- id
- slug
- name
- description

---

## Article

### Purpose

An Article is long-form content that explains issues and helps users understand
how they can take civic action.

Examples:

- issue explainers
- blog posts
- civic participation guides

Articles may originate from:

- editorial/admin creation
- approved community submissions

### Minimum fields

- id
- slug
- title
- summary
- content
- status
- created_at
- updated_at

### Notes

- status supports draft/published

---

## Action

### Purpose

An Action is a **concrete civic step** a user can take.

Examples:

- boycott a company
- donate
- contact representatives
- volunteer

Actions are **admin-curated** in Release 1.

### Minimum fields

- id
- slug
- title
- summary
- description
- action_type
- status
- created_at
- updated_at

---

## Event

### Purpose

An Event is a scheduled civic participation opportunity.

Examples:

- protests
- rallies
- volunteer opportunities
- town halls

Events may originate from:

- editorial/admin creation
- approved submissions

### Minimum fields

- id
- title
- summary
- description
- eventType
- status
- startTime
- endTime
- locationName
- address_raw
- website
- city
- region
- country
- latitude
- longitude
- created_at
- updated_at

### Notes

- event slug optional for Release 1
- ID-based routing acceptable

---

## Submission

### Purpose

A Submission represents **user-submitted content awaiting moderation**.

In Release 1 submissions may represent:

- Article content
- Event content

Submissions are moderation workflow records. They need to contain only enough proposed data for
moderation and conversion

### Minimum fields

Common fields

- id
- submissionType
- status
- title
- summary
- submittedContent
- submitterName
- submitterEmail
- reviewNotes
- submittedAt
- reviewedAt

Event-specific optional fields

- eventType
- startTime
- endTime
- locationName
- addressRaw
- city
- region
- postalCode
- country
- website
- contactEmail

### Notes

- Submission statuses should support:
  - pending
  - approved
  - rejected
- A submission only needs to capture enough proposed data for moderation and conversion

---

# Shared Release 1 Rules

## Stable public identifiers

Entities requiring slugs:

- Topic
- Article
- Action

Events may use ID routing initially.

## Publication status

Entities requiring publication state:

- Article
- Action
- Event

Minimum states:

- draft
- published

## Moderation status

Submission moderation states:

- pending
- approved
- rejected
