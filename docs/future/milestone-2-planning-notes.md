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

## Cross-Entity Relationship Management

### Current state

The data model supports many-to-many relationships between Articles, Actions, and
Events via join tables (`articleActions`, `articleEvents`, `actionEvents`). The
public detail pages query and render these relationships: article detail shows
linked actions under "Take Action," action detail shows linked articles under
"Read First," event detail shows linked articles and actions.

The demo seed populates all of these relationships, so the live demo demonstrates
the intended editorial ideal — an article about climate policy links directly to
the specific actions a reader can take on that issue.

### The gap

**No admin UI exists to manage cross-entity relationships.** The article and
action editors support topic assignment only. Any content created through the
admin has zero cross-entity links. The public pages fall back gracefully to
topic-filtered CTAs ("Find actions on {topic}") when explicit links are absent,
but that is a generic fallback, not curated editorial connection.

There is also **no submitter pathway**. Community members who submit articles or
events have no mechanism to express editorial intent — they cannot say "this
article pairs with that action" or "this event is the on-ramp for this article."
The submission form captures content only. Cross-entity mapping, if it ever
happens, must currently be done by a curator after publication, and only by
directly manipulating the database.

### Why this matters for a real-user product

The explicit article ↔ action link is the most important editorial unit on this
platform. The journey model (issue → read → act) depends on a curator having
assembled that path. Without relationship management, every published article is
editorially disconnected from the actions a reader would take next unless a
developer seeds the connection manually.

At demo scale this is invisible — the seed is coherent. At any real content
volume it becomes the central editorial workflow problem.

### Candidate Milestone 2 approaches

**Option A — Admin relationship UI**
Add multi-select relationship pickers to the article, action, and event editors.
An editor creating an article selects which actions it pairs with. Standard
many-to-many join table writes. No new infrastructure, just form scope. This is
the minimal correct fix for editorial workflow.

**Option B — AI-assisted relationship suggestions with editorial validation**
When content is published, run an LLM pass over the new record and the existing
published content pool to suggest likely relationships based on topic overlap,
entity mentions, and thematic similarity. Surface suggestions in the admin for
a curator to accept or dismiss. This removes the burden of knowing what to link
while keeping editorial control. Adds LLM dependency and a review step to the
publication workflow.

**Option C — Submission-time intent capture**
Add optional free-text or structured fields to the submission form so submitters
can signal intent ("this relates to action X," "I wrote this in response to
article Y"). Not a binding link — purely editorial signal for the moderator
during review normalization. Low implementation cost, low signal quality.

**Option D — Topic-derived implicit relationships (no explicit links)**
Drop the join tables from the public UI and replace explicit cross-entity sections
with topic-filtered queries ("Other actions in this issue"). Simpler operationally,
removes the editorial curation requirement, but loses the ability to surface a
specific pairing — "read this article, then take this action" — which is the core
product value proposition of the journey model.

### Recommendation

Option A is the minimum viable editorial workflow fix. Option B is the right
long-term approach for a content-at-scale product. Option D should be treated as
a fallback posture, not a design goal, since it eliminates the curated signal that
differentiates this platform from a generic content directory.

---

## Admin Content Deletion

Currently the admin workspace supports create/edit/publish for Actions, Articles,
and Events, but has no delete capability. Unpublishing is available but records
persist in the database.

Planned for Milestone 2:

- Delete action from admin action editor/list
- Delete article from admin article editor/list
- Delete event from admin event editor/list
- Soft-delete (set a `deletedAt` timestamp, exclude from public and admin list
  views) is preferred over hard-delete to preserve submission audit trails and
  prevent accidental data loss
- Deletion should be blocked or warn when content has linked submissions or
  related records that would become orphaned

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
