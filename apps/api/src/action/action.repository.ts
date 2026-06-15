import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Action, EntityStatus, Prisma } from '@prisma/client';
import { ActionListResponse } from '@signal-fire/api-contracts';
import {
  CreateAdminActionRepositoryInput,
  UpdateAdminActionRepositoryInput,
} from '../admin-api/action/admin-action.repository.type';
import { toActionSummary } from '../common/public-content.mapper';
import type { ValidatedActionListQuery } from './action.type';

const actionWithTopicsInclude = {
  topicActions: {
    include: {
      topic: true,
    },
    orderBy: {
      topicId: 'asc',
    },
  },
} satisfies Prisma.ActionInclude;

export type ActionWithTopics = Prisma.ActionGetPayload<{
  include: typeof actionWithTopicsInclude;
}>;

type ActionOrderBy =
  | Prisma.ActionOrderByWithRelationInput
  | Prisma.ActionOrderByWithRelationInput[];

@Injectable()
export class ActionRepository {
  constructor(private prisma: PrismaService) {}

  async findPublished(req: ValidatedActionListQuery): Promise<ActionListResponse> {
    const where: Prisma.ActionWhereInput = {
      status: EntityStatus.PUBLISHED,
      topicActions: req.topicSlug
        ? {
            some: {
              topic: {
                slug: req.topicSlug,
              },
            },
          }
        : undefined,
    };

    const totalItems = await this.prisma.action.count({ where });

    const items = await this.prisma.action.findMany({
      where,
      orderBy: [{ publishedAt: 'desc' }, { id: 'asc' }],
      skip: (req.page - 1) * req.pageSize,
      take: req.pageSize,
    });

    return {
      items: items.map(toActionSummary),
      page: req.page,
      pageSize: req.pageSize,
      totalItems: totalItems,
      totalPages: Math.ceil(totalItems / req.pageSize),
    };
  }

  findPublishedBySlug(slug: string): Promise<Action | null> {
    return this.prisma.action.findFirst({
      where: {
        slug: slug,
        status: EntityStatus.PUBLISHED,
      },
    });
  }

  async findActionsWithTopics(
    status?: EntityStatus | null,
    orderBy: ActionOrderBy = [{ updatedAt: 'desc' }, { id: 'asc' }],
  ): Promise<ActionWithTopics[]> {
    return this.prisma.action.findMany({
      where: status
        ? {
            status: status,
          }
        : undefined,
      include: actionWithTopicsInclude,
      orderBy,
    });
  }

  async findBySlugWithTopics(
    slug: string,
    status?: EntityStatus | null,
  ): Promise<ActionWithTopics | null> {
    if (!status) {
      return this.prisma.action.findUnique({
        where: {
          slug: slug,
        },
        include: actionWithTopicsInclude,
      });
    }

    return this.prisma.action.findFirst({
      where: {
        slug: slug,
        status: status,
      },
      include: actionWithTopicsInclude,
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

  findPublishedByEventId(eventId: number): Promise<Action[]> {
    return this.prisma.action.findMany({
      where: {
        status: EntityStatus.PUBLISHED,
        actionEvents: {
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

  async create(input: CreateAdminActionRepositoryInput): Promise<ActionWithTopics> {
    return await this.prisma.$transaction(async (tx) => {
      const { topicIds, ...actionData } = input;

      const existingAction = await tx.action.findUnique({
        where: { slug: actionData.slug },
        select: { id: true },
      });

      const finalSlug = existingAction ? `${input.slug}-${new Date().getTime()}` : input.slug;

      return tx.action.create({
        data: {
          ...actionData,
          slug: finalSlug,
          topicActions: {
            create: this.buildTopicCreates(topicIds),
          },
        },
        include: actionWithTopicsInclude,
      });
    });
  }

  async update(slug: string, input: UpdateAdminActionRepositoryInput): Promise<ActionWithTopics> {
    return await this.prisma.$transaction(async (tx) => {
      const { topicIds, ...actionData } = input;

      const existing = await tx.action.findUnique({
        where: { slug: slug },
        select: { publishedAt: true, status: true },
      });

      if (!existing) throw new NotFoundException(`Action ${slug} not found`);

      function getPublishedAt(
        existing: Pick<Action, 'publishedAt' | 'status'>,
        input: UpdateAdminActionRepositoryInput,
      ): Date | null {
        if (existing.status === input.status) {
          return existing.publishedAt;
        }
        if (input.status === EntityStatus.DRAFT) {
          return null;
        }
        return new Date();
      }

      return tx.action.update({
        where: {
          slug: slug,
        },
        data: {
          ...actionData,
          publishedAt: getPublishedAt(existing, input),
          topicActions: {
            deleteMany: {},
            create: this.buildTopicCreates(topicIds),
          },
        },
        include: actionWithTopicsInclude,
      });
    });
  }
}
