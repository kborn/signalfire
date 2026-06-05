# Nest request pipes at the controller boundary

A pipe should validate or transform incoming request data before the controller
method hands it to the service layer.

Why it matters:

- Invalid input should fail early.
- Controllers stay focused on HTTP shape and error mapping.
- Services can stay focused on business behavior instead of parsing raw input.

Rule of thumb:

- Validate request bodies in a pipe or DTO step.
- Keep business rules in the service.
- Map domain errors to HTTP responses in the controller when needed.
