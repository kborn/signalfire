# Learning Card 01: Nest Modules

Nest module = wiring boundary.

- `providers` = what this module owns
- `imports` = other modules this module needs
- `exports` = what this module shares

Example:

```ts
@Module({
  imports: [PrismaModule],
  providers: [SubmissionRepository, SubmissionService],
  exports: [SubmissionService],
})
```

Meaning:

- `SubmissionModule` can use Prisma
- Nest can create `SubmissionRepository` and `SubmissionService`
- other modules can use `SubmissionService`
