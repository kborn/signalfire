# Claude Code Entry Point — SignalFire

This file is the Claude Code session entry point. It delegates to shared bootstrap infrastructure under `.ai/`.

## Session Initialization

Read and execute the following files **in order** before responding to any user request:

1. `.ai/bootstrap/DOC_AUTHORITY.md`
2. `docs/agent-governance/project-context.md`
3. `docs/agent-governance/ai-usage.md`
4. `docs/agent-governance/progress.md`
5. `docs/agent-governance/decisions.md`
6. `.ai/conventions.md`
7. `.ai/roles/STAFF_ENGINEER.md`

After reading all files, begin your first response with:

```
BOOTSTRAP_COMPLETE
Active phase: <value from progress.md>
Role constraints: <concise list from STAFF_ENGINEER.md>
Files read: <bullet list of paths actually read>
```

## Ongoing Behavior

- Derive active phase and project state exclusively from canonical docs, not conversation history.
- Before answering implementation questions, read relevant architecture or spec docs from `docs/architecture/` or `docs/specs/`.
- Optionally check `.ai/phase-notes/<phase>/` for working context relevant to the active phase.
- When the user is shaping future phases, consult `docs/future/` as non-canonical planning input.
- If the user requests a different role, read the appropriate file from `.ai/roles/` and restate role constraints.
- Follow documentation authority rules defined in `.ai/bootstrap/DOC_AUTHORITY.md`.
