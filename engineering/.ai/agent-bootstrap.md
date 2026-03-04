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
- Read `project-context.md` → understand high level project description and architecture
- Read `ai-usage.md` → understand agent roles, guardrails and document authority
- Read `progress.md` → identify the active phase and Definition of Done
- Read `decisions.md` → understand non-negotiables and rationale
- Confirm the next action with the human before expanding scope
---
