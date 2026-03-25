# Learning Artifact Workflow

This document defines how AI agents should create and maintain learning
artifacts for implementation work in this repository.

## Purpose

The goal is to teach the human through the actual work of the project rather
than through detached tutorials.

This workflow has two primary artifact types:

- `syllabus`: orientation and sequencing for a phase or subtask
- `implementation guide`: phase-scoped framework explanation for getting unstuck
- `walkthrough`: concrete repo path through the current phase task

A syllabus should not be treated as the only hands-on teaching mechanism for an
unfamiliar framework. When the human needs the framework mechanics explained in
the context of the current task, produce or refresh an implementation guide as
well.

When the human understands the concepts but still does not know what to edit in
the repo, produce or refresh a walkthrough.

A syllabus should help the human:

- understand the relevant concepts
- see how those concepts apply in this repo
- learn in the order the work should be performed
- retain the key ideas through small concept cards

An implementation guide should help the human:

- understand the framework concepts required by the current phase
- connect those concepts to a small concrete example
- see how the concept shows up in this repo
- defer unrelated advanced topics until later

A walkthrough should help the human:

- identify the files and folders involved in the current phase task
- understand the correct order of edits
- see the first correct structure for the phase
- know which pointed questions to ask when blocked

## When To Use

Create or refresh a syllabus when:

- the user asks to be taught
- the user says they do not know where to start
- a new phase begins
- a subtask is large enough that the learning path is non-obvious

Create or refresh an implementation guide when:

- the user understands the task goal but not the framework concepts behind it
- the user says the syllabus is too abstract
- a framework mechanic is blocking progress
- the next step depends on understanding a framework convention such as routing, layouts, JSX, props, or client vs server behavior

Create or refresh a walkthrough when:

- the user understands the concept but not the repo steps
- the user asks what files to create or edit
- the user needs the correct build order for the current phase task
- the user wants the first correct version of a feature structure in this repo

Do not generate these artifacts automatically in every session. Offer them when
the context suggests they would help.

## Usage

If the human wants a fresh session to check whether learning support is needed,
they can use a short prompt like:

`I’m starting <phase or subtask>. Use the learning workflow and tell me whether I need a syllabus, an implementation guide, a walkthrough, or some combination of them.`

This keeps the workflow discoverable without forcing extra context into every
session.

## Output Locations

Syllabi should live in:

- `docs/learnings/syllabi/`

Use filenames that tie the syllabus to a phase or subtask.

Examples:

- `phase-6-discovery-ui-syllabus.md`
- `phase-6-routing-and-data-fetching-syllabus.md`
- `phase-10-moderation-review-flow-syllabus.md`

Implementation guides should live in:

- `docs/learnings/implementation-guides/`

Example filenames:

- `phase-6-1-next-routing-and-layout-guide.md`
- `phase-10-client-components-and-form-state-guide.md`
- `phase-13-search-input-state-and-query-params-guide.md`

Walkthroughs should live in:

- `docs/learnings/walkthroughs/`

Example filenames:

- `phase-6-1-route-tree-walkthrough.md`
- `phase-10-public-submission-form-walkthrough.md`
- `phase-13-search-and-filter-ui-walkthrough.md`

Because learning artifacts are committed repo artifacts, they must reference only
committed repo files. Agents may use `.ai/` materials during live reasoning,
but final committed content must not cite `.ai/` paths.

## Syllabus Requirements

Each syllabus should stay practical and should teach only what is relevant to
the current work. Its job is to orient the human, not to replace a concrete
build guide.

Recommended structure:

1. Purpose
2. Current task or subtask
3. Prerequisites
4. Modules in practical build order
5. Recommended first implementation step

Each module should include:

- objective
- why it matters
- key concepts
- repo-specific context
- small concrete example
- common mistakes
- short exercise or implementation task

Optional sections:

- vocabulary
- debugging tips
- reading checklist
- later topics that can wait

## Implementation Guide Requirements

Each implementation guide should answer "what does this mean in the framework
I am using right now?" with enough specificity to support the next small step.

Recommended structure:

1. Concepts to understand now
2. Plain-language explanations
3. Tiny worked examples
4. How this appears in the repo today
5. Tiny rules of thumb

Implementation guides should:

- explain framework behavior in plain language for a beginner
- stay tightly scoped to the active phase
- use tiny examples instead of large code dumps
- avoid governance/process material unless it directly affects the concept
- avoid turning into a second syllabus

## Walkthrough Requirements

Each walkthrough should answer "what should I build first in this repo?" with a
clear phase-scoped sequence.

Recommended structure:

1. What you are building
2. Files and folders involved
3. Edit order
4. First correct structure
5. Ask-when-stuck prompts

Walkthroughs should:

- stay within the current phase scope
- describe the concrete repo path through the work
- avoid MVP language
- avoid re-explaining framework concepts that belong in an implementation guide
- include 3-5 pointed questions the human can ask when blocked

## Teaching Style

- Teach in the context of this codebase.
- Prefer small examples over large tutorial dumps.
- Separate must-know-now from can-learn-later.
- Optimize for the human writing the code with guidance.
- Keep explanations concrete enough to support the next implementation step.
- If the human asks "what does this task mean?" prefer a syllabus.
- If the human asks "what does this framework concept mean here?" prefer an implementation guide.
- If the human asks "what do I edit first in this repo?" prefer a walkthrough.
- If multiple kinds of confusion are present, use the minimal combination of artifacts and keep each one narrow.
- Assume the human may be a complete beginner and explain terms plainly before relying on framework vocabulary.

## Index Card Rules

When a syllabus, implementation guide, or walkthrough introduces key concepts
that are likely to recur, add or update cards in
`docs/learnings/index-cards/`.

Good card candidates:

- framework concepts the human is likely to revisit
- repo conventions that are easy to forget
- mental models that unblock repeated confusion

Poor card candidates:

- one-off task details
- temporary decisions that belong in governance docs
- highly specific instructions that will age quickly

## Index Card Format

Cards should stay short and easy to scan.

Recommended structure:

1. Title
2. One-sentence concept summary
3. Why it matters here
4. Tiny example or rule of thumb

Prefer updating an existing card over creating a near-duplicate.

## Relationship To Canonical Docs

Syllabi, implementation guides, walkthroughs, and cards are learning aids.

They do not override:

- `docs/agent-governance/`
- `docs/specs/`
- `docs/architecture/`

If a learning artifact depends on canonical product or architecture decisions,
link to the relevant source documents.

If useful guidance exists only in `.ai/` notes, promote the durable rule into a
committed canonical or repo-visible doc before citing it from a committed
learning artifact.

## Curation Rule

`docs/learnings/` is a curated repo artifact, not an agent scratch directory.

Do include:

- durable learning plans tied to real project work
- durable implementation guides tied to real project work
- durable walkthroughs tied to real project work
- concept cards that will likely help again later
- concise repo-specific teaching material worth reviewing in the future

Do not include:

- stream-of-consciousness notes
- low-signal agent dumps
- temporary checklists that only matter during a single session
- duplicate concept writeups that should have updated an existing card
