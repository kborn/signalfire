# AI Session Initialization

This document explains how to start new AI sessions with minimal prompt overhead.

## Goals
- Use one prompt in IDE chat to load canonical context.
- Use one prompt in ChatGPT to start with a specific role.
- Keep bootstrap and role logic centralized and predictable.

## Canonical Files
- Bootstrap contract: `.ai/bootstrap/SESSION_BOOTSTRAP.md`
- Roles:
  - `.ai/roles/STAFF_ENGINEER.md`
  - `.ai/roles/CHIEF_STRATEGIST.md`
  - `.ai/roles/PM.md`
- IDE entrypoint: `.ai/session/IDE_DEFAULT.md`

## IDE Usage
In a new IDE chat session, prompt:

`read AGENTS.md`

`AGENTS.md` points to `.ai/session/IDE_DEFAULT.md`, which applies:
1. Canonical bootstrap
2. Default role (`STAFF_ENGINEER`)
3. Required first response contract (`BOOTSTRAP_COMPLETE` block)

## ChatGPT Usage (Role-specific)
In a new ChatGPT session, prompt one of:

- `Initialize session using .ai/session/START_AS_STAFF_ENGINEER.md`
- `Initialize session using .ai/session/START_AS_CHIEF_STRATEGIST.md`
- `Initialize session using .ai/session/START_AS_PM.md`

Each role entrypoint enforces the same bootstrap and then loads role constraints.

## Role Switching Mid-session
Ask explicitly for role change (example: "switch to PM role").
The agent should load the matching file in `.ai/roles/` and restate constraints.

## Troubleshooting
- If bootstrap files are missing/unreadable, agent should return `BOOTSTRAP_BLOCKED` with missing paths.
- If behavior diverges from expected startup contract, verify:
  - `AGENTS.md` points to `.ai/session/IDE_DEFAULT.md`
  - `.ai/bootstrap/SESSION_BOOTSTRAP.md` required read order is intact
  - role files exist under `.ai/roles/`
