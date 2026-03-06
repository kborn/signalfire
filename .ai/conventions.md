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
- All descriptions should contain:
    - Summary - A brief description of what this PR is. Usually 1 or 2 sentences
    - Changes - A list of specific changes made. Should be detailed but not overly verbose
    - Why   - A description of why this was necessary. Usually a few sentences but no more than a paragraph.
      If a lengthier description is necessary consider adding an optional section (below) or prompting
      the user to create a design doc or ADR and link to it appropriately
- Optional sections can be added as necessary (i.e. Validation, Scope, Notes, etc)
    - Description format must be returned as un-rendered Markdown inside a fenced code block with an `md` info string.
      This is critical so formatting can be preserved in copy/paste operations and
      ultimately rendered correctly in GitHub.
- Example:

~~~text
```md
## Summary
Succinct description of the PR

### Changes
- List of specific changes 
  - Sub lists are formatted like this
  
### Why
Description of why this was necessary  
```
~~~
 
