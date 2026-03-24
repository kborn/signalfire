import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Article, EntityStatus } from '@prisma/client';
import type { ArticleDetailRecord } from './article.repository.types';
import { articleDetailInclude } from './article.repository.types';

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

  findPublishedBySlug(slug: string): Promise<ArticleDetailRecord | null> {
    return this.prisma.article.findUnique({
      where: {
        status: EntityStatus.PUBLISHED,
        slug: slug,
      },
      include: articleDetailInclude,
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
}
