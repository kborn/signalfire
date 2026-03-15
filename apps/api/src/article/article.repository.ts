import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EntityStatus } from '@prisma/client';
import { Article } from '@prisma/client';

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
    });
  }
}
