# Learning Card 01b: Module Fields

Inside `@Module({...})`:

- `imports` = other modules I need
- `providers` = classes Nest can create/inject here
- `exports` = providers I share with other modules
- `controllers` = classes that handle HTTP requests

Typical flow:

`controller -> service -> repository -> prisma`

Example:

```ts
@Module({
  imports: [PrismaModule],
  controllers: [TopicController],
  providers: [SubmissionService, SubmissionRepository],
  exports: [SubmissionService],
})
```
