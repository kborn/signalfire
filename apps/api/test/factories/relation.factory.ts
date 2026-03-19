import { PrismaService } from '../../src/prisma/prisma.service';

export async function linkArticleEvent(prisma: PrismaService, articleId: number, eventId: number) {
  return prisma.articleEvent.create({
    data: {
      articleId: articleId,
      eventId: eventId,
      assignedBy: 'admin',
    },
  });
}

export async function linkActionEvent(prisma: PrismaService, actionId: number, eventId: number) {
  return prisma.actionEvent.create({
    data: {
      actionId: actionId,
      eventId: eventId,
      assignedBy: 'admin',
    },
  });
}

export async function linkTopicEvent(prisma: PrismaService, topicId: number, eventId: number) {
  return prisma.topicEvent.create({
    data: {
      topicId: topicId,
      eventId: eventId,
      assignedBy: 'admin',
    },
  });
}

export async function linkArticleAction(
  prisma: PrismaService,
  articleId: number,
  actionId: number,
) {
  return prisma.articleAction.create({
    data: {
      articleId: articleId,
      actionId: actionId,
      assignedBy: 'admin',
    },
  });
}

export async function linkTopicArticle(prisma: PrismaService, topicId: number, articleId: number) {
  return prisma.topicArticle.create({
    data: {
      topicId: topicId,
      articleId: articleId,
      assignedBy: 'admin',
    },
  });
}

export async function linkTopicAction(prisma: PrismaService, topicId: number, actionId: number) {
  return prisma.topicAction.create({
    data: {
      topicId: topicId,
      actionId: actionId,
      assignedBy: 'admin',
    },
  });
}

export async function linkEventToSubmission(
  prisma: PrismaService,
  submission_id: number,
  eventId: number,
) {
  return prisma.submission.update({
    where: { id: submission_id },
    data: {
      event: {
        connect: { id: eventId },
      },
    },
  });
}

export async function linkArticleToSubmission(
  prisma: PrismaService,
  submission_id: number,
  articleId: number,
) {
  return prisma.submission.update({
    where: { id: submission_id },
    data: {
      article: {
        connect: { id: articleId },
      },
    },
  });
}
