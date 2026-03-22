import { Prisma } from '@prisma/client';

export const actionDetailInclude = {
  topicActions: {
    include: {
      topic: true,
    },
  },
  articleActions: {
    include: {
      article: true,
    },
  },
} satisfies Prisma.ActionInclude;

export type ActionDetailRecord = Prisma.ActionGetPayload<{
  include: typeof actionDetailInclude;
}>;
