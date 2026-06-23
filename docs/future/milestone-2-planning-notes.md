# Milestone 2 Planning Notes

## Purpose

Capture high-value Milestone 2 strategy notes without promoting them into
active canonical specs before they are implementation-ready.

This file is a planning holding area, not a phase contract.

For canonical current-state scope, use:

- `docs/agent-governance/progress.md`
- `docs/specs/001-release1-scope.md`
- `docs/specs/002-roadmap.md`
- `docs/specs/v2-content-intelligence-proposal.md`

---

## Milestone 1 vs Milestone 2

Milestone 1 is the portfolio finish line:

- polished public experience
- complete moderation/admin workflow
- deployed demo posture
- intentional path for reviewers to see both public and admin value

Milestone 2 is a separate product decision:

- determine whether `Find Your Fight` should become a real-user product
- decide product posture, launch geography, operating model, and distribution
- convert only the validated portions of these notes into future specs

---

## Core Product Question

Before Milestone 2 feature planning begins, decide whether the emotionally
overwhelmed visitor is:

- a primary audience
- a secondary audience
- an edge case

If they are primary or secondary, future planning must answer:

- whether the homepage needs a second entry point for people not ready to pick
  an issue yet
- whether coaching/resilience content should be a content type, a section, or a
  cross-site editorial voice

This decision changes Milestone 2 information architecture and should precede
feature sequencing.

---

## Geography and Launch Posture

Open question:

- should Milestone 2 launch nationally or in one target metro area first?

Working recommendation from the review notes:

- launch local-first for events, submissions, and organizing depth
- keep articles and actions as geographically neutral as the content warrants
- pick the target city before planning content and ingestion at scale

---

## Event Ingestion

The strategic recommendation is that automated event ingestion is a Milestone 2
problem, not a Phase 12 or Milestone 1 problem.

Key notes:

- likely accessible sources include Eventbrite, Mobilize, local government
  calendars, and some nonprofit/community sites
- inaccessible or poor-fit sources include Facebook Events, Meetup, and generic
  Google Calendar aggregation
- crawled events will require review, deduplication, and normalization
- higher event volume likely needs a faster moderation path than community
  submissions

Any future ingestion design should be planned alongside moderation workflow
changes rather than as a crawler-only feature.

---

## Content and Editorial Readiness

Working notes:

- community submissions are unlikely to succeed on an empty site
- a credible launch likely needs meaningful editorial inventory first
- AI-assisted drafting may help with research and structure, but human voice is
  especially important in civic content and even more important in any future
  coaching/resilience content

These are planning assumptions, not current implementation requirements.

---

## Community Loop

Strong candidate Milestone 2 capability:

- submission receipt email
- approval/rejection status email

Rationale:

- submitters need a feedback loop to become repeat contributors
- this can materially improve perceived legitimacy without requiring user
  accounts

Related provider ideas from the review notes:

- Resend
- Postmark
- SendGrid

---

## Technical Debt — Sticky Header Stacking

The public topicSelector (ISSUE filter bar) computes its sticky `top` offset
using three CSS variables: `--public-sticky-offset` (header height),
`--demo-banner-height` (always 0px, never dynamically set), and
`--demo-banner-gap`. This means the filter bar does not account for the
demo banner's actual rendered height and sits flush against the banner bottom
when both are sticky at the same time.

The proper fix: a `ResizeObserver` on `.site-sticky-area` (or on the banner
element specifically) that writes the measured height into `--demo-banner-height`
at runtime. This makes the topicSelector offset self-correcting regardless of
banner content or viewport width.

Deferred from Phase 14.11 as low-priority for Milestone 1 demo context.

---

## Distribution and Sustainability

Open planning areas:

- identify the first 2-3 organizations or local partners whose audience overlaps
  with the target user
- define launch distribution channels before launch, not after
- define what success looks like 90 days after launch
- clarify whether the long-term model is donations, grants, adjacent services,
  or continued portfolio value

These should become future roadmap or launch docs only after the project
commits to a real-user Milestone 2.
