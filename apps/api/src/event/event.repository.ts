import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EntityStatus, Event, Prisma } from '@prisma/client';
import {
  CreateAdminEventRepositoryInput,
  UpdateAdminEventRepositoryInput,
} from '../admin-api/event/admin-event.repository.type';
import type { ValidatedEventListQuery } from './event.type';

const eventWithTopicsInclude = {
  topicEvents: {
    include: {
      topic: true,
    },
    orderBy: {
      topicId: 'asc',
    },
  },
} satisfies Prisma.EventInclude;

export type EventWithTopics = Prisma.EventGetPayload<{
  include: typeof eventWithTopicsInclude;
}>;

type EventOrderBy = Prisma.EventOrderByWithRelationInput | Prisma.EventOrderByWithRelationInput[];

@Injectable()
export class EventRepository {
  constructor(private prisma: PrismaService) {}

  getById(id: number): Promise<Event | null> {
    return this.prisma.event.findUnique({
      where: {
        id: id,
      },
    });
  }

  getPublishedById(id: number): Promise<Event | null> {
    return this.prisma.event.findUnique({
      where: {
        status: EntityStatus.PUBLISHED,
        id: id,
      },
    });
  }

  findPublished(reqBody: ValidatedEventListQuery): Promise<Event[]> {
    return this.prisma.event.findMany({
      where: {
        status: EntityStatus.PUBLISHED,
        startTime: {
          gte: reqBody['startDate'],
          lt: reqBody['endDate'],
        },
        city: reqBody['city'],
        region: reqBody['region'],
        topicEvents: reqBody['topicSlug']
          ? {
              some: {
                topic: {
                  slug: reqBody['topicSlug'],
                },
              },
            }
          : undefined,
      },
      orderBy: [{ startTime: 'asc' }, { id: 'asc' }],
    });
  }

  findByArticleId(articleId: number): Promise<Event[]> {
    return this.prisma.event.findMany({
      where: {
        status: EntityStatus.PUBLISHED,
        articleEvents: {
          some: {
            article: {
              id: articleId,
            },
          },
        },
      },
      orderBy: [{ startTime: 'asc' }, { id: 'asc' }],
    });
  }

  findByActionId(actionId: number): Promise<Event[]> {
    return this.prisma.event.findMany({
      where: {
        status: EntityStatus.PUBLISHED,
        actionEvents: {
          some: {
            action: {
              id: actionId,
            },
          },
        },
      },
      orderBy: [{ startTime: 'asc' }, { id: 'asc' }],
    });
  }

  findEvents(
    status?: EntityStatus | null,
    orderBy: EventOrderBy = [{ updatedAt: 'desc' }, { id: 'asc' }],
  ): Promise<Event[]> {
    return this.prisma.event.findMany({
      where: status
        ? {
            status: status,
          }
        : undefined,
      orderBy,
    });
  }

  async findByIdWithTopics(
    id: number,
    status?: EntityStatus | null,
  ): Promise<EventWithTopics | null> {
    if (!status) {
      return this.prisma.event.findUnique({
        where: {
          id: id,
        },
        include: eventWithTopicsInclude,
      });
    }

    return this.prisma.event.findFirst({
      where: {
        id: id,
        status: status,
      },
      include: eventWithTopicsInclude,
    });
  }

  async findEventsWithTopics(
    status?: EntityStatus | null,
    orderBy: EventOrderBy = [{ updatedAt: 'desc' }, { id: 'asc' }],
  ): Promise<EventWithTopics[]> {
    return this.prisma.event.findMany({
      where: status
        ? {
            status: status,
          }
        : undefined,
      include: eventWithTopicsInclude,
      orderBy,
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

  async create(input: CreateAdminEventRepositoryInput): Promise<EventWithTopics> {
    return await this.prisma.$transaction(async (tx) => {
      const { topicIds, ...eventData } = input;

      return tx.event.create({
        data: {
          ...eventData,
          website: eventData.website ?? null,
          publicLocationDescription: eventData.publicLocationDescription ?? null,
          contactEmail: eventData.contactEmail ?? null,
          addressLine1: eventData.addressLine1 ?? null,
          addressLine2: eventData.addressLine2 ?? null,
          latitude: null,
          longitude: null,
          endTime: eventData.endTime ?? null,
          publishedAt: eventData.publishedAt,
          topicEvents: {
            create: this.buildTopicCreates(topicIds),
          },
        },
        include: eventWithTopicsInclude,
      });
    });
  }

  async update(id: number, input: UpdateAdminEventRepositoryInput): Promise<EventWithTopics> {
    return await this.prisma.$transaction(async (tx) => {
      const { topicIds, ...eventData } = input;

      const existing = await tx.event.findUnique({
        where: { id: id },
        select: { publishedAt: true, status: true },
      });

      if (!existing) {
        throw new NotFoundException(`Event ${id} not found`);
      }

      function getPublishedAt(
        current: Pick<Event, 'publishedAt' | 'status'>,
        next: UpdateAdminEventRepositoryInput,
      ): Date | null {
        if (current.status === next.status) {
          return current.publishedAt;
        }

        if (next.status === EntityStatus.DRAFT) {
          return null;
        }

        return new Date();
      }

      return tx.event.update({
        where: {
          id: id,
        },
        data: {
          ...eventData,
          website: eventData.website ?? null,
          publicLocationDescription: eventData.publicLocationDescription ?? null,
          contactEmail: eventData.contactEmail ?? null,
          addressLine1: eventData.addressLine1 ?? null,
          addressLine2: eventData.addressLine2 ?? null,
          endTime: eventData.endTime ?? null,
          publishedAt: getPublishedAt(existing, input),
          topicEvents: {
            deleteMany: {},
            create: this.buildTopicCreates(topicIds),
          },
        },
        include: eventWithTopicsInclude,
      });
    });
  }
}
