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
- No premature complexity: no author management system, no tracking dashboards, no advanced workflows

---

## Submission Entry Points

Two public form entry points:

- `/submit/article`
- `/submit/event`

These routes are presentation-only differences over a single submission model and single submission creation API.

An optional chooser route may also exist:

- `/submit`

`/submit` is a frontend navigation entry point within Phase 10 scope. It links users to the two canonical form routes above and does not introduce a separate submission flow or API behavior.

---

## Discoverability

- `Submit` is a primary public navigation item in Phase 10
- it links to `/submit`
- it appears after `Events` in the primary public nav
- the visual treatment may be slightly de-emphasized relative to the main browse destinations, but it remains part of primary navigation
- do not hide submission discoverability behind footer-only placement or deep contextual links

---

## Data Model (Submission)

### Shared Fields

- `id`
- `submissionType` (`ARTICLE` | `EVENT`)
- `status` (`pending` default)
- `created_at`
- `updated_at`
- `author` (nullable)
- `submitterName` (nullable)
- `submitterEmail` (nullable)

### Article-Specific Fields

- `title` (required)
- `summary` (required)
- `content` (required)
- `topicSlugs` (required, array)
- `resourceLinks` (optional, array)

### Event-Specific Fields

- `title` (required)
- `summary` (required)
- `description` (required)
- `eventType` (required)
- `startTime` (required)
- `endTime` (optional)
- `locationName` (required)
- `locationAddressStreet` (optional)
- `locationAddressCity` (required)
- `locationAddressRegion` (required)
- `locationAddressCountry` (required; public form may default to `US` for now)
- `locationAddressZip` (required)
- `contactEmail` (optional)
- `topicSlugs` (required, array)
- `websiteUrl` (optional, string)

---

## Validation Rules

Backend validation is the source of truth.
Frontend validation mirrors backend rules for UX only and must not invent separate acceptance criteria.

### General

- Required fields must be non-empty after trimming
- Strings must be trimmed before validation and persistence
- Reject clearly invalid email formats if email is provided
- Reject payloads with unknown required structure for the declared `submissionType`

### Length Limits

- `title`: max 200 chars
- `summary`: max 300 chars
- `content`: max 50,000 chars
- `description`: max 50,000 chars
- `locationName`: max 200 chars
- `locationAddressStreet`: max 300 chars
- `locationAddressCity`: max 120 chars
- `locationAddressRegion`: max 120 chars
- `locationAddressCountry`: max 120 chars
- `locationAddressZip`: max 32 chars
- `contactEmail`: max 320 chars
- `author`: max 120 chars
- `submitterName`: max 120 chars
- `submitterEmail`: max 320 chars
- each resource link: max 2,000 chars

### Event-Specific

- `startTime` must be a valid datetime
- `endTime`, if present, must be a valid datetime
- `endTime`, if present, must be greater than or equal to `startTime`
- `eventType` must be one of the Release 1 event enum values:
  - `PROTEST`
  - `RALLY`
  - `VOLUNTEER`
  - `TOWN_HALL`
  - `WORKSHOP`
  - `MEETING`

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
- `endTime` may be omitted or set to `null`
- article `resourceLinks` may be omitted, set to `null`, or provided as a non-empty array
- event `websiteUrl` may be omitted or set to `null`
- optional location fields may be omitted or set to `null`, except `locationAddressZip` which is required
- `author`, `submitterName`, and `submitterEmail` may be omitted or set to `null`

---

## Validation Error Field Naming

- Validation errors should point to the public API contract, not internal DTO or database field names
- Nested payload fields should be reported using dot paths rooted at `payload`
- Use `payload.title`, `payload.summary`, and `payload.eventType` rather than flattened or database-derived names
- Top-level fields should use their request names, for example `submissionType` and `submitterEmail`
- Array item errors should include the array index when relevant, for example `payload.resourceLinks[0]`
- Topic slug errors should point to `payload.topicSlugs`

---

## API Contract

### Create Submission

`POST /api/submissions`

### Request

```json
{
  "submissionType": "ARTICLE",
  "author": "Alex",
  "payload": {
    "title": "How Local Organizing Works",
    "summary": "A practical explainer on local issue campaigns.",
    "content": "Full article text...",
    "topicSlugs": ["local-community"],
    "resourceLinks": ["https://example.org/source"]
  },
  "submitterName": "Alex",
  "submitterEmail": "alex@example.org"
}
```

```json
{
  "submissionType": "EVENT",
  "author": "Alex",
  "payload": {
    "title": "Tenant Rights Rally",
    "summary": "Public rally supporting stronger tenant protections.",
    "description": "Join local organizers for a rally and speaker program.",
    "eventType": "RALLY",
    "startTime": "2026-05-14T17:00:00.000Z",
    "endTime": "2026-05-14T19:00:00.000Z",
    "locationName": "City Hall North Plaza",
    "locationAddressStreet": "1400 John F Kennedy Blvd",
    "locationAddressCity": "Philadelphia",
    "locationAddressRegion": "Philadelphia County",
    "locationAddressCountry": "US",
    "locationAddressZip": "19107",
    "contactEmail": "organizer@example.org",
    "topicSlugs": ["economic-justice"],
    "websiteUrl": "https://example.org/event"
  },
  "submitterName": "Alex",
  "submitterEmail": "alex@example.org"
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
    { "field": "submitterEmail", "message": "Email must be valid" }
  ]
}
```

Scope: create-only in Phase 10.

---

## Persistence Rules

- all submissions are saved as `pending`
- raw submitted content must be preserved
- normalization is allowed only if raw submitted content remains accessible
- `submitterName` and `submitterEmail` are moderation-only in Release 1
- `submitterName` and `submitterEmail` must not be exposed in public read APIs
- `author` may be retained for future attribution but is not displayed publicly in Phase 10
- do not add slug generation, auto-tagging, content parsing, or other enrichment in Phase 10

---

## Persistence Mapping

The public API contract is intentionally cleaner than the current Prisma `Submission` model.
Phase 10 implementation should map request fields into the existing persistence model as follows:

### Shared Mapping

- `submissionType` -> `submissionType`
- moderation status is always persisted as `PENDING`
- `author` -> `author`
- `submitterEmail` -> `submitterEmail`
- `submitterName` -> `submitterName`

### Article Mapping

- `payload.title` -> `title`
- `payload.summary` -> `summary`
- `payload.content` -> `submittedContent`
- `payload.resourceLinks` should be retained for moderation review during Phase 10 implementation
- `payload.topicSlugs` should be validated against seeded topics and retained for later conversion workflow

### Event Mapping

- `payload.title` -> `title`
- `payload.summary` -> `summary`
- `payload.description` -> `submittedContent`
- `payload.eventType` -> `eventType`
- `payload.startTime` -> `startTime`
- `payload.endTime` -> `endTime`
- `payload.locationName` -> `locationName`
- `addressRaw` should be assembled from available location components for human-readable display compatibility
  - include `payload.locationAddressStreet` when present
  - include `payload.locationAddressCity`
  - include `payload.locationAddressRegion`
  - include `payload.locationAddressCountry`
  - include `payload.locationAddressZip` when present
- `payload.locationAddressCity` -> `city`
- `payload.locationAddressRegion` -> `region`
- `payload.locationAddressCountry` -> `country`
- `payload.locationAddressZip` -> `postalCode`
- `payload.contactEmail` -> `contactEmail`
- `payload.websiteUrl` -> `website`
- `payload.topicSlugs` should be validated against seeded topics and retained for later conversion workflow

### Normalization Rules

- The API contract remains the source of truth for public field names even when database field names differ
- `submittedContent` stores the main moderator-review body:
  - article submissions store article `content`
  - event submissions store event `description`
- `addressRaw` is a derived persistence/display field, not a primary public input
- missing optional request fields should persist as `null`
- Phase 10 does not introduce enrichment, geocoding, slug generation, or publication-ready normalization

### Link Model

- article submissions may include optional `resourceLinks`
- article `resourceLinks` are supporting links for moderation and validation, not canonical public URLs
- event submissions do not use `resourceLinks`
- event submissions may include one optional `websiteUrl`
- `websiteUrl` represents the public event, organizer, or RSVP URL
- approved event submissions should map `websiteUrl` to the published Event model website field

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

## Optional Chooser Page

### Route

`/submit`

### Page Copy

#### Title

`Submit Content`

#### Support Copy

`Share an article or event to help others learn and take action.`

### Actions

- `Submit an Article` -> `/submit/article`
- `Submit an Event` -> `/submit/event`

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

6. `Author` — text input — optional
7. `Submitter Name` — text input — optional
8. `Submitter Email` — email input — optional

Helper text for submitter email:

`Used only if we need to follow up about your submission`

### Article Form Field Summary

- Title
- Summary
- Article content
- Topics
- Source links
- Author
- Submitter Name
- Submitter Email

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
8. `City` — text input — required
9. `Region` — text input — required
10. `Country` — text input — required
11. `Street address` — text input — optional
12. `ZIP code` — text input — required

Field notes:

- require only the location structure needed for basic verification
- require a ZIP/postal code value for event submissions in Release 1
- do not require latitude/longitude
- the UI may prefill `Country` with `US`, but users must still be able to submit another country when needed

#### Section 4 — Topics and Sources

Field order:

13. `Topics` — multi-select checkbox group or equivalent multi-select control — required
14. `Supporting links` — repeatable text input list or single textarea with one URL per line — optional

Field notes:

- article supporting links map to `resourceLinks`
- event website input maps to `websiteUrl`
- supporting links remain optional and must not block submission
- the UI may use a repeatable field list or a one-link-per-line textarea

#### Section 5 — Contact Information

Field order:

15. `Contact Email` — email input — optional
16. `Name` — text input — optional
17. `Email` — email input — optional

Helper text for contact email:

`Used publicly only if the event needs a contact address`

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
- City
- Region
- Country
- Street address
- ZIP code
- Topics
- Supporting links
- Contact Email
- Name
- Email

---

## Event Type Values

Use the Release 1 event type vocabulary:

- `PROTEST`
- `RALLY`
- `VOLUNTEER`
- `TOWN_HALL`
- `WORKSHOP`
- `MEETING`

Phase 10.4 should use the shared static enum defined in `packages/api-contracts` rather than introducing a runtime metadata endpoint.

Do not invent submission-only event types.

---

## Submitter Fields Behavior

- public Phase 10 article forms may collect `Author`, `Submitter Name`, and `Submitter Email`
- public Phase 10 event forms may collect `Contact Email`, `Name`, and `Email`
- `author` is supported by the Phase 10 API contract and remains optional, not required
- the public Phase 10 article UI may expose a separate author field
- `contactEmail` is an optional event-level public contact address and is distinct from moderation follow-up fields
- `submitterName` and `submitterEmail` are used for moderation follow-up only
- `submitterName` and `submitterEmail` are not displayed publicly in Phase 10
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

## Moderation/Admin Handoff (Phase 11 Boundary)

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
- essential admin editing for curated content
- route protection and authentication hardening required before deployment, even if local development initially leaves the interface open

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
- Phase 11 can begin moderation/admin work without reopening Phase 10 product decisions
