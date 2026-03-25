# Agent Bootstrap (Canonical Human Guide)

This document explains the bootstrap process in human-readable form.
The machine-enforced contract lives in `.ai/bootstrap/SESSION_BOOTSTRAP.md`.

## Intent

- Ensure every session starts from canonical project state.
- Keep responses concise by default.
- Pull additional context only when needed for the active task.

## Required startup flow

1. Read `.ai/bootstrap/SESSION_BOOTSTRAP.md`.
2. Read all files in its required read order.
3. Read the active role file (default IDE role: `.ai/roles/STAFF_ENGINEER.md`).
4. Return the required first response contract exactly as defined in `SESSION_BOOTSTRAP.md`.

## Operating rules after bootstrap

- Treat `docs/agent-governance/` as the source of truth for project state.
- Stay within the active phase unless the user explicitly approves scope expansion.
- For implementation/architecture questions, read relevant architecture/spec docs before answering.
- Keep answers focused and concise; load extra files only when the user request requires them.
- During implementation-oriented sessions, be aware of the learning workflow in `docs/learnings/` and briefly offer to generate or refresh a syllabus, implementation guide, or walkthrough for the current subtask when that would help the human learn through the work.

## Failure behavior

If a required bootstrap file is missing or unreadable, return:

`BOOTSTRAP_BLOCKED <missing_or_unreadable_paths>`
