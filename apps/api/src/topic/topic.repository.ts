import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Topic } from '@prisma/client';

@Injectable()
export class TopicRepository {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<Topic[]> {
    return this.prisma.topic.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }

  findBySlug(slug: string): Promise<Topic | null> {
    return this.prisma.topic.findUnique({
      where: { slug: slug },
    });
  }

  findByArticleId(articleId: number): Promise<Topic[]> {
    return this.prisma.topic.findMany({
      where: {
        topicArticles: {
          some: {
            articleId,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  findByActionId(actionId: number): Promise<Topic[]> {
    return this.prisma.topic.findMany({
      where: {
        topicActions: {
          some: {
            actionId,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  findByEventId(eventId: number): Promise<Topic[]> {
    return this.prisma.topic.findMany({
      where: {
        topicEvents: {
          some: {
            eventId,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });
  }
}
