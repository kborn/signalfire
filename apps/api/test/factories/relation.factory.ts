export async function linkArticleEvent(articleId: number, eventId: number) {
  return jestPrisma.client.articleEvent.create({
    data: {
      articleId: articleId,
      eventId: eventId,
      assignedBy: 'admin',
    },
  });
}

export async function linkActionEvent(actionId: number, eventId: number) {
  return jestPrisma.client.actionEvent.create({
    data: {
      actionId: actionId,
      eventId: eventId,
      assignedBy: 'admin',
    },
  });
}

export async function linkTopicEvent(topicId: number, eventId: number) {
  return jestPrisma.client.topicEvent.create({
    data: {
      topicId: topicId,
      eventId: eventId,
      assignedBy: 'admin',
    },
  });
}

export async function linkArticleAction(articleId: number, actionId: number) {
  return jestPrisma.client.articleAction.create({
    data: {
      articleId: articleId,
      actionId: actionId,
      assignedBy: 'admin',
    },
  });
}

export async function linkTopicArticle(topicId: number, articleId: number) {
  return jestPrisma.client.topicArticle.create({
    data: {
      topicId: topicId,
      articleId: articleId,
      assignedBy: 'admin',
    },
  });
}

export async function linkTopicAction(topicId: number, actionId: number) {
  return jestPrisma.client.topicAction.create({
    data: {
      topicId: topicId,
      actionId: actionId,
      assignedBy: 'admin',
    },
  });
}

export async function linkEventToSubmission(submissionId: number, eventId: number) {
  return jestPrisma.client.submission.update({
    where: { id: submissionId },
    data: {
      event: {
        connect: { id: eventId },
      },
    },
  });
}

export async function linkArticleToSubmission(submissionId: number, articleId: number) {
  return jestPrisma.client.submission.update({
    where: { id: submissionId },
    data: {
      article: {
        connect: { id: articleId },
      },
    },
  });
}
