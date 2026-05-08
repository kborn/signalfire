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

  async findIdsBySlugs(slugs: string[]): Promise<{ id: number; slug: string }[]> {
    return this.prisma.topic.findMany({
      where: {
        slug: {
          in: slugs,
        },
      },
      select: {
        id: true,
        slug: true,
      },
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

  findBySubmissionId(submissionId: number): Promise<Topic[]> {
    return this.prisma.topic.findMany({
      where: {
        submissionTopics: {
          some: {
            submissionId,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });
  }
}
