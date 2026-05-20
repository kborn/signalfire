# Phase 11.3 Editorial Normalization Guide

This guide explains the concepts behind Phase 11.3. Phase 11.3 is not about
inventing a new public content contract. It is about taking a reviewed
submission, letting a moderator clean up the fields that will become public,
and creating the real Article or Event record from those normalized fields.

## What Phase 11.3 Is Building

Phase 11.3 completes the approval path for submitted content:

- submitted Article data can become a public Article
- submitted Event data can become a public Event
- moderators can edit the publication fields before approval
- approval uses those edited fields, not the raw submission fields directly
- internal moderation fields stay on the Submission record
- converted records show up through the existing public read surfaces

Some backend conversion work may already exist from Phase 11.2. Treat that as
the service boundary to harden and connect to the UI, not as a reason to skip
the Phase 11.3 acceptance checks.

## The Core Distinction

There are three different shapes involved:

- raw submission fields
- moderation-only fields
- published-domain fields

Raw submission fields are what a visitor originally submitted. They stay
visible for review.

Moderation-only fields help the internal workflow. Examples include
`submitterName`, `submitterEmail`, `reviewNotes`, `reviewedAt`, moderation
status, and submission id. These fields must not become public Article or Event
content.

Published-domain fields are the fields used to create the public record.
Examples include Article `title`, `summary`, `content`, `author`, `status`, and
topic links; or Event `title`, `summary`, `description`, `eventType`,
`startTime`, location fields, `website`, `status`, and topic links.

The approval form sits between the first and third shapes. It starts prefilled
from the raw submission, but the moderator may change it before publishing.

That means the admin submission detail page must use the real moderation detail
API response before the normalization UI can be considered wired. Placeholder
submission data is acceptable for the earlier shell/read-path phase, but it is
not enough for Phase 11.3 approval work.

## Why Normalization Exists

Submitted content is visitor input. Published content is editorial output.

Even when the fields look similar, they have different meaning:

- a submitted title is evidence of what the visitor entered
- a normalized title is the editorial title SignalFire will publish
- a submitter email is private moderation contact data
- an Article author is public article attribution
- resource links are moderation support material in Release 1
- selected topics become public topic relationships

That distinction is why approval should not simply copy the whole Submission
row into Article or Event.

## Required Normalization Fields

The canonical Phase 11 UI spec already defines the field set.

Article normalization:

- title
- summary
- content
- topics
- status
- author

Article also needs an author value because the Article model requires it. Phase
11 derives that value from the submitted credited author when present and
defaults it to `anonymous` when the submitted author is missing. The author does
not need to be editable in the moderation UI, but the approval request should
still include it because it is part of the Article creation payload.

Event normalization:

- title
- summary
- description
- event type
- start time
- end time
- location name
- street address
- city
- region
- country
- postal code
- website
- topics
- status

The approval buttons own the final status:

- `Approve and Publish` creates `PUBLISHED`
- `Approve as Draft` creates `DRAFT`

If the form displays a status control, it must stay in sync with the clicked
approval action.

## Conversion Flow

Approval should work like this:

1. Load the submission.
2. Confirm the submission exists.
3. Confirm it is still `PENDING`.
4. Confirm the approval decision matches the submission type.
5. Validate normalized fields.
6. Resolve normalized topic slugs to seeded Topic ids.
7. Create Article or Event from normalized fields.
8. Link the created record back to the Submission.
9. Mark the Submission `APPROVED`.
10. Save `reviewNotes` and `reviewedAt`.
11. Return created-record metadata for the admin UI.

Steps 7 through 10 should be transactional. If conversion fails, the submission
should not be left approved without a created Article or Event.

## Client State Ownership For Approval Payloads

The admin submission detail route should keep initial data fetching in the
server page. The interactive approval workflow should live in a client wrapper.

The server page should fetch:

- moderation submission detail
- available topic list

Then it should pass both into a client component such as
`SubmissionReviewClient`.

The client wrapper should own:

- review notes
- loading/submitting state
- API error state
- the latest normalized approval payload emitted by the active form
- approve/reject actions

The Article and Event normalization forms can still own their individual field
state. They should notify the wrapper with one complete normalized value when
their state changes, instead of forcing the page to know about every input.

For Article, the emitted value should match `ArticleApprovalPayload`:

```tsx
onChange({
  title,
  summary,
  content,
  author: author.trim() || 'anonymous',
  topicSlugs,
});
```

For Event, the emitted value should match `EventApprovalPayload`:

```tsx
onChange({
  title,
  summary,
  description,
  eventType,
  startTime: fromDateTimeLocalValue(startTime),
  endTime: fromDateTimeLocalValue(endTime),
  locationName,
  publicLocationDescription: emptyToNull(publicLocationDescription),
  addressLine1: emptyToNull(addressLine1),
  addressLine2: emptyToNull(addressLine2),
  city,
  region,
  country,
  postalCode,
  website: emptyToNull(website),
  contactEmail: emptyToNull(contactEmail),
  topicSlugs,
});
```

The approval button should submit the latest normalized value held by the client
wrapper. Do not rebuild the approval payload from the original submitted content
after the moderator edits fields.

## What Should Not Transfer

Do not copy these fields into public Article or Event records:

- `submitterName`
- `submitterEmail`
- `reviewNotes`
- `reviewedAt`
- moderation status labels
- submission id
- contact email as Article data
- article resource links unless canonical scope changes

For Events, `contactEmail` exists on the submission for follow-up but the
current Event model has no public contact-email field. It should stay
moderation-only unless the canonical product spec changes.

## Public Visibility Check

The final proof of Phase 11.3 is not only that records exist in the database.
The approved records need to be visible through the already-built public read
surfaces when their status is `PUBLISHED`.

Good integration coverage should prove:

- approving as `PUBLISHED` creates a record with `publishedAt`
- approving as `DRAFT` creates a record without public visibility
- public Article reads can find the approved Article
- public Event reads can find the approved Event
- topic pages include approved published records through topic relationships
- moderation-only fields are absent from public responses

## Scope Boundary

Do not add:

- authentication hardening
- new public submission endpoints
- topic management
- admin create/edit flows for hand-authored content
- search or discovery improvements
- notification workflows
- review-history tables

Those belong to other phases unless the canonical docs change first.
