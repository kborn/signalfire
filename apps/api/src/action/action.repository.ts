import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Action, EntityStatus } from '@prisma/client';
import {
  CreateAdminActionRepositoryInput,
  UpdateAdminActionRepositoryInput,
} from './admin-action.repository.type';
import { AdminActionResponse } from '@signal-fire/api-contracts';

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

  findActions(status?: EntityStatus | null): Promise<Action[]> {
    // Use a type-safe object built with only the keys you need
    const predicate: Parameters<typeof this.prisma.action.findMany>[0] = {
      orderBy: [{ updatedAt: 'desc' }, { id: 'asc' }],
    };

    if (status) {
      predicate.where = {
        status: status,
      };
    }

    return this.prisma.action.findMany(predicate);
  }

  async findBySlugAndStatus(slug: string, status?: EntityStatus | null): Promise<Action | null> {
    const action = await this.prisma.action.findUnique({
      where: {
        slug: slug,
      },
    });

    if (!action || !status) {
      return action;
    }

    return status === action.status ? action : null;
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
      assignedBy: 'moderation',
    }));
  }

  async create(input: CreateAdminActionRepositoryInput): Promise<AdminActionResponse> {
    return await this.prisma.$transaction(async (tx) => {
      const { topicIds, ...actionData } = input;

      // 1. Check if the slug already exists
      const existingAction = await tx.action.findUnique({
        where: { slug: actionData.slug },
        select: { id: true },
      });

      // 2. Adjust the slug conditionally before running the create statement
      const finalSlug = existingAction ? `${input.slug}-${new Date().getTime()}` : input.slug;

      const action = await tx.action.create({
        data: {
          ...actionData,
          slug: finalSlug,
          topicActions: {
            create: this.buildTopicCreates(topicIds),
          },
        },
      });
      return { id: action.id, slug: action.slug };
    });
  }

  async update(
    slug: string,
    input: UpdateAdminActionRepositoryInput,
  ): Promise<AdminActionResponse> {
    return await this.prisma.$transaction(async (tx) => {
      const { topicIds, ...actionData } = input;

      const existing = await tx.action.findUnique({
        where: { slug: slug },
        select: { publishedAt: true, status: true },
      });

      if (!existing) throw new NotFoundException(`Action ${slug} not found`);

      await tx.action.update({
        where: {
          slug: slug,
        },
        data: {
          topicActions: {},
        },
      });

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

      const action = await tx.action.update({
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
      });
      return { id: action.id, slug: action.slug };
    });
  }
}
