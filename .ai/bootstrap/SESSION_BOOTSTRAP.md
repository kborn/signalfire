# Session Bootstrap

Use this file as the single canonical bootstrap for all agent roles.

## Purpose

Load only the required project context before any user task response.

## Required Read Order

1. `docs/agent-governance/project-context.md`
2. `docs/agent-governance/ai-usage.md`
3. `docs/agent-governance/progress.md`
4. `docs/agent-governance/decisions.md`
5. `.ai/conventions.md`

## Required Behavior

- Read all required files before answering any user request.
- Derive active phase from `docs/agent-governance/progress.md`.
- Use `docs/agent-governance/` files as canonical project authority.
- Do not expand scope without explicit user approval.
- After bootstrap completion, read architecture/specification docs relevant to the user's request before answering implementation questions.

## Required First Response

The first user-visible response in each new session must begin with:

`BOOTSTRAP_COMPLETE`

Then include exactly this order:

1. `Active phase:` <value>
2. `Role constraints:` <concise list>
3. `Files read:` <bullet list of paths actually read>

## Failure Contract

If a required file is missing or unreadable, stop and return:

`BOOTSTRAP_BLOCKED` <missing_path_list>
