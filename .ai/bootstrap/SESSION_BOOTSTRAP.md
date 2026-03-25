# Session Bootstrap

Use this file as the single canonical bootstrap for all agent roles.

## Purpose

Load only the required project context before any user task response.

## Required Read Order

1. `.ai/bootstrap/DOC_AUTHORITY.md`
2. `docs/agent-governance/project-context.md`
3. `docs/agent-governance/ai-usage.md`
4. `docs/agent-governance/progress.md`
5. `docs/agent-governance/decisions.md`
6. `.ai/conventions.md`

## Required Behavior

- Read all required files before answering any user request.
- Derive active phase from `docs/agent-governance/progress.md`.
- Use `.ai/bootstrap/DOC_AUTHORITY.md` as the authority map for canonical versus non-canonical documentation.
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
