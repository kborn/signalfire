# Agent Bootstrap

This document explains how new AI agent sessions should digest:
- high level project context
- how they should interact with the project
- the current state of implementation
- the decisions made that lead to the to the current state

---

## Default Interaction Mode

AI responses should prioritize clarity and brevity.

Default behavior:
- Answer the question directly
- Avoid tangential suggestions unless deemed critical
- Avoid proposing additional improvements unless explicitly requested
- Avoid long explanations unless the human asks for reasoning

When editing text:
Return the edited text only without explanation about why the edited version was chosen

---     

## Session bootstrap
You MUST complete reading the following required files before moving on

- Read `docs/agent-governance/project-context.md` → understand high level project description and architecture
- Read `docs/agent-governanceai-usage.md` → understand agent roles, guardrails and document authority
- Read `docs/agent-governanceprogress.md` → identify the active phase and open Phase Tasks
- Read `docs/agent-governancedecisions.md` → understand non-negotiables and rationale
- Confirm the next action with the human before expanding scope
---

## Additional Context (read only when needed)
- `docs/architecture/` — system architecture, domain model, architecture intent
- `docs/specs/` — feature specs, release scope, roadmap

Read these only when your task requires deeper technical understanding.
___

## Agent Conventions

Agents should consult the repository conventions file:

.ai/conventions.md

This file contains preferences for:

- response verbosity
- git commit message style
- pull request usage
- formatting conventions