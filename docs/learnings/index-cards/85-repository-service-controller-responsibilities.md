# Repository, service, controller

Repositories handle data access, services handle business rules, and
controllers handle request/response orchestration.

Why it matters:

- Clear boundaries make code easier to test and reason about.
- Query details stay close to the database layer.
- Business rules do not get buried in controller code.

Rule of thumb:

- Repository: Prisma queries, transactions, includes, and persistence shape.
- Service: validation, normalization, cross-repository coordination, response assembly.
- Controller: input binding, request validation, HTTP status mapping.
