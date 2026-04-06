# Phase 10 — Submission System Spec

## Overview

This document defines the product, API, and UI contract for anonymous submission of Articles and Events.

Goal: enable low-friction public submissions with clear moderation handoff and zero ambiguity in implementation.

---

## Core Principles

- Anonymous-first: no account required
- Low friction: minimal required fields
- Moderation-first: all submissions default to `pending`
- Unified model: exactly one `Submission` model and one creation path
- Clear ownership: backend owns validation + persistence; UI mirrors but does not redefine rules
- Capture-only scope: collect submission data for later review, do not normalize or enrich beyond what the spec requires
- No premature complexity: no author systems, no tracking dashboards, no advanced workflows

---

## Submission Entry Points

Two public form entry points:

- `/submit/article`
- `/submit/event`

These routes are presentation-only differences over a single submission model and single submission creation API.

---

## Data Model (Submission)

### Shared Fields

- `id`
- `submission_type` (`ARTICLE` | `EVENT`)
- `status` (`pending` default)
- `created_at`
- `updated_at`
- `author` (nullable)
- `submitter_name` (nullable)
- `submitter_email` (nullable)

### Article-Specific Fields

- `title` (required)
- `summary` (required)
- `content` (required)
- `topicSlugs` (required, array)
- `source_links` (optional, array)

### Event-Specific Fields

- `title` (required)
- `summary` (required)
- `description` (required)
- `event_type` (required)
- `start_datetime` (required)
- `end_datetime` (optional)
- `location_name` (required)
- `location_address_street` (optional)
- `location_address_city` (required)
- `location_address_region` (required)
- `location_address_state` (optional)
- `location_address_zip` (optional)
- `topicSlugs` (required, array)
- `source_link` (required)

---

## Validation Rules

Backend validation is the source of truth.
Frontend validation mirrors backend rules for UX only and must not invent separate acceptance criteria.

### General

- Required fields must be non-empty after trimming
- Strings must be trimmed before validation and persistence
- Reject clearly invalid email formats if email is provided
- Reject payloads with unknown required structure for the declared `submission_type`

### Length Limits

- `title`: max 200 chars
- `summary`: max 300 chars
- `content`: max 50,000 chars
- `description`: max 50,000 chars
- `location_name`: max 200 chars
- `location_address_street`: max 300 chars
- `location_address_city`: max 120 chars
- `location_address_region`: max 120 chars
- `location_address_state`: max 120 chars
- `location_address_zip`: max 32 chars
- `author`: max 120 chars
- `submitter_name`: max 120 chars
- `submitter_email`: max 320 chars
- each source link: max 2,000 chars

### Event-Specific

- `start_datetime` must be a valid datetime
- `end_datetime`, if present, must be a valid datetime
- `end_datetime`, if present, must be greater than or equal to `start_datetime`

### Topics

- at least one topic slug must be selected
- submitted topic slug values must match approved Release 1 topics

### Error Behavior

- API returns structured validation errors
- UI displays inline field errors
- submission-level failures may display a top-of-form error summary
- no silent failures
- no partial-success responses

---

## Optionality And Nullability

- Required request fields must be present in the request payload and must validate after trimming
- Optional request fields may be omitted entirely
- Optional request fields may also be sent as `null` when the client has no value to provide
- Empty strings are not a substitute for omission on optional fields; trim first, then either persist a value or normalize to `null`
- `end_datetime` may be omitted or set to `null`
- `source_links` may be omitted, set to `null`, or provided as a non-empty array
- optional location fields may be omitted or set to `null`
- `author`, `submitter_name`, and `submitter_email` may be omitted or set to `null`

---

## Validation Error Field Naming

- Validation errors should point to the public API contract, not internal DTO or database field names
- Nested payload fields should be reported using dot paths rooted at `payload`
- Use `payload.title`, `payload.summary`, and `payload.event_type` rather than flattened or database-derived names
- Top-level fields should use their request names, for example `submission_type` and `submitter_email`
- Array item errors should include the array index when relevant, for example `payload.source_links[0]`
- Topic slug errors should point to `payload.topicSlugs`

---

## API Contract

### Create Submission

`POST /api/submissions`

### Request

```json
{
  "submission_type": "ARTICLE",
  "author": "Alex",
  "payload": {
    "title": "How Local Organizing Works",
    "summary": "A practical explainer on local issue campaigns.",
    "content": "Full article text...",
    "topicSlugs": ["local-community"],
    "source_links": ["https://example.org/source"]
  },
  "submitter_name": "Alex",
  "submitter_email": "alex@example.org"
}
```

```json
{
  "submission_type": "EVENT",
  "author": "Alex",
  "payload": {
    "title": "Tenant Rights Rally",
    "summary": "Public rally supporting stronger tenant protections.",
    "description": "Join local organizers for a rally and speaker program.",
    "event_type": "RALLY",
    "start_datetime": "2026-05-14T17:00:00.000Z",
    "end_datetime": "2026-05-14T19:00:00.000Z",
    "location_name": "City Hall North Plaza",
    "location_address_street": "1400 John F Kennedy Blvd",
    "location_address_city": "Philadelphia",
    "location_address_region": "Philadelphia County",
    "location_address_state": "PA",
    "location_address_zip": "19107",
    "topicSlugs": ["economic-justice"],
    "source_link": "https://example.org/event"
  },
  "submitter_name": "Alex",
  "submitter_email": "alex@example.org"
}
```

### Success Response

```json
{
  "id": 123
}
```

### Error Response

```json
{
  "errors": [
    { "field": "title", "message": "Title is required" },
    { "field": "submitter_email", "message": "Email must be valid" }
  ]
}
```

Scope: create-only in Phase 10.

---

## Persistence Rules

- all submissions are saved as `pending`
- raw submitted content must be preserved
- normalization is allowed only if raw submitted content remains accessible
- `submitter_name` and `submitter_email` are moderation-only in Release 1
- `submitter_name` and `submitter_email` must not be exposed in public read APIs
- `author` may be retained for future attribution but is not displayed publicly in Phase 10
- do not add slug generation, auto-tagging, content parsing, or other enrichment in Phase 10

---

## Persistence Mapping

The public API contract is intentionally cleaner than the current Prisma `Submission` model.
Phase 10 implementation should map request fields into the existing persistence model as follows:

### Shared Mapping

- `submission_type` -> `submissionType`
- moderation status is always persisted as `PENDING`
- `author` -> `author`
- `submitter_email` -> `submitterEmail`
- `submitter_name` -> `submitterName`

### Article Mapping

- `payload.title` -> `title`
- `payload.summary` -> `summary`
- `payload.content` -> `submittedContent`
- `payload.source_links` should be retained for moderation review during Phase 10 implementation
- `payload.topicSlugs` should be validated against seeded topics and retained for later conversion workflow

### Event Mapping

- `payload.title` -> `title`
- `payload.summary` -> `summary`
- `payload.description` -> `submittedContent`
- `payload.event_type` -> `eventType`
- `payload.start_datetime` -> `startTime`
- `payload.end_datetime` -> `endTime`
- `payload.location_name` -> `locationName`
- `addressRaw` should be assembled from available location components for human-readable display compatibility
  - include `payload.location_address_street` when present
  - include `payload.location_address_city`
  - include `payload.location_address_region`
  - include `payload.location_address_state` when present
  - include `payload.location_address_zip` when present
- `payload.location_address_city` -> `city`
- `payload.location_address_region` -> `region`
- `payload.location_address_state` should contribute to `addressRaw`; Phase 10 does not add a dedicated persistence column for it
- `payload.location_address_zip` -> `postalCode`
- `payload.source_link` should be retained for moderation review during Phase 10 implementation
- `payload.topicSlugs` should be validated against seeded topics and retained for later conversion workflow

### Normalization Rules

- The API contract remains the source of truth for public field names even when database field names differ
- `submittedContent` stores the main moderator-review body:
  - article submissions store article `content`
  - event submissions store event `description`
- `addressRaw` is a derived persistence/display field, not a primary public input
- missing optional request fields should persist as `null`
- Phase 10 does not introduce enrichment, geocoding, slug generation, or publication-ready normalization

---

## UI Specification

## Shared Form Rules

These rules apply to both article and event submission pages.

### Form Structure

Each form uses this section order:

1. page heading + support copy
2. submission content section
3. classification section
4. contact section
5. submit action
6. success or error state

### Shared Field Styling Rules

- labels appear above inputs
- helper text appears directly below the field it belongs to
- field errors appear directly below helper text
- required fields must be visibly marked
- optional fields must be labeled `optional`
- the submit button appears only once, at the bottom of the form

### Shared Form Behavior

- preserve entered values on validation failure
- disable submit while the request is in flight
- prevent double submission
- on success, replace the form with a dedicated confirmation state
- do not redirect to a dashboard, account page, or tracking page

---

## Article Submission Page

### Route

`/submit/article`

### Page Copy

#### Title

`Submit an Article`

#### Support Copy

`Share an article, explainer, or field guide for review before publication.`

### Field Layout

#### Section 1 — Article Details

Field order:

1. `Title` — text input — required
2. `Summary` — textarea — required
3. `Article content` — large textarea — required

Field notes:

- `Summary` should support a short one-paragraph description
- `Article content` is the primary long-form field and should have the largest textarea in the form

#### Section 2 — Topics and Sources

Field order:

4. `Topics` — multi-select checkbox group or equivalent multi-select control — required
5. `Source links` — repeatable text input list or single textarea with one URL per line — optional

Field notes:

- users must be able to select at least one topic slug
- do not ask the user to create new topics
- source links remain optional and should not block submission

#### Section 3 — Contact Information

Field order:

6. `Name` — text input — optional
7. `Email` — email input — optional

Helper text for email:

`Used only if we need to follow up about your submission`

### Article Form Field Summary

- Title
- Summary
- Article content
- Topics
- Source links
- Name
- Email

---

## Event Submission Page

### Route

`/submit/event`

### Page Copy

#### Title

`Submit an Event`

#### Support Copy

`Share an upcoming event for review before publication.`

### Field Layout

#### Section 1 — Event Details

Field order:

1. `Title` — text input — required
2. `Summary` — textarea — required
3. `Description` — large textarea — required
4. `Event type` — select or radio group — required

#### Section 2 — Date and Time

Field order:

5. `Start date and time` — datetime input — required
6. `End date and time` — datetime input — optional

Field notes:

- `End date and time` may be blank
- validation for end-before-start happens inline and at API level

#### Section 3 — Location

Field order:

7. `Location name` — text input — required
8. `Street address` — text input — optional
9. `City` — text input — required
10. `Region` — text input — required
11. `State` — text input — optional
12. `ZIP code` — text input — optional

Field notes:

- require only the location structure needed for basic verification
- do not require a perfect postal address
- do not require latitude/longitude

#### Section 4 — Topics and Source

Field order:

13. `Topics` — multi-select checkbox group or equivalent multi-select control — required
14. `Source link` — text input — required

#### Section 5 — Contact Information

Field order:

15. `Name` — text input — optional
16. `Email` — email input — optional

Helper text for email:

`Used only if we need to follow up about your submission`

### Event Form Field Summary

- Title
- Summary
- Description
- Event type
- Start date and time
- End date and time
- Location name
- Street address
- City
- Region
- State
- ZIP code
- Topics
- Source link
- Name
- Email

---

## Event Type Values

Use the existing Release 1 event type vocabulary.

Do not invent submission-only event types.

---

## Submitter Fields Behavior

- `Author`, `Name`, and `Email` are optional
- `submitter_name` and `submitter_email` are used for moderation follow-up only
- `submitter_name` and `submitter_email` are not displayed publicly in Phase 10
- `author` captures credited authorship intent for the submitted content
- `author` is not displayed publicly in Phase 10

---

## Success State

After successful submission:

- replace the form with a confirmation state
- do not leave the completed form visible underneath
- do not imply guaranteed publication
- do not promise a review timeline

### Confirmation Copy

`Thanks — your submission has been received and is now pending review.`

Optional second line:

`If you included an email address, we may contact you if we need clarification.`

---

## Failure State

### Validation Failure

- field-level errors display inline
- top-of-form summary is allowed but not required
- submitted values remain in the form

### Submission Failure

For unexpected server failure, display a form-level error:

`Something went wrong while sending your submission. Please try again.`

Do not clear entered values on failure.

---

## Anti-Spam (Phase 10 Scope)

Include:

- server-side validation
- rate limiting
- honeypot field

Exclude:

- CAPTCHA unless real abuse appears immediately

This phase should add low-friction protection only.

---

## Moderation Handoff (Phase 11 Boundary)

Phase 10 guarantees:

- submissions can be created anonymously
- article and event submissions persist correctly
- status defaults to `pending`
- stored data is complete enough for later review
- submitter contact fields are available for moderation follow-up when provided

Phase 11 will handle:

- moderation queue UI
- approval and rejection workflows
- editorial editing / normalization for publication
- any notification or follow-up workflows beyond basic stored contact fields

---

## Engineering Notes (for SE)

- there is one submission model and one submission creation API
- article and event differences are payload differences, not separate systems
- the main implementation risk in Phase 10 is divergence between article and event handling
- backend validation is the source of truth
- frontend validation mirrors backend rules for UX only
- API owns validation, persistence, and status defaults
- UI owns form state, error display, and success state
- UI does not own business logic or field interpretation
- do not add user accounts, draft flows, or submission editing
- do not create separate public APIs for article submissions and event submissions
- do not add slug generation, auto-tagging, smart defaults, or content parsing
- keep field layout order consistent with this document unless PM explicitly revises the spec
- prefer precise external field names when they materially reduce ambiguity; `topicSlugs` is preferred over `topics` for this contract

### Critical Constraint

There must be exactly one submission creation path and one submission data model.

External contract:

- `POST /api/submissions`

Do not split the public contract into parallel endpoints unless explicitly approved.

---

## Non-Goals

- user accounts
- submission editing
- submission tracking
- public attribution
- advanced moderation workflows
- structured venue/geocoding systems
- spam tooling beyond low-friction protections

---

## Acceptance Standard

Phase 10 is complete when:

- both public submission pages exist
- both forms match the field layout in this spec
- anonymous submissions persist correctly through the single submissions API
- all submissions default to `pending`
- a submission created through the UI appears in the database with the correct shape and `pending` status
- invalid payloads are rejected with structured field errors
- validation behavior is consistent between UI and API
- UI surfaces validation errors clearly without ambiguity
- success and failure states are clear and non-ambiguous
- Phase 11 can begin moderation work without reopening Phase 10 product decisions
