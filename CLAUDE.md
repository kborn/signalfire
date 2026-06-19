# Claude Code — SignalFire / Find Your Fight

## Mode: Autonomous Completion

The development approach for this project shifted on 2026-06-19 from learning-oriented to
autonomous-completion. The agent writes, commits, and ships. The human reviews completed
work and extracts learnings after the fact. See `docs/agent-governance/decisions.md` for
the full rationale.

## Session Start

Read these two files before doing anything else:

1. `CONTEXT-next-session.md` — what needs fixing, what branch to work on, what decisions are locked
2. `docs/agent-governance/progress.md` — current phase and open tasks

If `CONTEXT-next-session.md` does not exist, read `docs/agent-governance/progress.md` and
`docs/agent-governance/decisions.md` to orient yourself.

Do not read or output a bootstrap header. Start working.

## Permissions

- Write, edit, and delete code freely
- Commit and create branches without asking
- Make implementation and design decisions within the current phase scope
- Expand scope only when blocked — document the expansion in progress.md and continue

## Guardrails (these do not change)

- Never push to remote without explicit user confirmation
- Never modify production infrastructure, CI secrets, or deployment config without asking
- Check `docs/agent-governance/decisions.md` before changing architecture, stack, or patterns
  that have already been decided — don't relitigate settled questions
- Run `pnpm typecheck` before committing code; fix errors before moving on
- When a decision affects future agents or the user's ability to review, write it to a
  `CONTEXT-*.md` file in the repo root or to progress.md

## Quality bar

- Typecheck clean before every commit
- Build passes before declaring a phase done
- If tests exist for the surface you're changing, don't break them (skipping new test
  coverage is acceptable; breaking existing coverage is not)

## What matters to this project

- It is a portfolio piece targeting Milestone 1 deployment. Credibility over completeness.
- The product is a civic action platform. The core gap: actions don't help users take action.
  The `externalUrl` field on Action was added to fix this — surface it wherever it matters.
- Visual identity: Playfair Display (display/headings), Inter (body), dark navy + amber palette.
  These are locked. Don't change them without being asked.
- The motif (`bg-motif.png`) is intentional. Keep it visible.
- Branch stack is local only. Nothing is pushed. The user reviews before merging.

## Reference docs (read when relevant, not by default)

- `docs/agent-governance/decisions.md` — locked architectural decisions
- `docs/agent-governance/project-context.md` — platform description and domain model
- `docs/reviews/` — historical review findings (non-canonical; verify before acting)
- `docs/architecture/` — architecture references for specific subsystems
