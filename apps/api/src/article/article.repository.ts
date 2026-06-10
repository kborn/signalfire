import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Article, EntityStatus, Prisma } from '@prisma/client';
import {
  CreateAdminArticleRepositoryInput,
  UpdateAdminArticleRepositoryInput,
} from '../admin-api/article/admin-article.repository.type';

const articleWithTopicsInclude = {
  topicArticles: {
    include: {
      topic: true,
    },
    orderBy: {
      topicId: 'asc',
    },
  },
} satisfies Prisma.ArticleInclude;

type ArticleOrderBy =
  | Prisma.ArticleOrderByWithRelationInput
  | Prisma.ArticleOrderByWithRelationInput[];

export type ArticleWithTopics = Prisma.ArticleGetPayload<{
  include: typeof articleWithTopicsInclude;
}>;

@Injectable()
export class ArticleRepository {
  constructor(private prisma: PrismaService) {}

  findById(id: number): Promise<Article | null> {
    return this.prisma.article.findUnique({
      where: {
        id: id,
      },
    });
  }

  findArticles(
    status?: EntityStatus | null,
    orderBy: ArticleOrderBy = [{ updatedAt: 'desc' }, { id: 'asc' }],
  ): Promise<Article[]> {
    return this.prisma.article.findMany({
      where: status
        ? {
            status: status,
          }
        : undefined,
      orderBy,
    });
  }

  async findBySlugAndStatus(slug: string, status?: EntityStatus | null): Promise<Article | null> {
    if (!status) {
      return this.prisma.article.findUnique({
        where: {
          slug: slug,
        },
      });
    }

    return this.prisma.article.findFirst({
      where: {
        slug: slug,
        status: status,
      },
    });
  }

  async findArticlesWithTopics(
    status?: EntityStatus | null,
    orderBy: ArticleOrderBy = [{ updatedAt: 'desc' }, { id: 'asc' }],
  ): Promise<ArticleWithTopics[]> {
    return this.prisma.article.findMany({
      where: status
        ? {
            status: status,
          }
        : undefined,
      include: articleWithTopicsInclude,
      orderBy,
    });
  }

  async findBySlugWithTopics(
    slug: string,
    status?: EntityStatus | null,
  ): Promise<ArticleWithTopics | null> {
    if (!status) {
      return this.prisma.article.findUnique({
        where: {
          slug: slug,
        },
        include: articleWithTopicsInclude,
      });
    }

    return this.prisma.article.findFirst({
      where: {
        slug: slug,
        status: status,
      },
      include: articleWithTopicsInclude,
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

  private buildTopicCreates(topicIds: number[]) {
    const assignedAt = new Date();
    return topicIds.map((topicId) => ({
      topic: { connect: { id: topicId } },
      assignedAt: assignedAt,
      assignedBy: 'admin',
    }));
  }

  async create(input: CreateAdminArticleRepositoryInput): Promise<ArticleWithTopics> {
    return await this.prisma.$transaction(async (tx) => {
      const { topicIds, ...articleData } = input;

      const existingArticle = await tx.article.findUnique({
        where: { slug: articleData.slug },
        select: { id: true },
      });

      const finalSlug = existingArticle ? `${input.slug}-${new Date().getTime()}` : input.slug;

      return tx.article.create({
        data: {
          ...articleData,
          slug: finalSlug,
          topicArticles: {
            create: this.buildTopicCreates(topicIds),
          },
        },
        include: articleWithTopicsInclude,
      });
    });
  }

  async update(slug: string, input: UpdateAdminArticleRepositoryInput): Promise<ArticleWithTopics> {
    return await this.prisma.$transaction(async (tx) => {
      const { topicIds, ...articleData } = input;

      const existing = await tx.article.findUnique({
        where: { slug: slug },
        select: { publishedAt: true, status: true },
      });

      if (!existing) throw new NotFoundException(`Article ${slug} not found`);

      function getPublishedAt(
        existing: Pick<Article, 'publishedAt' | 'status'>,
        input: UpdateAdminArticleRepositoryInput,
      ): Date | null {
        if (existing.status === input.status) {
          return existing.publishedAt;
        }
        if (input.status === EntityStatus.DRAFT) {
          return null;
        }
        return new Date();
      }

      return tx.article.update({
        where: {
          slug: slug,
        },
        data: {
          ...articleData,
          publishedAt: getPublishedAt(existing, input),
          topicArticles: {
            deleteMany: {},
            create: this.buildTopicCreates(topicIds),
          },
        },
        include: articleWithTopicsInclude,
      });
    });
  }
}
