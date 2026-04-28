# V2 Content Intelligence Proposal

## Purpose

Define a future-scope proposal for adding AI-assisted editorial review, a Tag
concept, and expanded content relationships after Release 1.

This document is not part of the active Phase 11 implementation contract.

It exists to capture a coherent V2 direction so later work can be designed
intentionally instead of emerging piecemeal from moderation or admin tooling.

---

## Why This Is Not Release 1

Release 1 moderation needs:

- queue review
- approval and rejection
- normalization before publication
- essential admin content management

The features in this proposal add a second capability layer:

- AI-generated review suggestions
- richer classification beyond Topics
- broader relationship management across content

These require separate product, data-model, and editorial trust decisions, so
they are explicitly deferred to V2.

---

## V2 Goals

V2 should help staff:

- review submitted or draft content faster
- find likely related content without manual database hunting
- apply finer-grained content classification
- create richer cross-linking between published objects

V2 should improve editorial efficiency without removing human control over what
is published or linked.

---

## V2 Capability Areas

This proposal covers three connected areas:

1. AI review assist
2. Tags
3. Expanded content relationships

---

## 1. AI Review Assist

### Goal

Add an AI-assisted review layer to moderation and editorial workflows.

### Intended AI assistance

AI may suggest:

- grammar or clarity improvements
- style cleanup suggestions
- possible factual-risk flags
- possible duplicate or near-duplicate content
- likely related Articles
- likely related Actions
- likely related Events
- likely Tags
- possible Topic mismatches or missing Topic assignments

### Human approval boundary

AI output must remain advisory in V2.

The system must not:

- auto-publish content
- auto-approve submissions
- auto-create public relationships
- auto-apply Tags without human confirmation
- auto-rewrite canonical published content without human confirmation

### Fact-checking caution

Fact-check assistance should be treated as a risk-flagging tool, not as a
source of truth.

In practice, that means V2 should prefer:

- claim-risk identification
- requests for human verification
- possible source prompts for editorial follow-up

over:

- authoritative truth scoring
- silent factual correction
- unsupervised acceptance or rejection decisions

### Suggested moderation workflow impact

AI assist should appear after the raw submission is viewable and before final
approval or rejection.

At a high level:

1. moderator opens a submission or draft content record
2. system may generate review suggestions
3. moderator reviews suggestions
4. moderator accepts, ignores, or manually applies changes
5. moderator remains the final decision-maker

### Suggested V2 UI behaviors

The interface may include:

- `AI review` panel on submission detail and content edit pages
- grouped suggestion sections such as `Writing`, `Risk flags`, `Related content`,
  and `Suggested tags`
- per-suggestion accept, ignore, or dismiss behavior

V2 does not require conversational AI editing as a first milestone.

---

## 2. Tags

### Goal

Introduce Tags as a secondary classification layer that is more granular than
Topics.

### Relationship to Topics

Topics remain the primary organizing layer.

Tags are secondary and should be used for:

- narrower themes
- campaign names
- recurring concepts
- issue subcategories
- event formats or editorial motifs when useful

Topics answer:

- what broad civic issue area does this belong to?

Tags answer:

- what more specific concepts or associations apply here?

### V2 Tag rules

- Tags are assignable to Articles, Actions, and Events
- Tags do not replace Topics
- Tags should be many-to-many
- Tag selection should remain human-reviewed even if AI suggestions exist

### Out-of-scope questions for the first V2 pass

These may be delayed until later in V2 planning:

- whether Tags are publicly visible on Release 1 pages immediately
- whether Tags drive public filtering in the first Tag release
- whether Tags are admin-created, curated from a controlled list, or partially
  open-ended

### Recommended initial V2 stance

Start with:

- admin-managed Tags
- AI-suggested Tag candidates
- manual acceptance before persistence

This is the lowest-risk path.

---

## 3. Expanded Content Relationships

### Goal

Allow richer explicit relationships between published content objects.

### Current Release 1 boundary

Release 1 requires Topic relationships and allows only limited optional
cross-type relationships.

Release 1 intentionally defers:

- Article <-> Article
- Event <-> Event
- Action <-> Action
- generalized related-content graphs

### V2 expansion

V2 should allow same-type relationships:

- Article <-> Article
- Event <-> Event
- Action <-> Action

V2 may also broaden explicit cross-type relationships where useful:

- Article -> Action
- Article -> Event
- Action -> Event
- Event -> Article
- Event -> Action

### Relationship intent

These relationships should support:

- richer discovery surfaces
- editorial curation
- better "related content" modules
- AI-assisted association suggestions with human confirmation

### Human approval boundary

AI may suggest relationships, but humans must confirm them before they become
publicly visible.

### Recommended V2 behavior

Start with:

- manually approved relationships only
- no auto-generated public graph
- lightweight admin UI for accepting or removing proposed links

---

## Proposed Operating Model For Suggestions

To keep AI suggestions safe and reviewable, V2 should separate:

1. suggested changes
2. accepted changes
3. published content state

Suggested relationships or tags should not be treated as real content state
until a moderator or editor accepts them.

This implies a distinct suggestion lifecycle such as:

- generated
- reviewed
- accepted
- dismissed

The exact persistence model can be defined in a later architecture doc.

---

## Suggested V2 Product Rules

### Rule 1: AI suggests, humans decide

All AI-generated edits, tags, and relationships require human review.

### Rule 2: Topics remain primary

Tags enrich classification but do not replace Topics as the main discovery
structure.

### Rule 3: Public relationships must be explicit

Only accepted relationships become visible in public read surfaces.

### Rule 4: Same-type relationships are allowed

V2 may explicitly relate:

- articles to articles
- events to events
- actions to actions

### Rule 5: Fact-check assistance is advisory

AI may raise verification concerns, but it must not become an unsupervised
editorial authority.

---

## Non-Goals For The First V2 Pass

The first V2 implementation should not require:

- autonomous moderation
- autonomous approval or rejection
- automatic public tagging
- automatic public relationship creation
- a full trust-and-safety scoring system
- generalized web crawling as a required first release dependency

If external crawling or retrieval is later added to support association
suggestions, it should be treated as a separate architectural decision.

---

## Recommended V2 Sequencing

### V2.1 - Suggestion foundation

- define AI suggestion lifecycle
- define moderation/editor review surfaces for suggestions
- add advisory writing and risk-flag suggestions

### V2.2 - Tags

- add Tag entity/model
- support Tag assignment in admin
- support AI-suggested Tags with human acceptance

### V2.3 - Relationship expansion

- add same-type relationship support
- add admin UI for managing accepted relationships
- add AI-suggested related-content candidates

### V2.4 - Discovery integration

- expose accepted relationships and optional Tags in public read surfaces
- improve related-content modules and discovery behavior

---

## Open Questions For Later Design Work

- Should Tags be visible to public users immediately or first used only
  internally?
- Should AI suggestions run only on submissions, or also on manually created
  drafts?
- Should suggestion generation be synchronous in the review UI or asynchronous
  in the background?
- Should accepted relationships be directional, bidirectional, or configurable
  per relationship type?
- What editorial language should distinguish "AI suggestion" from "verified
  content decision" in the UI?
- If crawling is added later, what sources are trusted and how is provenance
  surfaced?

---

## Expected Outcome

After V2 planning and implementation, the platform should have:

- human-reviewed AI assistance in moderation and editorial workflows
- a Tag layer that complements Topics
- richer, explicit content relationships including same-type relationships

without weakening the editorial approval boundary established in Release 1.
