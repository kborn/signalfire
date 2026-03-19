import { Prisma } from '@prisma/client';
import { SubmissionType, SubmissionStatus } from '@prisma/client';

export async function createSubmission(overrides: Partial<Prisma.SubmissionCreateInput> = {}) {
  return jestPrisma.client.submission.create({
    data: {
      submissionType: SubmissionType.ARTICLE,
      status: SubmissionStatus.PENDING,
      title: 'Test summary',
      summary: 'Summary',
      submittedContent: 'Content',
      submitterFirstName: 'First',
      submitterLastName: 'Last',
      submitterEmail: 'name@email.com',
      ...overrides,
    },
  });
}
