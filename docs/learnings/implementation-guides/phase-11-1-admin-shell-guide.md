# Phase 11.1 Admin Shell Guide

This guide explains how to think about the Phase 11.1 admin pages while building
the static moderation shell. The canonical product requirements remain in
`docs/specs/011-phase-11-moderation-admin-ui.md`.

## What Phase 11.1 Is Building

Phase 11.1 is a shell and read-path foundation. It should make the admin surface
visible and navigable before moderation decisions are wired.

The frontend routes are:

- `/admin`
- `/admin/submissions`
- `/admin/submissions/[id]`

The backend work supports:

- listing moderation submissions
- retrieving one moderation submission
- filtering by moderation status and submission type

Do not add approve/reject behavior, publication conversion, or admin content
editing in this subphase.

Links between the shell routes should work:

- `/admin` links to `/admin/submissions`
- `/admin/submissions` includes a visible detail link shape pointing to
  `/admin/submissions/1`
- `/admin/submissions/[id]` links back to `/admin/submissions`

If static placeholder data is used, it should look non-authoritative. It should
not imply that moderation actions are functional.

## Admin Layout Mental Model

The admin area should feel like an internal tool, not a public landing page.

Prefer:

- compact page headers
- quiet bordered panels
- tables or dense rows for record lists
- clear links for navigation
- disabled controls only where future behavior needs to be visible

Avoid:

- marketing-card grids
- decorative hero sections
- nested cards
- large visual flourishes
- controls that look functional before they are wired

## Shared Admin Navigation

The admin layout should define the internal admin nav once, then let nested admin
pages inherit it.

Expected labels:

- `Admin Home`
- `Submissions`
- `Actions`
- `Articles`
- `Events`

This nav is a secondary admin navigation area. It does not replace the primary
site navbar.

If Actions, Articles, and Events shells have not been added yet, those labels
can render as disabled-looking text. Do not include Topic management in the
Release 1 admin nav.

## CSS Class Shape

Use global admin classes in `apps/web/src/app/globals.css` so the shell stays
consistent with the rest of the app.

Useful classes:

- `.adminShell`: wrapper for admin-specific vertical spacing
- `.adminHeader`: page title/dek plus optional metadata or controls
- `.adminDek`: admin-specific intro copy
- `.adminNav`: secondary admin navigation
- `.adminNavLabel`: optional label for the admin nav group
- `.adminGrid`: responsive dashboard grouping
- `.adminPanel`: quiet bordered workspace section
- `.adminPanelHeader`: heading row inside a panel
- `.adminToolbar`: wrapping control/status row
- `.adminSegmentedControl`: status filter links or buttons
- `.adminFilterGroup`: smaller grouped filter/action controls
- `.adminTable`: record table
- `.adminTableLink`: visible table-cell link
- `.adminTableCellMeta`: muted secondary text under a table title
- `.adminBadge`: compact metadata pill
- `.adminEmptyState`: loaded-but-empty message area
- `.adminDetailLayout`: optional detail page two-column layout if a later design
  reintroduces a side panel
- `.adminReviewMain`: primary review column
- `.adminMetadataPanel`: optional secondary detail metadata panel
- `.adminSection`: page section grouping
- `.adminDefinitionList`: labeled field/value list for one record
- `.adminPlaceholder`: visibly unwired placeholder region

An admin panel is a grouped workspace section. It should have a heading, modest
padding, a plain border, and related content. It is not a decorative card.

Useful CSS behavior:

- `.adminShell` can use `display: grid` with a vertical gap around
  `var(--space-4)`
- `.adminNav` should use a wrapping flex row with text links
- `.adminGrid` should use responsive grid columns for dashboard panels
- `.adminPanel` should use a `1px solid #e5e7eb` border, `8px` radius, and
  modest padding
- `.adminToolbar` should wrap on desktop and stack naturally on mobile
- `.adminTable` should use `width: 100%`, collapsed borders, compact cell
  padding, and horizontal overflow protection on narrow screens
- `.adminDetailLayout` should only be used if the page actually needs a side
  panel; the current review shell can use one primary column
- `.adminPlaceholder` should use muted text and a dashed or light border only
  when it helps communicate an unwired shell area

## `/admin` Page Shape

The admin home page is a dashboard, not just duplicate navigation.

It should show:

- page header: `Admin`
- moderation overview
- pending submissions as the primary work queue
- approved and rejected as secondary history indicators
- content management overview for Actions, Articles, and Events

Recommended top-level order:

1. admin navigation from the shared layout
2. page header
3. moderation overview
4. content management overview

Header copy:

- H1: `Admin`
- dek: `Review submissions and manage published content.`

Approved and rejected links are useful because admins may need traceability,
duplicate-submission checks, and basic moderation history. They should not look
as urgent as pending review.

Moderation overview shell content:

- `Pending review`
  - placeholder count: `--`
  - helper copy: `Submissions awaiting review will appear here after the moderation API is connected.`
  - link text: `Review pending submissions`
  - href: `/admin/submissions?status=PENDING`
- `Approved`
  - placeholder count: `--`
  - helper copy: `Reviewed submissions remain available for traceability and moderation history.`
  - href: `/admin/submissions?status=APPROVED`
- `Rejected`
  - placeholder count: `--`
  - helper copy: `Reviewed submissions remain available for traceability and moderation history.`
  - href: `/admin/submissions?status=REJECTED`

The content management overview exists to preview the full admin surface. In
Phase 11.1, it should only link to placeholder/shell pages if those shells have
been explicitly added.

Content management shell rows:

- `Actions`: `Create and update curated civic actions.`
- `Articles`: `Manage published explainers and editorial content.`
- `Events`: `Manage real-world participation opportunities.`

## `/admin/submissions` Page Shape

This page represents the future moderation queue.

Recommended top-level order:

1. admin navigation from the shared layout
2. page header
3. status segmented control
4. type filter control
5. queue records panel

Header copy:

- H1: `Submissions`
- dek: `Review community-submitted articles and events.`

Use URL query params for filters because the selected queue state should survive
refresh, direct links, and future server-side data fetching.

Status segmented control:

- accessible label: `Submission status`
- options in order: `Pending`, `Approved`, `Rejected`
- default visible active option: `Pending`

Status examples:

- `/admin/submissions?status=PENDING`
- `/admin/submissions?status=APPROVED`
- `/admin/submissions?status=REJECTED`

Type filter control:

- label: `Type`
- options in order: `All`, `Article`, `Event`

Type examples:

- `/admin/submissions`
- `/admin/submissions?type=ARTICLE`
- `/admin/submissions?type=EVENT`

When combining filters, preserve the existing filter while changing the other
one:

- current URL: `/admin/submissions?status=APPROVED`
- user selects Article
- next URL: `/admin/submissions?status=APPROVED&type=ARTICLE`

The records area should be visually tied to the filter controls, usually by
placing the table inside an `.adminPanel`.

Queue table columns:

1. `Title`
2. `Type`
3. `Status`
4. `Submitted`
5. `Submitter`
6. `Email`

Phase 11.1 sample record content:

- title: `Sample submission`
- summary: `A short summary of the submitted content will appear here.`
- type: `Article`
- status: `Pending`
- submitted: `Not connected`
- submitter: `Anonymous`
- email: `Not provided`

For the Phase 11.1 dummy row:

- make the title the visible link to `/admin/submissions/1`
- show the summary as muted text under the title
- do not make the full row clickable
- do not add a separate `Review` column where every row says the same thing

If you intentionally defer the table, keep the empty state inside the same
records panel:

- headline: `No submissions loaded`
- body: `The queue structure is ready. Submissions will appear here after the admin API is connected.`

## `/admin/submissions/[id]` Page Shape

The detail page is the future moderation review workspace.

Use:

- a back link to `/admin/submissions`
- a page header with title/dek and metadata badges
- a top metadata panel for submitter and operational record facts
- `.adminReviewMain` for the primary review sections

Recommended top-level order:

1. admin navigation from the shared layout
2. back link
3. page header
4. submission metadata
5. review workflow sections

Back link:

- text: `Back to submissions`
- href: `/admin/submissions`

Header copy:

- H1: `Submission review`
- dek: `Inspect submitted content before recording a moderation decision.`

Header metadata placeholders:

- `Type`: `Not loaded`
- `Status`: `Pending`
- `Submitted`: `Not connected`

Top metadata panel rows:

1. `Submission ID`: use the route id when available
2. `Submitter`: `Anonymous` or the loaded submitter name
3. `Email`: `Not provided` or the loaded submitter email
4. `Reviewed`: `Not reviewed` or the loaded reviewed timestamp

The root app layout already owns the page-level `<main>` landmark. Inside a page
file, prefer a `<div>` or `<section>` for the review column rather than nesting
another `<main>`.

The review sections should eventually be:

1. submitted content
2. editorial normalization
3. review notes
4. decision actions

Phase 11.1 section copy:

- `Submitted content`: submitted article or event fields, currently dummy or
  placeholder read-only data
- `Editorial normalization`: `Normalization fields will be prefilled from the submission during the approval workflow.`
- `Review notes`: `Internal notes`, with a disabled textarea if rendered
- `Decision actions`: disabled or inert controls for `Approve and Publish`,
  `Approve as Draft`, and `Reject`

Review notes helper copy:

`Review notes are internal and will be saved with a moderation decision in a later Phase 11 task.`

Decision actions helper copy:

`Moderation actions are not wired in Phase 11.1.`

In Phase 11.1, dummy read-only data is fine. A `<dl>` is a good fit for
submitted-content facts because it represents labeled fields for one record:

```tsx
<dl className="adminDefinitionList">
  <dt>Title</dt>
  <dd>Sample submission</dd>

  <dt>Summary</dt>
  <dd>A short summary of the submitted content.</dd>

  <dt>Topics</dt>
  <dd>Democracy, Climate</dd>
</dl>
```

Use a table for multiple records. Use a description list for fields on one
record.

## Placeholder Copy

Placeholder copy is allowed only to communicate that a region is intentionally
unwired. Once API data is connected, replace placeholder paragraphs and dummy
labels with real read-only fields.

Examples:

- `Not connected`
- `Not loaded`
- `Moderation actions are not wired in Phase 11.1.`

Avoid copy that implies the action has already happened or can be submitted.

## Semantic HTML Notes

`<header>` can be used for page or section intro content. It does not only mean
navbar.

`<main>` should generally appear once per rendered page. Because the root
Next.js layout already wraps page content in `<main>`, nested page components
should usually avoid adding another one.

`<section>` is useful when a region has a real heading.

`<aside>` is useful for secondary metadata that supports the main review
workflow but is not the primary content.

`<dl>`, `<dt>`, and `<dd>` are useful for labeled facts about one record.

## When The API Is Wired

The route and layout structure should remain. The static content should be
replaced with live data:

- pending/approved/rejected counts come from backend data
- queue rows come from the moderation list endpoint
- detail fields come from the moderation detail endpoint
- placeholder paragraphs are removed
- disabled decision actions become real Phase 11.2 controls
