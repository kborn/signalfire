# Release 1 Scope

## Purpose

Define the explicit feature scope for Release 1.

---

# Core Platform Capabilities

## Topic Discovery

Users can browse civic issues by topic.

Each topic page includes:

- related articles
- related actions
- related events

---

## Articles

The platform publishes informational content such as:

- blog posts
- issue explainers
- civic participation guides

Articles provide context and education.

---

## Actions

Actions provide specific steps users can take.

Examples:

- boycotts
- donations
- contacting representatives
- volunteering

Actions are curated by administrators.

---

## Events

Users can discover civic events such as:

- protests
- volunteer events
- town halls
- educational workshops

Events may be filtered by:

- topic
- date
- location

---

## Event Submission

Visitors may submit events.

Submissions enter a moderation queue.

---

## Article Submission

Visitors may submit article content for review.

Release 1 submissions are moderated intake, not a full contributor platform.
The public product should not imply richer contributor account or notification
capabilities than actually exist in the shipped release.

---

## Moderation

Administrators can:

- approve submissions
- reject submissions
- edit curated content

Moderation and essential admin editing may share one internal interface in Release 1.
That interface does not need production-grade access control during local-only development,
but it must be protected before deployment to a real user environment.

---

# Explicitly Excluded From Release 1

The following are intentionally excluded:

- user accounts
- comments or forums
- contributor notification emails or submission-status follow-up automation
- automated event crawling
- background session-cleanup scheduling for admin auth
