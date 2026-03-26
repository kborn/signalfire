# TS Constructor Parameter Properties

In a TypeScript constructor, writing `public name: Type` creates both a
parameter and an instance property in one step.

Why it matters here:
In a custom error like `ApiError`, `public status: number` means the constructor
accepts `status` and automatically creates `this.status` without a separate
property declaration and assignment.

Rule of thumb:
Use constructor parameter properties for small classes when the parameter should
also become an instance field; do not redeclare fields already owned by a base
class like `Error.message`.
