# Project Progress

This document tracks **phases and current status**.
It is the canonical answer to: “Where are we in the plan?”

---

## Session Recovery
If session context is lost, read in order:
1) `project-context.md`
2) `ai_usage.md`
3) `progress.md`
4) `decisions.md`


---

## Phase Entry Format (Required)

### Phase N — `Name` `Status`
Goal: `one sentence`

Definition of Done:
- [ ] `objective criteria`

Work Items:
- [ ] `tasks`

Notes (optional; keep short):
- `temporary reminders / blockers; link to decisions.md for rationale`

Links (optional):
- Implementation: `PR`
- Tests: `path`
- Decisions: `section link`

---

## Phase Completion Rule

A phase is considered complete when all items listed under
"Definition of Done" are satisfied.

Work items may evolve during implementation, but the Definition of Done
represents the criteria that must be met before moving to the next phase.

When a phase is completed:

1. Update the phase status to `Complete`
2. Update **Current Position** to the next phase
3. Create the entry for the next phase using the Phase Entry Format

---

## Current Position
- **Active Phase:** Phase 0 — Bootstrap
- **Status:** Not started

---

## Phase Overview

### Phase 0 — Bootstrap
#### Phase 0.1 - AI Governance
Goal:
- [x] Repo structure established
- [x] Governance docs present
- [x] Stack decision recorded in project-context.md
