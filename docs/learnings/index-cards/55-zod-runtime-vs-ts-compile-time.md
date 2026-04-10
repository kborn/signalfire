# Zod Runtime Validation Vs TypeScript Compile-Time Types

TypeScript types help the developer write correct code.

They do not validate JSON sent by a client at runtime.

Zod solves the runtime problem by giving you executable schemas.

Mental model:

- TypeScript checks your code before it runs
- Zod checks outside input while the app is running

Why this matters:

- `@Body() reqBody: SubmissionRequest` helps the developer
- a Zod schema helps the API reject malformed request bodies

Rule of thumb:

- if the concern is "will the server trust this incoming HTTP payload?", a
  TypeScript type is not enough by itself
