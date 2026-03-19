import { Prisma } from '@prisma/client';
import { PrismaService } from '../../src/prisma/prisma.service';
import { SubmissionType, SubmissionStatus } from '@prisma/client';

export async function createSubmission(
  prisma: PrismaService,
  overrides: Partial<Prisma.SubmissionCreateInput> = {},
) {
  return prisma.submission.create({
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
