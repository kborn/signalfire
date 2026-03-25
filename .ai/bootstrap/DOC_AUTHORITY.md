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

They may help with teaching, temporary working context, or implementation
alignment, but they must never override canonical documents.

## Usage Rules

- Read canonical docs first when they are relevant to the task.
- Use non-canonical docs only as optional support context.
- Non-canonical `.ai/` materials may help during live agent execution, but they
  must not be cited or referenced from committed repo documentation.
- If a non-canonical note becomes durable or implementation-critical, promote it
  into a canonical doc instead of relying on the note.
- When canonical and non-canonical sources differ, canonical sources win.
