# Learning Workflow

`docs/learnings/` holds curated teaching artifacts that show how the human used
AI to learn the stack while working through real project tasks.

These documents are not canonical project authority. The canonical source of
truth for project state remains `docs/agent-governance/`, `docs/specs/`, and
`docs/architecture/`.

## Purpose

Use this directory when the goal is not only to complete work, but also to help
the human understand:

- the relevant technology
- the project-specific implementation context
- the current task or subtask
- the concepts worth retaining after the task is done

This directory is intentionally repo-visible. It is part of the project's
professional-development story and documents how AI was used as a teaching and
coaching aid rather than as an opaque code generator.

## Artifact Types

### Syllabi

Task-linked learning plans that teach the concepts needed for a current phase,
feature, or subtask in a practical build order.

Location:

- `docs/learnings/syllabi/`

### Index Cards

Tiny reminders for concepts that are easy to forget and likely to recur.

Location:

- `docs/learnings/index-cards/`

## Session Behavior

When operating as Staff Engineer during an implementation-oriented session:

1. Be aware that the learning workflow exists.
2. Check whether the user appears to be actively working on a phase or subtask.
3. Prompt briefly to ask whether a new syllabus or syllabus refresh would help.
4. If a syllabus is created, add or update index cards for the key concepts it introduces when that would reduce repeated explanations later.

This prompt should be lightweight. It is an offer, not a mandatory detour.

## Scope Rules

- Keep syllabi tied to the active phase or an explicitly approved task.
- Prefer practical, repo-specific teaching over generic framework tutorials.
- Avoid creating large numbers of cards for one-off trivia.
- Update existing cards when possible instead of duplicating concepts.
- Keep this directory curated. It is not a dumping ground for raw agent notes,
  throwaway drafts, or transient session output.
- Temporary working notes that are not durable enough for repo review belong in
  `docs/.agent_phase_notes/`, not here.

## Related Docs

- `docs/learnings/syllabus-workflow.md`
- `docs/learnings/index-cards/README.md`
