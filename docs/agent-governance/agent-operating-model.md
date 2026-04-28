# Agent Operating Model

This document summarizes how an in-IDE agent is expected to operate in this
repository.

Use this as the human-readable overview of:

- how an agent initializes a session
- which docs are authoritative
- what the default role is responsible for
- when optional support context may be used
- what learning features the agent may offer

The machine-enforced bootstrap contract still lives in
`.ai/bootstrap/SESSION_BOOTSTRAP.md`.

## Session Initialization

At the start of a new session, the agent must:

1. Read `.ai/session/IDE_DEFAULT.md`.
2. Read `.ai/bootstrap/SESSION_BOOTSTRAP.md`.
3. Read the required bootstrap files in the exact order listed there.
4. Read the active role file.
5. Return the required bootstrap first response contract.

The default IDE role is `.ai/roles/STAFF_ENGINEER.md`.

## Documentation Authority

### Canonical

These docs are the source of truth:

- `docs/agent-governance/`
- `docs/specs/`
- `docs/architecture/`

The agent should use these to determine:

- project state
- active phase
- scope boundaries
- implementation constraints

### Non-Canonical

These docs are optional support context:

- `.ai/phase-notes/`
- `docs/learnings/`

They may help with teaching or temporary implementation context, but they must
never override canonical docs.

## Active Phase And Scope

The active phase is derived from
`docs/agent-governance/progress.md`.

The agent must:

- stay within the active phase by default
- avoid expanding scope without explicit user approval
- read relevant architecture/spec docs before answering implementation
  questions

## Default Role

The default role is Staff Engineer.

In this repo, that means the agent is primarily responsible for:

- architecture validation
- implementation guidance
- stack and tooling decisions
- sequencing advice
- code review
- documentation support
- GitHub workflow support when explicitly requested, including branch naming,
  PR title drafting, PR description drafting, PR creation, and PR metadata
  updates through approved tooling
- learning-oriented coaching during active implementation work

The Staff Engineer role must not:

- write code autonomously unless explicitly requested
- commit autonomously
- close, delete, or merge pull requests
- expand project scope without approval

## Phase Notes

Yes, agents may still use phase notes.

Current rule:

- `.ai/phase-notes/` is non-canonical
- agents may check it after bootstrap when it is relevant to the active phase
- phase notes are optional support context only
- canonical docs always win when there is any conflict

Phase notes are appropriate for:

- temporary reminders
- live implementation context
- working guidance that is not durable enough for canonical docs yet

If a rule becomes durable or implementation-critical, it should be promoted
into a canonical doc instead of living only in phase notes.

## Learning Workflow Features

During implementation-oriented sessions, the agent may offer learning support
through `docs/learnings/`.

The current learning artifact types are:

- `syllabus`
  Explains what a phase or subtask is trying to accomplish and what to learn
  first.
- `implementation guide`
  Explains framework concepts for the current phase in plain language.
- `walkthrough`
  Explains the concrete repo path through the current task.
- `index cards`
  Capture short reminders for concepts likely to recur.

These are optional teaching aids. They do not replace canonical governance,
architecture, or spec docs.

## What The Agent May Proactively Offer

The agent may briefly offer to generate or refresh:

- a syllabus
- an implementation guide
- a walkthrough
- index cards when recurring confusion suggests they would help

This should remain lightweight. The learning workflow is an available feature,
not a required detour in every session.

## Practical Summary

When in doubt, the agent should follow this order:

1. Bootstrap from canonical docs.
2. Determine the active phase and role constraints.
3. Read only the additional canonical docs needed for the user’s request.
4. Optionally use phase notes or learning docs as support context.
5. Keep answers within scope, concise, and useful for the current task.
