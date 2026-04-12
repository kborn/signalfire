# Nest Pipes

A Nest pipe is a small runtime step that runs before a controller method.

It usually does one of two jobs:

- validate an incoming value
- transform an incoming value

Mental model:

`request value -> pipe -> controller method`

If the pipe returns a value, the controller continues.

If the pipe throws an exception, the controller method does not run and Nest
returns the matching HTTP error response.

Small example:

```ts
@Post()
create(@Body(new SubmissionValidationPipe()) body: SubmissionRequest) {
  return this.submissionService.create(body);
}
```

Why this matters:

- TypeScript request types help the developer at compile time.
- Pipes validate real HTTP input at runtime.

Rule of thumb:

- Use a pipe when a request value must be checked or transformed before the
  controller should trust it.
