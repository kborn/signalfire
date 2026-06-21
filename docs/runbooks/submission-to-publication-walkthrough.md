# Runbook — Submission → Moderation → Publication Walkthrough

**Purpose:** Manual end-to-end verification of the content pipeline.
`scripts/rc-smoke.mjs` confirms routes respond but does not verify the full workflow.
Run this walkthrough to validate that a submission flows correctly from public capture
through admin review into published public visibility.

---

## Prerequisites

1. Dev server running: `pnpm dev`
2. Database seeded: `cd apps/api && pnpm exec prisma db seed`
3. Admin credentials available (see README for demo admin setup)
4. Browser open to `http://localhost:3000` (public) and `http://localhost:3000/admin` (admin)

---

## Part 1 — Article Submission

### 1.1 Submit via public form

1. Navigate to `http://localhost:3000/submit`
2. Choose **Article**
3. Fill in:
   - **Title**: anything (e.g. "Test Article Submission")
   - **Summary**: 1–2 sentences
   - **Content**: body text (Markdown supported)
   - **Author**: your name or "Test Author"
   - **Topic**: choose any topic from the dropdown
4. Submit the form
5. Confirm you see the success state — it should confirm that the submission is under review, not strand you

### 1.2 Verify in admin queue

1. Navigate to `http://localhost:3000/admin/submissions`
2. Confirm the new submission appears in the **Pending** queue
3. Click the submission title to open the detail page
4. Confirm submitted content, author, topic, and timestamp are visible

### 1.3 Approve and publish

1. In the submission detail, review and normalize:
   - Adjust title or author if needed
   - Confirm topic assignment
   - Optionally add review notes
2. Click **Approve & Publish**
3. Confirm the success state — it should show the created Article record with a link to the admin article editor or the public article page

### 1.4 Verify public visibility

1. Navigate to `http://localhost:3000/articles`
2. Confirm the new article appears in the list
3. Click through to the article detail page
4. Confirm title, summary, author, and body content render correctly
5. Confirm the breadcrumb links back to the correct topic
6. Confirm related "Explore This Issue" section points to the topic assigned during submission

---

## Part 2 — Event Submission

### 2.1 Submit via public form

1. Navigate to `http://localhost:3000/submit`
2. Choose **Event**
3. Fill in:
   - **Title**: anything (e.g. "Test Event Submission")
   - **Summary**: 1–2 sentences
   - **Description**: longer body text
   - **Start time / End time**: any future date/time
   - **Event type**: pick any
   - **Address**: street address, city, state, zip
   - **Topic**: choose any topic
4. Submit the form
5. Confirm success state with next-steps messaging

### 2.2 Verify in admin queue

1. Navigate to `http://localhost:3000/admin/submissions?type=EVENT`
2. Confirm the submission appears in the **Pending** queue
3. Open the detail page and verify all submitted fields are present

### 2.3 Approve and publish

1. In the submission detail, normalize the event:
   - Confirm or edit address fields (addressLine1, addressLine2, publicLocationDescription)
   - Confirm state and postal code are populated (required for publishing)
   - Confirm start/end times
2. Click **Approve & Publish**
3. Confirm the created Event record link appears in the success state

### 2.4 Verify public visibility

1. Navigate to `http://localhost:3000/events`
2. Filter by the topic used in the submission (or search by city/state)
3. Confirm the event appears in results
4. Click through to the event detail page
5. Confirm title, time (in local timezone), location, description, and related topic render correctly

---

## Part 3 — Rejection Flow

### 3.1 Submit and reject

1. Submit a second article or event via the public form
2. In the admin queue, open the new submission
3. Add review notes explaining the rejection reason
4. Click **Reject**
5. Confirm the submission moves to the **Rejected** queue
6. Confirm the review notes and reviewer timestamp are visible on the detail page

### 3.2 Verify content is not public

1. Navigate to the relevant public list page (`/articles` or `/events`)
2. Confirm the rejected submission does NOT appear

---

## Part 4 — Draft Approval (Article)

The approve flow supports creating a draft article (not immediately published).

1. Submit an article via the public form
2. In the admin queue, open the submission and approve it **without** checking the publish option
   (if the form supports draft vs. publish distinction)
3. Confirm the created record appears in `/admin/articles` with a draft status
4. Navigate to the draft article editor and publish it
5. Verify it becomes visible on `/articles`

---

## Known Smoke Check Complement

`scripts/rc-smoke.mjs` covers:

- Route responses (200 / redirect expected for auth-gated routes)
- Admin auth redirect behavior
- Public nav and key copy assertions

This walkthrough covers what the smoke script cannot:

- Form submission persistence
- Moderation state transitions
- Publication pipeline correctness
- Public visibility after approval

---

## Edge Cases to Check

- [ ] Submitting with missing required fields shows field-level validation errors, not a generic failure
- [ ] Rejecting a submission and then re-opening it shows "Rejected" state with review notes
- [ ] Approving a submission that was already approved returns a clear error (not a silent duplicate)
- [ ] Navigating to a submitted article URL before approval returns 404
- [ ] Cache revalidation: after publishing, the article appears on the public list without requiring a server restart (may take up to 60 seconds due to `revalidate = 60`)
