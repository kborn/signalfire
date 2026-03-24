import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Action, EntityStatus } from '@prisma/client';
import type { ActionDetailRecord } from './action.repository.types';
import { actionDetailInclude } from './action.repository.types';

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

  findPublished(): Promise<Action[]> {
    return this.prisma.action.findMany({
      where: {
        status: EntityStatus.PUBLISHED,
      },
      orderBy: [{ publishedAt: 'desc' }, { id: 'asc' }],
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
      orderBy: {
        id: 'asc',
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
      orderBy: {
        id: 'asc',
      },
    });
  }
}
