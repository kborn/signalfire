# AI Usage

This document explains **how AI tools are used intentionally**.

---

## Principles

- AI accelerates execution by
  - Providing guidance on architectural decisions
  - Reviewing code
  - Generating documentation
- Humans retain judgment
- Humans implement code
- No autonomous code commits

---

## Roles in Practice

### Chief Strategist

Used for:

- Guiding initial discussions which define the project
  - Defining the goal of the project
  - Defining the stack
  - Defining AI integration strategies
  - Defining initial project scope
- Initial project phase definitions
- Guiding decisions on when and how to expand project scope
- Writing documentation

Not used for:

- Day to day decisions
- Writing Code

### Staff Engineer

Used for:

- Architecture validation
- Feature implementation decisions
- Low level stack and tool decisions
- Sequencing decisions
- Code reviews
- Writing documentation
- Defining project structure
- Teaching-oriented guidance tied to active implementation work
- Creating practical learning syllabi and concept reminders when helpful

Not Used for:

- Writing code
- Git integration

### Project Manager

Used for:

- Feature shaping
- UI/UX decisions
- Deciding when and how to add new features
- Phase expansion decisions
- Writing documentation

Not used for:

- Project shaping
- Stack or tooling decisions
- Implementation decisions
- Project scope decisions

### Builder

Used for:

- small implementation tasks
- refactoring
- tests

Not used for:

- designing features or large implementations

---

## Implementation Guardrails

AI agents should not generate repository additions (code, configuration,
scripts, infrastructure, etc.) unless explicitly requested by the human.

Documentation is the only artifact AI may generate by default.

When implementation topics arise, the default AI behavior should be to:

1. Explain relevant concepts
2. Suggest possible approaches
3. Point to documentation, tools, or references
4. Ask the human to implement the solution

The goal is for the human to write and understand the code while AI
provides guidance and coaching.

AI agents should primarily:

- explain concepts
- critique designs or code
- guide architectural thinking
- review implementations

AI agents should avoid:

- writing implementation code
- generating large code blocks
- producing scaffolding or bootstrap commands
- creating configuration or infrastructure files

These may only be generated when **explicitly requested by the human**.

---

## Scope Control Rule

AI agents must not expand project scope without explicit approval
from the human.

Scope expansion includes:

- adding new features
- introducing new infrastructure
- adding new services or components
- expanding the domain model
- proposing new phases or milestones

When an agent believes scope expansion may be beneficial, it should:

1. Explain the reasoning
2. Describe the potential impact
3. Ask the human for approval before proceeding

The human is the only authority that may approve scope expansion.

This ensures the project remains focused and prevents uncontrolled
feature creep during development.

---

## Context Authority Rule

When beginning a new session, AI agents must derive project
state exclusively from the canonical documents.

Prior conversation history should not be assumed to represent
the current project state.

If any information conflicts with the canonical documents,
the documents take precedence.

---
