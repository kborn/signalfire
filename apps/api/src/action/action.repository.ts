import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Action, EntityStatus } from '@prisma/client';
import { ActionDetailRecord, actionDetailInclude } from './action.repository.types';

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
