# Syllabus Workflow

This document defines how AI agents should create and maintain learning syllabi
for implementation work in this repository.

## Purpose

The goal is to teach the human through the actual work of the project rather
than through detached tutorials.

A syllabus should help the human:

- understand the relevant concepts
- see how those concepts apply in this repo
- learn in the order the work should be performed
- retain the key ideas through small concept cards

## When To Use

Create or refresh a syllabus when:

- the user asks to be taught
- the user says they do not know where to start
- a new phase begins
- a subtask is large enough that the learning path is non-obvious

Do not generate a syllabus automatically in every session. Offer it when the
context suggests it would help.

## Usage

If the human wants a fresh session to check whether learning support is needed,
they can use a short prompt like:

`I’m starting <phase or subtask>. Use the learning workflow and tell me if I should generate or refresh a syllabus for the current subtask.`

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

## Syllabus Requirements

Each syllabus should stay practical and should teach only what is relevant to
the current work.

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

## Teaching Style

- Teach in the context of this codebase.
- Prefer small examples over large tutorial dumps.
- Separate must-know-now from can-learn-later.
- Optimize for the human writing the code with guidance.
- Keep explanations concrete enough to support the next implementation step.

## Index Card Rules

When a syllabus introduces key concepts that are likely to recur, add or update
cards in `docs/learnings/index-cards/`.

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

Syllabi and cards are learning aids.

They do not override:

- `docs/agent-governance/`
- `docs/specs/`
- `docs/architecture/`

If a syllabus depends on canonical product or architecture decisions, link to
the relevant source documents.

## Curation Rule

`docs/learnings/` is a curated repo artifact, not an agent scratch directory.

Do include:

- durable learning plans tied to real project work
- concept cards that will likely help again later
- concise repo-specific teaching material worth reviewing in the future

Do not include:

- stream-of-consciousness notes
- low-signal agent dumps
- temporary checklists that only matter during a single session
- duplicate concept writeups that should have updated an existing card
