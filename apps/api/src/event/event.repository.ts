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
    });
  }
}
