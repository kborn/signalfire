import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EntityStatus, Event } from '@prisma/client';

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

  findPublished(startDate: Date, endDate: Date, topicSlug?: string): Promise<Event[]> {
    return this.prisma.event.findMany({
      where: {
        status: EntityStatus.PUBLISHED,
        startTime: {
          gte: startDate,
          lt: endDate,
        },
        topicEvents: topicSlug
          ? {
              some: {
                topic: {
                  slug: topicSlug,
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
}
