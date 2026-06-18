# Phase 11.6 Demo Content And Screenshot Flow

Use this checklist when preparing portfolio screenshots or reviewing whether the
local demo dataset presents the public product credibly.

For the canonical Milestone 1 release checklist and screenshot-verification
requirements, also see
`docs/specs/016-phase-13-milestone-1-release-readiness.md`.

## Seed Mode

Use the demo seed locally:

```bash
pnpm api:prisma:migrate:seed:demo
```

The baseline seed remains production-safe and inserts only Topics. Demo seed
mode adds local Articles, Actions, Events, relationships, and moderation
submissions.

## Public Screenshot Flow

Generate the standard screenshot set with:

```bash
node scripts/regenerate-doc-screenshots.mjs
```

Recommended public routes:

- `/` - product purpose and primary journey
- `/about` - focus-to-action philosophy
- `/topics` - issue discovery
- `/topics/climate` - issue detail with related Articles, Actions, and Events
- `/articles/building-a-local-campaign-from-first-meeting-to-public-pressure` -
  long-form Markdown content
- `/actions/join-neighborhood-climate-coalition` - practical action detail
- `/events` - upcoming event list with multiple published demo events
- `/submit` - public contribution entry point
- `/submit/article` or `/submit/event` - submission form and guidance

## Admin Screenshot Flow

Recommended admin routes:

- `/admin` - operational admin landing
- `/admin/submissions` - moderation queue with filters
- `/admin/submissions?status=PENDING` - pending review queue
- a pending submission detail route - editable normalization and review actions
- an approved submission detail route - created-record outcome panel

Admin screenshots should make clear that this is a local/admin workflow, not a
publicly deployed interface.

## Demo Content Checks

Before taking screenshots, confirm:

- public lists contain more than one credible item where possible
- detail pages have related content below the primary content
- one long-form article demonstrates Markdown rendering
- Events use future dates from the current local seed run
- admin submissions include pending and approved states
- no demo copy promises personalization, social networking, platform-hosted
  organizing, or real-world outcomes the product does not provide
