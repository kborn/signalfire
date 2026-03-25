# Agent Bootstrap

This document is the short human pointer for session bootstrap.

The machine-enforced bootstrap contract lives in
`.ai/bootstrap/SESSION_BOOTSTRAP.md`.

The full human-readable overview of initialization, authority, default role,
phase-note usage, and learning features lives in
`docs/agent-governance/agent-operating-model.md`.

In practice:

1. The agent reads the bootstrap contract.
2. The agent reads the required canonical docs in the declared order.
3. The agent reads the active role file.
4. The agent returns the required first-response contract.

If any required bootstrap file is missing or unreadable, the agent must return:

`BOOTSTRAP_BLOCKED <missing_or_unreadable_paths>`
