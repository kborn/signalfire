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

Task-linked orientation plans that explain scope, prerequisites, vocabulary,
and learning order for a current phase, feature, or subtask.

Location:

- `docs/learnings/syllabi/`

### Implementation Guides

Phase-scoped framework guides for questions like "what does this mean in
Next.js?" or "how does this concept work in the part of the stack I am using
right now?"

Location:

- `docs/learnings/implementation-guides/`

### Walkthroughs

Phase-scoped repo walkthroughs for questions like "what files do I touch
first?" or "what is the first correct version of this feature structure in this
repo?"

These are not MVP plans. They should describe the first correct implementation
steps for the current phase without implying the feature is intentionally
half-built.

Location:

- `docs/learnings/walkthroughs/`

### Index Cards

Tiny reminders for concepts that are easy to forget and likely to recur.

Location:

- `docs/learnings/index-cards/`

## Session Behavior

When operating as Staff Engineer during an implementation-oriented session:

1. Be aware that the learning workflow exists.
2. Check whether the user appears to be actively working on a phase or subtask.
3. Prompt briefly to ask whether a new syllabus, implementation guide, walkthrough, or refresh would help.
4. If a syllabus, implementation guide, or walkthrough is created, add or update index cards for the key concepts it introduces when that would reduce repeated explanations later.

This prompt should be lightweight. It is an offer, not a mandatory detour.

## Scope Rules

- Keep syllabi, implementation guides, and walkthroughs tied to the active phase or an explicitly approved task.
- Prefer practical, repo-specific teaching over generic framework tutorials.
- Use syllabi for orientation and sequencing, not as the only execution aid for unfamiliar framework mechanics.
- Use implementation guides when the human needs framework explanation tied to the current phase, not more task framing.
- Use walkthroughs when the human understands the concept but needs the concrete repo path through the work.
- Do not frame walkthroughs as MVPs or intentionally partial features. Use them to describe the first correct implementation steps within the current phase boundary.
- Avoid creating large numbers of cards for one-off trivia.
- Update existing cards when possible instead of duplicating concepts.
- Learning artifacts committed under `docs/` must cite only committed repo
  documents. Do not reference `.ai/` paths from committed learning docs.
- Keep this directory curated. It is not a dumping ground for raw agent notes,
  throwaway drafts, or transient session output.
- Temporary working notes that are not durable enough for repo review belong in
  `.ai/phase-notes/`, not here.

## Related Docs

- `docs/learnings/USER_GUIDE.md`
- `docs/learnings/syllabus-workflow.md`
- `docs/learnings/implementation-guides/README.md`
- `docs/learnings/walkthroughs/README.md`
- `docs/learnings/index-cards/README.md`
