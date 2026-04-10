# Phase 10.3 Runtime Request Validation In Nest

## Concepts To Understand Now

- TypeScript request types do not validate incoming HTTP JSON at runtime.
- Nest only validates request bodies when you give it runtime-aware validation logic.
- Controller-layer validation and service-layer domain rules solve different problems.
- Phase 10.3 needs both:
  - request-shape validation for public input
  - domain validation for rules like approved topic slugs

## Plain-Language Explanations

### Why `@Body() reqBody: SubmissionRequest` Is Not Enough

This:

```ts
async makeSubmission(@Body() reqBody: SubmissionRequest)
```

helps TypeScript understand the code you write in the repo.

It does **not** force a browser or API client to send valid JSON.

At runtime, Nest receives plain JavaScript objects. If no validation pipe or
runtime schema is attached, Nest will pass that object into the controller even
if fields are missing, wrong, or malformed.

That means TypeScript protects the developer, but not the API boundary.

### Controller Validation vs Service Validation

For Phase 10.3, split the responsibilities like this:

- Controller validation:
  - required fields exist
  - strings are strings
  - string length limits
  - email format
  - datetime format
  - event/article payload shape matches `submissionType`
- Service validation:
  - topic slugs exist in the seeded dataset
  - persistence mapping works
  - domain rules that require repository access

Rule of thumb:

- if the rule can be checked from the request body alone, it belongs at or
  before the controller boundary
- if the rule needs domain data or repository calls, it belongs in the service

### Why Unknown Topic Slugs Are Still Service Errors

`payload.topicSlugs` being an array is a request-validation concern.

Whether those slugs are valid Release 1 topics is a domain concern because the
backend must compare them against stored approved topics.

That is why a custom domain error like `UnknownSubmissionTopicsError` still
makes sense even after adding controller-level validation.

## Tiny Worked Examples

### Example: TypeScript-only typing

```ts
@Post()
create(@Body() body: SubmissionRequest) {
  return this.submissionService.create(body);
}
```

This accepts bad runtime input unless something else validates it first.

### Example: Controller-level validation idea

```ts
@Post()
create(@Body(new SubmissionValidationPipe()) body: SubmissionRequest) {
  return this.submissionService.create(body);
}
```

Now Nest has a runtime step that can reject invalid request bodies before the
service runs.

### Example: Domain error translation

```ts
try {
  return await this.submissionService.create(body);
} catch (error) {
  if (error instanceof UnknownSubmissionTopicsError) {
    throw new BadRequestException({
      errors: [
        {
          field: 'payload.topicSlugs',
          message: `Unknown topic slugs: ${error.slugs.join(', ')}`,
        },
      ],
    });
  }

  throw error;
}
```

This is not request-shape validation. It is domain-error-to-HTTP mapping.

## Main Implementation Options

### Option 1: Nest DTO classes with `class-validator`

How it works:

- create DTO classes for the top-level request and nested payloads
- enable a `ValidationPipe`
- let Nest validate and transform request bodies before the controller method

Why people like it:

- standard Nest pattern
- decorator-based
- good for simple flat DTOs
- integrates cleanly with controller parameter decorators

Tradeoffs for this phase:

- discriminated unions are awkward
- article vs event payload branching takes extra custom logic
- shaping errors exactly like the Phase 10 spec usually needs custom exception
  formatting anyway

### Option 2: Custom validation pipe for submissions

How it works:

- create one `SubmissionValidationPipe`
- inspect `submissionType`
- validate the matching payload shape and shared fields
- throw `BadRequestException` with the exact `errors` response contract

Why it fits Phase 10.3 well:

- the spec defines one public endpoint with a discriminated request shape
- you already need custom field names like `payload.topicSlugs`
- you already need API-specific error formatting

Tradeoffs:

- more manual code than decorator-only DTO validation
- you own the validation logic and tests directly

### Option 3: Schema validator such as Zod wrapped in a Nest pipe

How it works:

- define article/event schemas with a discriminated union
- validate inside a custom pipe
- map schema errors into the submission API error shape

Why it is strong technically:

- discriminated unions are clearer than DTO decorators for this request shape
- schemas are explicit and composable
- parsing and validation live in one place

Tradeoffs for this repo right now:

- introduces new validation library scope
- Phase 10.3 does not require new infrastructure to finish the endpoint

## How This Appears In The Repo Today

Current controller:

- [submission.controller.ts](/Users/kevinborn/Workspace/personal/WebStormProjects/signal-fire/apps/api/src/submission/submission.controller.ts)

Current service:

- [submission.service.ts](/Users/kevinborn/Workspace/personal/WebStormProjects/signal-fire/apps/api/src/submission/submission.service.ts)

Current HTTP tests:

- [submission.controller.route.spec.ts](/Users/kevinborn/Workspace/personal/WebStormProjects/signal-fire/apps/api/src/submission/submission.controller.route.spec.ts)

Current situation:

- the controller translates `UnknownSubmissionTopicsError` into `400`
- there is no runtime validation for malformed request bodies yet
- route tests cover success and service-originated `400`/`500`
- Phase 10.3 still needs invalid-payload tests that fail before service
  domain logic when request shape is wrong

## Recommended Approach For This Repo

Recommendation: use a dedicated `SubmissionValidationPipe` for Phase 10.3.

Why this is the best fit:

- one endpoint
- one discriminated request contract
- one custom error response format
- no need to introduce a new library just to finish the phase

Recommended sequence:

1. Create a submission validation pipe scoped to `POST /submissions`.
2. Validate shared fields first.
3. Branch on `submissionType`.
4. Validate article or event payload fields.
5. Return the original body if valid.
6. Throw `BadRequestException({ errors: [...] })` if invalid.
7. Keep unknown topic slug validation in the service.
8. Add route tests for:
   - valid article request
   - valid event request
   - invalid missing required field
   - invalid bad email
   - invalid event datetime ordering
   - invalid `submissionType`/payload mismatch

## Tiny Rules Of Thumb

- TypeScript types are not API validation.
- Public request validation should happen before service logic.
- Domain lookups stay in the service.
- Use public contract field names in validation errors.
- If a test sends malformed JSON and still reaches the service mock, runtime
  validation is not in place yet.
