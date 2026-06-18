import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Article, EntityStatus, Prisma } from '@prisma/client';
import { ArticleListResponse } from '@signal-fire/api-contracts';
import {
  CreateAdminArticleRepositoryInput,
  UpdateAdminArticleRepositoryInput,
} from '../admin-api/article/admin-article.repository.type';
import { toArticleSummary } from '../common/public-content.mapper';
import { buildTopicAssignmentCreates } from '../common/topic-assignment';
import type { ValidatedArticleListQuery } from './article.type';

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

  async findPublished(req: ValidatedArticleListQuery): Promise<ArticleListResponse> {
    const where: Prisma.ArticleWhereInput = {
      status: EntityStatus.PUBLISHED,
      topicArticles: req.topicSlug
        ? {
            some: {
              topic: {
                slug: req.topicSlug,
              },
            },
          }
        : undefined,
    };

    const totalItems = await this.prisma.article.count({ where });

    const items = await this.prisma.article.findMany({
      where,
      orderBy: [{ publishedAt: 'desc' }, { id: 'asc' }],
      skip: (req.page - 1) * req.pageSize,
      take: req.pageSize,
    });

    return {
      items: items.map(toArticleSummary),
      page: req.page,
      pageSize: req.pageSize,
      totalItems: totalItems,
      totalPages: Math.ceil(totalItems / req.pageSize),
    };
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
            create: buildTopicAssignmentCreates(topicIds, 'admin'),
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
            create: buildTopicAssignmentCreates(topicIds, 'admin'),
          },
        },
        include: articleWithTopicsInclude,
      });
    });
  }
}
