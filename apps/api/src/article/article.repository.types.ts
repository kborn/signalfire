import { Prisma } from '@prisma/client';

export const articleDetailInclude = {
  topicArticles: {
    include: {
      topic: true,
    },
  },
  articleActions: {
    include: {
      action: true,
    },
  },
} satisfies Prisma.ArticleInclude;

export type ArticleDetailRecord = Prisma.ArticleGetPayload<{
  include: typeof articleDetailInclude;
}>;
