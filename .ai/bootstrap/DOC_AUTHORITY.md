# Documentation Authority

This file defines canonical versus non-canonical documentation for AI agents.

## Canonical

These directories are the project source of truth:

- `docs/agent-governance/`
- `docs/specs/`
- `docs/architecture/`

Agents must treat these as authoritative when determining project state,
requirements, scope boundaries, and implementation constraints.

## Non-Canonical

These directories are support material only:

- `.ai/phase-notes/`
- `docs/learnings/`
- `docs/future/`

They may help with teaching, temporary working context, or implementation
alignment, but they must never override canonical documents.

## Usage Rules

- Read canonical docs first when they are relevant to the task.
- Use non-canonical docs only as optional support context.
- When shaping or expanding tasks inside an already-approved future phase, check
  `docs/future/` for relevant planning notes before inventing new task framing.
- Non-canonical `.ai/` materials may help during live agent execution, but they
  must not be cited or referenced from committed repo documentation.
- If a non-canonical note becomes durable or implementation-critical, promote it
  into a canonical doc instead of relying on the note.
- If a future-planning note has been implemented or superseded, tidy or remove
  it so `docs/future/` remains a current planning workspace rather than a stale
  archive.
- When canonical and non-canonical sources differ, canonical sources win.
