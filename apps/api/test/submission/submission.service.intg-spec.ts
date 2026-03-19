import { setupIntegrationTest } from '../harness/integration.harness';
import { SubmissionModule } from '../../src/submission/submission.module';
import { SubmissionStatus } from '@prisma/client';
import { createSubmission } from '../factories/submission.factory';
import { createEvent } from '../factories/event.factory';
import { createArticle } from '../factories/article.factory';
import { linkArticleToSubmission, linkEventToSubmission } from '../factories/relation.factory';

describe('', () => {
  setupIntegrationTest([SubmissionModule]);

  it('asserts ability to link an article to a submission', async () => {
    const submission = await createSubmission();
    const article = await createArticle();
    await linkArticleToSubmission(submission.id, article.id);
    const fetchedSubmission = await jestPrisma.client.submission.findUnique({
      where: { id: submission.id },
    });
    expect(fetchedSubmission).toEqual(expect.objectContaining({ articleId: article.id }));
  });

  it('asserts ability to link an event to a submission', async () => {
    const submission = await createSubmission();
    const event = await createEvent();
    await linkEventToSubmission(submission.id, event.id);
    const fetchedSubmission = await jestPrisma.client.submission.findUnique({
      where: { id: submission.id },
    });
    expect(fetchedSubmission).toEqual(expect.objectContaining({ eventId: event.id }));
  });

  it('asserts a submission can not link to an event and and article', async () => {
    const submission = await createSubmission();
    const event = await createEvent();
    await linkEventToSubmission(submission.id, event.id);
    const article = await createArticle();
    await expect(linkArticleToSubmission(submission.id, article.id)).rejects.toThrow(
      /submission_one_of_target_chk/,
    );
  });

  it('asserts a submission can not be approved without a linked article or event', async () => {
    const submission = await createSubmission();
    await expect(
      jestPrisma.client.submission.update({
        where: { id: submission.id },
        data: {
          status: SubmissionStatus.APPROVED,
          reviewedAt: new Date(),
        },
      }),
    ).rejects.toThrow(/submission_one_of_target_chk/);
  });

  it('asserts a multiple submissions can not link to a single article', async () => {
    const article = await createArticle();
    const submission1 = await createSubmission();
    await jestPrisma.client.submission.update({
      where: { id: submission1.id },
      data: {
        articleId: article.id,
      },
    });

    const submission2 = await createSubmission();
    await expect(
      jestPrisma.client.submission.update({
        where: { id: submission2.id },
        data: {
          articleId: article.id,
        },
      }),
    ).toThrowUniqueViolation();
  });

  it('asserts a multiple submissions can not link to a single event', async () => {
    const event = await createEvent();
    const submission1 = await createSubmission();
    await jestPrisma.client.submission.update({
      where: { id: submission1.id },
      data: {
        eventId: event.id,
      },
    });

    const submission2 = await createSubmission();
    await expect(
      jestPrisma.client.submission.update({
        where: { id: submission2.id },
        data: {
          eventId: event.id,
        },
      }),
    ).toThrowUniqueViolation();
  });
});
