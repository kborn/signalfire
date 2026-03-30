import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Article, EntityStatus } from '@prisma/client';

@Injectable()
export class ArticleRepository {
  constructor(private prisma: PrismaService) {}

  findBySlug(slug: string): Promise<Article | null> {
    return this.prisma.article.findUnique({
      where: {
        slug: slug,
      },
    });
  }

  findPublished(): Promise<Article[]> {
    return this.prisma.article.findMany({
      where: {
        status: EntityStatus.PUBLISHED,
      },
      orderBy: [{ publishedAt: 'desc' }, { id: 'asc' }],
    });
  }

  findPublishedBySlug(slug: string): Promise<Article | null> {
    return this.prisma.article.findUnique({
      where: {
        status: EntityStatus.PUBLISHED,
        slug: slug,
      },
    });
  }

  findPublishedByTopicSlug(topicSlug: string): Promise<Article[]> {
    return this.prisma.article.findMany({
      where: {
        status: EntityStatus.PUBLISHED,
        topicArticles: {
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

  findPublishedByActionId(actionId: number): Promise<Article[]> {
    return this.prisma.article.findMany({
      where: {
        status: EntityStatus.PUBLISHED,
        articleActions: {
          some: {
            action: {
              id: actionId,
            },
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  findPublishedByEventId(eventId: number): Promise<Article[]> {
    return this.prisma.article.findMany({
      where: {
        status: EntityStatus.PUBLISHED,
        articleEvents: {
          some: {
            event: {
              id: eventId,
            },
          },
        },
      },
      orderBy: [{ publishedAt: 'desc' }, { id: 'asc' }],
    });
  }
}
