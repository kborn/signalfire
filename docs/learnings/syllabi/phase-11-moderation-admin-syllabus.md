# Phase 11 Moderation And Admin Interface Syllabus

## Purpose

This syllabus orients Phase 11 so you can build the first internal content
operations surface without accidentally expanding into auth, analytics, or
full CMS scope.

## Current Task Or Subtask

Phase 11 is about one internal tool surface that covers:

- submission review
- moderation state transitions
- editorial normalization before publication
- create/edit flows for Actions, Articles, and Events

You are not building:

- production auth
- audit logs
- topic management
- notification systems
- delete flows
- search-heavy admin tooling

## Prerequisites

Read these first:

- `docs/agent-governance/progress.md`
- `docs/specs/moderation-workflow.md`
- `docs/specs/009-phase-10-submission-spec.md`
- `docs/specs/011-phase-11-moderation-admin-ui.md`
- `docs/specs/004-domain-entity-definitions.md`

Know these basics before coding:

- a submission record is not the same thing as a published Article or Event
- moderation status and publish status are different state systems
- backend validation is the source of truth
- internal tool UI should optimize for scanability and predictable actions

## Modules In Practical Build Order

### Module 1: Separate moderation records from published content

**Objective**

Understand why submissions stay review records even when they are later
converted into public content.

**Why it matters**

If you treat a submission like a draft Article or Event too early, you blur the
review boundary and make state transitions harder to reason about.

**Key concepts**

- moderation record
- conversion boundary
- raw submitted data vs normalized published data
- one-way transition

**Repo-specific context**

Phase 10 stores anonymous Article and Event submissions under one submission
system. Phase 11 reviews those records, then converts approved items into
published-domain entities.

**Common mistakes**

- editing only the raw submission fields and assuming that is enough to publish
- letting one submission publish multiple times
- mixing moderation status with public content status

### Module 2: Build the queue before review actions

**Objective**

Start with queue visibility and detail retrieval before approve/reject logic.

**Why it matters**

The workflow is easier to debug when moderators can first inspect data
reliably, even before every action button exists.

**Key concepts**

- list contract
- detail contract
- queue segmentation
- read path before write path

**Repo-specific context**

Phase 11.1 in `progress.md` starts with route structure and read paths for the
moderation queue.

**Common mistakes**

- adding approve/reject endpoints before the detail read contract is stable
- overbuilding filters before the basic queue works

### Module 3: Treat approval as a conversion workflow

**Objective**

Understand that approve is not just a status update. It may create a published
Article or Event.

**Why it matters**

This is the most important Phase 11 boundary. The approve action touches
moderation rules, normalization UI, repository mapping, and public read
surfaces.

**Key concepts**

- moderation action
- normalization
- conversion mapping
- duplicate prevention

**Repo-specific context**

Article submissions and Event submissions do not have identical published
shapes, so approval logic will branch by submission type.

**Common mistakes**

- updating submission status first and attempting conversion second without a
  clear failure strategy
- forgetting that approved content must become visible through existing public
  APIs

### Module 4: Keep admin CRUD aligned with public domain contracts

**Objective**

Use existing field shapes and validation expectations for Actions, Articles, and
Events.

**Why it matters**

An admin form that diverges from the domain contract creates hidden cleanup work
later and increases test burden.

**Key concepts**

- shared validation rules
- seeded topic selection
- draft vs published
- create vs edit form reuse

**Repo-specific context**

The project already has public read modules for Actions, Articles, and Events.
Phase 11 adds internal create/edit paths, not a new content model.

**Common mistakes**

- inventing admin-only fields without a canonical spec change
- adding topic CRUD because topic selection exists on content forms

### Module 5: Leave deployment-time hardening for its real phase

**Objective**

Implement the internal interface locally without dragging Phase 13 security work
into the current phase.

**Why it matters**

Phase 11 is active now. Auth hardening is required before deployment, but it is
not the work that should block moderation implementation.

**Key concepts**

- local-only assumption
- deployment boundary
- deferred hardening

**Common mistakes**

- treating lack of auth as permission to skip documenting the boundary
- overbuilding roles and permissions before the interface itself exists

## What "Done Enough" Looks Like

A correct Phase 11 implementation means:

- the admin surface exists under `/admin`
- moderators can see queued submissions and review one submission in detail
- pending submissions can move to approved or rejected exactly once
- approval can create published content from normalized fields
- admin can create and edit Actions, Articles, and Events

It does not mean:

- complete back-office tooling
- deployment-ready security
- every operational feature a future editor might want

## Suggested Next Learning Docs

After this syllabus, use:

- `docs/learnings/implementation-guides/phase-11-moderation-state-and-admin-form-guide.md`
- `docs/learnings/walkthroughs/phase-11-moderation-admin-walkthrough.md`
