# Domain Model

## Purpose

Define the conceptual entities used by the platform.

---

# Core Entities

## Topic

Represents a civic issue area.

Examples:

- climate
- democracy
- consumer activism

Topics organize content across the platform.

---

## Article

Long-form content explaining issues.

Possible attributes:

- id
- title
- slug
- content
- created_at

---

## Action

Represents a concrete civic action.

Examples:

- boycott
- donation
- contacting representatives
- volunteering

Possible attributes:

- id
- title
- description
- action_type
- related_topics

---

## Event

Represents a scheduled civic participation opportunity.

Attributes may include:

- id
- title
- description
- event_type
- location
- start_time
- end_time

---

## Submission

Represents a user-submitted article or event awaiting moderation.

Possible attributes:

- id
- submission_type
- submitted_content
- status
- submitted_at
