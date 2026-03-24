import { EntityStatus, Prisma } from '@prisma/client';

export const articleDetailInclude = {
  topicArticles: {
    orderBy: {
      topic: {
        id: 'asc',
      },
    },
    include: {
      topic: true,
    },
  },
  articleActions: {
    orderBy: {
      action: {
        id: 'asc',
      },
    },
    include: {
      action: true,
    },
    where: {
      action: {
        status: EntityStatus.PUBLISHED,
      },
    },
  },
} satisfies Prisma.ArticleInclude;

export type ArticleDetailRecord = Prisma.ArticleGetPayload<{
  include: typeof articleDetailInclude;
}>;
