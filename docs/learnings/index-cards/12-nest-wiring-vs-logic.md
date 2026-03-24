# Learning Card 12: Nest Wiring vs Logic

Nest modules are wiring.

- `imports` = what this module needs
- `providers` = what Nest can create here
- `exports` = what other modules may use
- `controllers` = HTTP entry points

Business code usually lives in:

- repositories
- services

Rule:

- module = dependency map
- repository/service = actual behavior
