# Roadmap

## Milestone Framing

### Milestone 1

Milestone 1 ends when the project is a portfolio-quality deployed demo:

- clean architecture and repository documentation
- complete submission and moderation workflow
- polished public discovery experience
- deployable public site with an intentional demo posture
- clear demo access path into the admin experience for recruiter-style review

Milestone 1 is the finish line for the portfolio objective. It does not require
real-user growth, automated ingestion, or a production community engine.

### Milestone 2

Milestone 2 is a focused single-city launch. The goal is to prove the
topic-relevance pipeline and moderation workflow against live content before
expanding geographically.

**Product shape:**

- Launch in one target metro area with real users
- Introduce automated event discovery via a curated-source crawler
- Keep the human moderation review gate: no content publishes without editorial approval
- Evaluate whether the visitor experience and contributor loop are working before expanding

**Event crawler:**

- Curated source list for the target city: local government calendars, known
  civic org sites, Meetup and Eventbrite topic searches
- Crawler runs on a nightly schedule and fetches candidate event pages
- Claude API handles structured extraction (title, date, time, location,
  description) and topic classification in a single pass
- Extracted events enter the existing submission queue as `pending` records
- No new database or storage infrastructure required; the existing moderation
  workflow handles review before publication

**Open questions for Milestone 2 planning:**

- Which city launches first and why
- How submission feedback loops and distribution work for real contributors
- What launch success looks like after 90 days with real users
- How to close the gap between any "community-powered" framing and the actual
  contributor experience at launch scale

### Milestone 3

Milestone 3 is geographical expansion. The single-city Milestone 2 pass
validates the extraction pipeline, source discovery approach, and moderation
throughput before scale increases.

- Roll the crawler pattern out to additional cities using the same curated-source model
- Expand the topic taxonomy if new geographies surface civic themes not
  represented in the current seed set
- Evaluate crawler infrastructure limits as source volume grows; the current
  Railway-hosted worker pattern is sufficient through early Milestone 3
- Consider deeper geographic discovery features (neighborhood-level filtering,
  distance from user) if usage data supports the investment

---

## V2

V2 is the earliest likely implementation window after Milestone 1 if the
project moves beyond portfolio scope.

High-confidence V2 themes:

- moderation notification emails
- submission status feedback for contributors
- event ingestion / crawler planning and review workflow expansion
- content intelligence review assist
- Tags as a secondary classification layer
- Replace ILIKE substring search with tag-based or structured filtering — current behavior matches noise terms like "the" and returns low-signal results
- expanded content relationships
- Copy review pass across all public surfaces for tone, consistency, and nit improvements

Possible but not yet committed V2 themes:

- local-first launch support and deeper geographic discovery
- coaching/resilience content strategy
- moderator roles
- limited user-facing submission history without full community accounts

V2 should also resolve the Release 1 contributor-loop limitation before the
public product leans heavily on community-powered messaging.

---

## V3

- user accounts
- topic administration via Admin UI
- topic subscriptions
- email or SMS notifications
- improved discovery filters beyond Release 1 needs
- action collections

---

## V4

- organization profiles
- contributor reputation system
- impact tracking
