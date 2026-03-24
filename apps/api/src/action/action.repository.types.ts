import { EntityStatus, Prisma } from '@prisma/client';

export const actionDetailInclude = {
  topicActions: {
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
      article: {
        id: 'asc',
      },
    },
    include: {
      article: true,
    },
    where: {
      article: {
        status: EntityStatus.PUBLISHED,
      },
    },
  },
} satisfies Prisma.ActionInclude;

export type ActionDetailRecord = Prisma.ActionGetPayload<{
  include: typeof actionDetailInclude;
}>;
