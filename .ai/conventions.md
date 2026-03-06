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
docs(architecture): [Phase 0.1 AI Governance docs] Addi system architecture diagram 

## Pull Requests
When prompted for a pull response definition, lean towards a more verbose description.
The description should include a list of relevant details as well as an optional paragraph for additional narrative

Example:
- update migration to fix typo in field name
- update POJO to correct typo in field name
- update DTO to correct typo in field name

Note, I updated the previous migration to fix the typo rather than create a new migration.
Ths previous migration had not yet been run in dev or prod and I'd rather not create
an additional migration unnecessarily 
