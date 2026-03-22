import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Action, EntityStatus, Prisma } from '@prisma/client';

const actionDetailInclude = {
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

@Injectable()
export class ActionRepository {
  constructor(private prisma: PrismaService) {}

  findBySlug(slug: string): Promise<Action | null> {
    return this.prisma.action.findUnique({
      where: {
        slug: slug,
      },
    });
  }

  findPublishedBySlug(slug: string): Promise<ActionDetailRecord | null> {
    return this.prisma.action.findUnique({
      where: {
        status: EntityStatus.PUBLISHED,
        slug: slug,
      },
      include: actionDetailInclude,
    });
  }

  findPublishedByTopicSlug(topicSlug: string): Promise<Action[]> {
    return this.prisma.action.findMany({
      where: {
        status: EntityStatus.PUBLISHED,
        topicActions: {
          some: {
            topic: {
              slug: topicSlug,
            },
          },
        },
      },
    });
  }

  findPublishedByArticleId(articleId: number): Promise<Action[]> {
    return this.prisma.action.findMany({
      where: {
        status: EntityStatus.PUBLISHED,
        articleActions: {
          some: {
            article: {
              id: articleId,
            },
          },
        },
      },
    });
  }
}
