# 010-phase-10-4-submission-ui.md

## Phase 10.4 — Submission UI Spec

### Goal

Implement public, anonymous submission flows for Articles and Events that:

- strictly conform to the Phase 10 canonical submission spec and API schema
- feel consistent with the current public CivicSignal UI
- are low-friction and easy to complete
- require no engineering guesswork about hierarchy, sectioning, field order, or layout

This document is the canonical Phase 10.4 UI and wireframe contract.

---

## 1. Routes

### Canonical submission routes

- `/submit/article`
- `/submit/event`

### Frontend convenience route

- `/submit`

`/submit` is a frontend-only chooser page. It is not a separate submission flow and is not part of the backend API contract.

### Navigation requirement

- `Submit` appears in the primary public navigation and links to `/submit`
- place it after `Events`
- keep the label as `Submit`
- it may be visually slightly less emphasized than the main browse destinations, but it is still part of the primary nav

---

## 2. Shared Page Model

All submission pages must feel like standard public CivicSignal pages, not like a separate application mode.

They must use the existing public shell:

- standard site header/nav
- `.container`
- `.site-main`
- `.page-section`
- existing typography hierarchy
- existing CTA styles unless this spec explicitly says otherwise

### Shared top-level page order

Every submission page uses this top-level order:

1. page header section
2. form content or chooser content
3. submit action row when applicable
4. success or error state in the same page context

### Layout rules

- single-column layout
- form content max width: `720px`
- content is left-aligned within the page container
- no sidebars
- no sticky panels
- no multi-step wizard
- no progress indicator
- no cards around the entire form

### Server/client boundary

- load approved topics on the server before rendering `/submit/article` and `/submit/event`
- pass the topics into the interactive form component as props
- keep the form itself as a client component for field state, validation UX, and submission handling

### Shared spacing rules

- page header section uses standard `.page-section`
- major form sections are separated by `40px`
- fields within a section are separated by `20px`
- helper text and error text belong to the field they describe
- submit action row sits `32px` below the final field section

---

## 3. `/submit` — Submission Chooser

### Purpose

Provide a simple top-level public entry point for contribution.

This page routes users to the correct submission form. It is not a form itself.

### Page composition

#### Section 1 — Header

- H1: `Submit Content`
- Dek: `Share an article or event to help others learn and take action`

#### Section 2 — Option list

Two vertically stacked option blocks.

Each option block contains:

1. option heading
2. one-sentence explanation
3. CTA

#### Option A — Article

- Heading: `Submit an Article`
- Description: `Share educational or explanatory content that helps others understand an issue or take action`
- CTA label: `Submit an Article`
- CTA destination: `/submit/article`

#### Option B — Event

- Heading: `Submit an Event`
- Description: `Share an upcoming event, rally, meeting, workshop, or volunteer opportunity`
- CTA label: `Submit an Event`
- CTA destination: `/submit/event`

#### Section 3 — Moderation expectation note

Muted supporting text below the options:

`All submissions are reviewed before publication.`

### Layout rules

- options are stacked vertically, not side-by-side
- use standard page spacing, not homepage hero spacing
- CTA styling should clearly present two distinct choices
- do not introduce cards, icons, or illustrations

---

## 4. Shared Form Rules

These rules apply to both `/submit/article` and `/submit/event`.

### Form composition

Each form uses this structure:

1. page header
2. moderation expectation note
3. titled form sections
4. single submit CTA row
5. conditional success or error state

### Form element recommendation

- implement the interactive submission UI with a semantic HTML `<form>` element
- use form submit behavior as the primary submit path rather than a loose button click
- the submit CTA should be the form's submit button

This is the recommended implementation pattern for Phase 10.4 unless a specific
constraint requires otherwise.

### Moderation expectation note

Place directly below the dek and above the form:

`Submissions are reviewed before publication.`

This note is required on both forms.

### Section model

Each form is broken into clearly labeled sections.

Each section contains:

- section heading (`h2` or equivalent)
- grouped fields underneath

Do not use one long unsectioned form.

### Field container order

Each field uses this internal order:

1. label
2. input control
3. helper text, if present
4. field error, if present

### Field styling rules

- labels appear above inputs
- required fields are identified in label text, not by a detached legend
- optional fields are marked `(optional)` in the label text
- helper text is muted and directly below the input
- error text is directly below helper text
- errors must not appear in a separate floating region away from the field

### Input rules

- text inputs and selects are full width of the form column
- textareas are full width of the form column
- no field may exceed the `720px` form width
- fields stack vertically unless this spec explicitly permits row grouping

### Validation behavior

- block submit on missing required fields
- validate on submit
- inline errors appear after submit attempt
- preserve user-entered values on validation failure
- disable submit CTA while request is in flight
- prevent double submission
- API is source of truth

### Global error behavior

If the request fails for a non-field reason, show a form-level error block above the submit CTA:

`Something went wrong while sending your submission. Please try again.`

Do not clear entered values when this happens.

---

## 5. Shared Form Primitive Contract

Engineering may introduce small semantic form classes. Use a shared primitive set rather than ad hoc per-page form styling.

Recommended shared classes:

- `.submissionForm`
- `.submissionSection`
- `.submissionField`
- `.submissionFieldRow`
- `.submissionHelper`
- `.submissionError`
- `.submissionActions`
- `.submissionSuccess`
- `.submissionGlobalError`

### Required behavior of primitives

#### `.submissionForm`

- display: grid
- gap: `40px`
- max-width: `720px`

#### `.submissionSection`

- display: grid
- gap: `20px`

#### `.submissionField`

- display: grid
- gap: `8px`

#### `.submissionFieldRow`

- used only where this spec explicitly permits row grouping
- owns horizontal gap between grouped fields
- child fields inside the row must still use `.submissionField`

#### `.submissionActions`

- margin-top: `32px`
- display: flex
- justify-content: flex-start

#### `.submissionSuccess`

- display: grid
- gap: `24px`
- max-width: `720px`

---

## 6. Article Submission — `/submit/article`

### Page header

- H1: `Submit an Article`
- Dek: `Share an article that helps others understand an issue or take action`

### Form section order

1. Basic Information
2. Article Content
3. Supporting Links
4. Contact Information

### Section 1 — Basic Information

#### Field 1 — Title

- Label: `Title`
- Type: single-line text input
- Required: yes
- Width: full

#### Field 2 — Summary

- Label: `Summary`
- Type: textarea
- Required: yes
- Width: full
- Height: medium (`3-4` rows equivalent)
- Helper text: `Briefly describe what this article is about`

#### Field 3 — Topics

- Label: `Topics`
- Required: yes
- Width: full
- Helper text: `Select at least one topic`

Topics UX:

- use a checkbox list
- do not use a collapsed multi-select dropdown

### Section 2 — Article Content

#### Field 4 — Content

- Label: `Content`
- Type: large textarea
- Required: yes
- Width: full
- Height: large
- Helper text: `Write the full article content`

Content input rules:

- use a plain textarea only
- do not add a markdown toolbar
- do not add a rich text editor
- do not add formatting controls
- do not add preview mode

### Section 3 — Supporting Links

#### Field 5 — Supporting links (optional)

- Label: `Supporting links (optional)`
- Type: repeatable URL inputs OR one textarea with one URL per line
- Required: no
- Width: full
- Helper text: `Add links that help verify claims or provide context`

Supporting links rules:

- preferred implementation: repeatable URL inputs with an `Add another link` action
- fallback allowed: one textarea with one URL per line
- not allowed: comma-separated parsing

### Section 4 — Contact Information

#### Field 6 — Name (optional)

- Label: `Name (optional)`
- Type: single-line text input
- Width: full

#### Field 7 — Email (optional)

- Label: `Email (optional)`
- Type: email input
- Width: full
- Helper text: `Used only if we need to follow up about your submission`

### Submit action row

Single CTA only:

- Button text: `Submit Article`
- Use existing `.primaryCTA`

---

## 7. Event Submission — `/submit/event`

### Page header

- H1: `Submit an Event`
- Dek: `Share an event others can attend and participate in`

### Form section order

1. Basic Information
2. Schedule
3. Location
4. Topics
5. Supporting Links
6. Contact Information

### Section 1 — Basic Information

#### Field 1 — Title

- Label: `Title`
- Type: single-line text input
- Required: yes
- Width: full

#### Field 2 — Summary

- Label: `Summary`
- Type: textarea
- Required: yes
- Width: full
- Height: medium
- Helper text: `Briefly describe the event`

#### Field 3 — Description

- Label: `Description`
- Type: large textarea
- Required: yes
- Width: full
- Height: large
- Helper text: `Provide additional details about the event`

#### Field 4 — Event Type

- Label: `Event type`
- Type: select
- Required: yes
- Width: full

Event type rule:

- use the shared static enum from `packages/api-contracts`
- do not add a runtime metadata endpoint in Phase 10.4

### Section 2 — Schedule

#### Field 5 — Start Datetime

- Label: `Start Datetime`
- Type: datetime input
- Required: yes

#### Field 6 — End Datetime (optional)

- Label: `End Datetime (optional)`
- Type: datetime input
- Required: no

Schedule layout rule:

- on desktop, Start and End may sit side by side in one `.submissionFieldRow`
- on small screens, stack vertically

### Section 3 — Location

This section must map 1:1 to the API payload.

#### Field 7 — Location Name

- Label: `Location Name`
- Type: single-line text input
- Required: yes
- Width: full
- maps to `locationName`

#### Field 8 — City

- Label: `City`
- Type: single-line text input
- Required: yes
- maps to `locationAddressCity`

#### Field 9 — Region

- Label: `Region`
- Type: single-line text input
- Required: yes
- maps to `locationAddressRegion`

#### Field 10 — Country

- Label: `Country`
- Type: single-line text input
- Required: yes
- maps to `locationAddressCountry`

Country rules:

- field must exist in payload
- prefill `US` by default
- keep the field editable

#### Field 11 — Street Address (optional)

- Label: `Street Address (optional)`
- Type: single-line text input
- Required: no
- maps to `locationAddressStreet`

Location layout rule:

- on desktop, City, Region, and Country may sit in one responsive `.submissionFieldRow`
- on small screens, stack vertically
- do not combine location into one generic address field

### Section 4 — Topics

#### Field 12 — Topics

- Label: `Topics`
- Required: yes
- Width: full
- Helper text: `Select at least one topic`

Topics UX:

- use the same checkbox-list pattern as the article form

### Section 5 — Supporting Links

#### Field 13 — Supporting links (optional)

- Label: `Supporting links (optional)`
- Type: repeatable URL inputs OR one textarea with one URL per line
- Required: no
- Width: full
- Helper text: `Add links to the event page, organizer page, or other supporting information`

Supporting links rules:

- preferred implementation: repeatable URL inputs
- fallback allowed: one textarea with one URL per line
- not allowed: comma-separated parsing

### Section 6 — Contact Information

#### Field 14 — Name (optional)

- Label: `Name (optional)`
- Type: single-line text input
- Width: full

#### Field 15 — Email (optional)

- Label: `Email (optional)`
- Type: email input
- Width: full
- Helper text: `Used only if we need to follow up about your submission`

Implementation note:

- `author` remains supported by the submission API as an optional field
- `author` is not required for Phase 10.4 and is not collected in the public UI

### Submit action row

Single CTA only:

- Button text: `Submit Event`
- Use existing `.primaryCTA`

---

## 8. Success State

On success:

- replace the form with a success state
- do not keep the completed form visible below the success message
- do not redirect automatically
- do not route to a dashboard or tracking page

Use the canonical confirmation copy:

`Thanks — your submission has been received and is now pending review.`

Optional second line:

`If you included an email address, we may contact you if we need clarification.`

No additional success CTA requirements are introduced in Phase 10.4.

---

## 9. Error State

- inline field errors
- optional global error:
  `Something went wrong while sending your submission. Please try again.`

Field-level errors must appear directly below the field they belong to and use short, direct copy.

---

## 10. Responsive Rules

Forms are single-column by default.

Only these groupings may share a row on desktop:

- Event Start / End datetime
- Event City / Region / Country

At small widths:

- all grouped rows stack vertically
- CTAs remain left-aligned
- form width collapses naturally within `.container`

Do not introduce a different mobile form flow.

---

## 11. UX Constraints And Non-Goals

- no drafts
- no autosave
- no editing after submit
- no rich text editing
- no file uploads
- no preview mode
- no account creation
- no submission tracking
- no CAPTCHA
- no smart parsing or inferred fields not defined in the contract

---

## 12. Contract Alignment (Critical)

- UI must produce a valid API payload
- all required fields must be present
- no extra required fields may be introduced by the UI
- exact location mapping must be enforced
- topics are required for both types
- eventType is restricted to the Release 1 event type vocabulary from the shared contract
- `author` may be omitted without blocking valid submission requests
- `/submit/article` and `/submit/event` are canonical routes
- `/submit` is a frontend convenience route only

If this document conflicts with the canonical Phase 10 submission spec or backend schema, those sources win.

API schema remains the ultimate source of truth for request validity.
