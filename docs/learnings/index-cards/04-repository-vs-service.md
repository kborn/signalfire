# Learning Card 04: Repository vs Service

Phase 3.3 rule:

- repository = database access
- service = use-case logic
- controller = calls service

Ask:

- "fetch/store data?" -> repository
- "coordinate behavior?" -> service

Examples:

- `findBySlug()` -> repository
- `getTopicDetail()` -> service

Avoid duplicate query methods across repositories.
