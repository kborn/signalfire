# Learning Card 53: Prisma Nested Writes for Join Tables

When a model owns join rows, Prisma can create them in the same `create()` call.

For Phase 10 submissions, keep the repository input persistence-shaped:

- scalar submission fields
- `topicIds: number[]`
- `resourceLinks: string[]`

Then build nested writes inside the repository.

Example:

```ts
return this.prisma.submission.create({
  data: {
    submissionType: submission.submissionType,
    status: SubmissionStatus.PENDING,
    title: submission.title,
    summary: submission.summary,
    submittedContent: submission.submittedContent,
    author: submission.author,
    submitterName: submission.submitterName,
    submitterEmail: submission.submitterEmail,
    submissionTopics: submission.topicIds.length
      ? {
          create: submission.topicIds.map((topicId) => ({
            topic: {
              connect: { id: topicId },
            },
          })),
        }
      : undefined,
    submissionResourceLinks: submission.resourceLinks.length
      ? {
          create: submission.resourceLinks.map((url) => ({
            resourceLink: {
              connectOrCreate: {
                where: { url },
                create: { url },
              },
            },
          })),
        }
      : undefined,
  },
});
```

Why two different patterns:

- `connect` for topics because the topic must already exist
- `connectOrCreate` for resource links because the URL may be new

Mental model:

- service resolves request shape into normalized repository input
- repository translates normalized input into Prisma nested write syntax
- Prisma writes the submission and join rows together
