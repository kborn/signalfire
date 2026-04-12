# Phase 10.3 Zod Request Validation Guide

This guide explains the Zod concepts that matter for Phase 10.3: runtime
request validation, discriminated unions, and mapping validation errors into
the public submission API contract.

Relevant canonical context:

- `docs/agent-governance/progress.md` defines the Phase 10.3 scope.
- `docs/specs/009-phase-10-submission-spec.md` defines the submission request
  and error contract.
- `docs/agent-governance/decisions.md` records the narrow-scope decision to use
  Zod for `POST /submissions`.

## Concepts To Understand Now

- TypeScript type checking vs runtime validation
- Zod schemas as executable validation rules
- discriminated unions keyed by `submissionType`
- `safeParse` and structured validation failures
- converting Zod issues into API-facing error payloads

## Plain-Language Explanations

### What Zod is doing that TypeScript is not

TypeScript helps the developer write correct code in the repo.

Zod helps the server reject bad input from the outside world.

That means these two things solve different problems:

- TypeScript checks code you wrote
- Zod checks JSON the client sent

For a public API, you usually need both.

### What a Zod schema is

A Zod schema is a runtime object that knows how to validate a value.

Example idea:

```ts
const titleSchema = z.string().trim().min(1).max(200);
```

That schema can now:

- accept valid strings
- reject bad strings
- produce useful validation issues

Unlike a TypeScript type, it exists at runtime.

### Why discriminated unions fit this submission API

The submission API has one endpoint but two request shapes:

- `ARTICLE`
- `EVENT`

Both share some top-level fields, but their payloads differ.

That is exactly what a discriminated union is for: one field tells you which
shape the rest of the object must follow.

For Phase 10.3, the discriminator is:

- `submissionType`

So the schema can say:

- if `submissionType` is `ARTICLE`, validate the article payload
- if `submissionType` is `EVENT`, validate the event payload

### Why `safeParse` is useful

`safeParse` does not throw.

Instead, it returns one of two shapes:

```ts
{ success: true, data: ... }
```

or

```ts
{ success: false, error: ... }
```

That is useful when you want to:

- inspect validation errors
- map them into your own API error contract
- throw a Nest `BadRequestException` yourself

### Why Zod issues are not the final API response

Zod gives you issues like:

- path
- message
- code

Your API spec wants errors like:

```json
{
  "errors": [{ "field": "payload.title", "message": "Title is required" }]
}
```

So Zod is the validation engine, but the backend still owns the final response
shape.

## Tiny Worked Examples

### Example 1: A simple required trimmed string

```ts
const titleSchema = z.string().trim().min(1, 'Title is required').max(200);
```

Meaning:

- must be a string
- trim whitespace first
- cannot be empty after trimming
- cannot exceed 200 characters

### Example 2: A discriminated union

```ts
const submissionSchema = z.discriminatedUnion('submissionType', [
  articleSubmissionSchema,
  eventSubmissionSchema,
]);
```

Meaning:

- read `submissionType`
- choose the matching branch
- validate only that branch

### Example 3: `safeParse`

```ts
const result = submissionSchema.safeParse(value);

if (!result.success) {
  throw new BadRequestException({
    errors: result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    })),
  });
}

return result.data;
```

Meaning:

- validate
- if invalid, shape the issues into the public API contract
- if valid, return parsed data

## How This Appears In The Repo Today

Current Zod-backed submission validation lives in:

- [submission.schema.ts](/Users/kevinborn/Workspace/personal/WebStormProjects/signal-fire/apps/api/src/submission/submission.schema.ts)
- [submission.validation.ts](/Users/kevinborn/Workspace/personal/WebStormProjects/signal-fire/apps/api/src/submission/submission.validation.ts)
- [submission-validation.pipe.ts](/Users/kevinborn/Workspace/personal/WebStormProjects/signal-fire/apps/api/src/submission/submission-validation.pipe.ts)

Current controller usage:

- [submission.controller.ts](/Users/kevinborn/Workspace/personal/WebStormProjects/signal-fire/apps/api/src/submission/submission.controller.ts)

The current pattern is:

1. Nest pipe receives raw request body
2. Zod validates the request shape
3. pipe returns validated data or throws `BadRequestException`
4. controller calls the service
5. service still handles domain checks like unknown topic slugs

That split is important:

- Zod handles request shape and field validity
- service handles repository-backed domain checks

## Tiny Rules Of Thumb

- TypeScript types do not validate incoming HTTP input.
- Zod schemas are runtime validation rules.
- `discriminatedUnion` is a strong fit when one field decides the rest of the
  object shape.
- `safeParse` is usually the cleanest path when you need custom error mapping.
- Zod should validate request shape; service code should validate domain rules.
