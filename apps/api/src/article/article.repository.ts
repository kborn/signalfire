import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Article, EntityStatus, Prisma } from '@prisma/client';

const articleDetailInclude = {
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
