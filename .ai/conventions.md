# Agent Conventions

## Response Style

Default to concise responses.
Expand only when necessary.
Stay focused on the prompt without producing distracting "side quests" other than when deemed necessary.

## Git Commit Messages

Prefer concise commit messages when prompted

Format:
type(scope): [Phase Phase.Task Task Name] summary

Example:
docs(architecture): [Phase 0.1 AI Governance docs] Add system architecture diagram

## Pull Requests

When prompted for a pull response description follow these rules

- Allowed PR operations for the agent:
  - create PRs
  - update PR titles, descriptions, and related metadata when explicitly requested
  - never close, delete, or merge PRs

- Preferred branch name format:
  - `type/phase_x/(task_name_or_summary)`
  - `type` should usually be one of: `docs`, `feat`, `fix`, `refactor`, `test`, `chore`
  - Use snake_case for the phase segment and trailing task/summary segment
  - Example: `feat/phase_8/events_index_page`

- Preferred PR title format:
  - `type(scope): [Phase X.Y Task Name] summary`
  - Match the phase/task label when known and keep the summary concise
  - Example: `docs(governance): [Phase 11.1 Admin Workflow] Define GitHub PR conventions`

- All descriptions should contain:
  - Summary - A brief description of what this PR is. Usually 1 or 2 sentences
  - Changes - A list of specific changes made. Should be detailed but not overly verbose
  - Why - A description of why this was necessary. Usually a few sentences but no more than a paragraph.
    If a lengthier description is necessary consider adding an optional section (below) or prompting
    the user to create a design doc or ADR and link to it appropriately
- Preferred PR description behavior:
  - Use un-rendered Markdown inside a fenced code block with an `md` info string
  - Keep section order: `Summary`, `Changes`, `Why`
  - Add optional sections only when they materially help review, such as `Validation`, `Scope`, or `Notes`
- Optional sections can be added as necessary (i.e. Validation, Scope, Notes, etc)
  - Description format must be returned as un-rendered Markdown inside a fenced code block with an `md` info string.
    This is critical so formatting can be preserved in copy/paste operations and
    ultimately rendered correctly in GitHub.
- Example:

````text
```md
## Summary
Succinct description of the PR

### Changes
- List of specific changes
  - Sub lists are formatted like this

### Why
Description of why this was necessary
```
````
