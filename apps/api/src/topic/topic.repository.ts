import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Topic, Prisma, EntityStatus } from '@prisma/client';

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

  findBySlugWithPublishedContent(slug: string) {
    return this.prisma.topic.findUnique({
      where: { slug },
      include: {
        topicArticles: {
          where: { article: { status: EntityStatus.PUBLISHED } },
          orderBy: { articleId: 'asc' },
          include: { article: true },
        },
        topicActions: {
          where: { action: { status: EntityStatus.PUBLISHED } },
          orderBy: { actionId: 'asc' },
          include: { action: true },
        },
      },
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

  async findAllWithCounts(): Promise<
    (Topic & { _count: { topicArticles: number; topicActions: number; topicEvents: number } })[]
  > {
    return this.prisma.topic.findMany({
      orderBy: { id: 'asc' },
      include: {
        _count: {
          select: {
            topicArticles: true,
            topicActions: true,
            topicEvents: true,
          },
        },
      },
    });
  }

  async findBySlugWithCounts(
    slug: string,
  ): Promise<
    | (Topic & { _count: { topicArticles: number; topicActions: number; topicEvents: number } })
    | null
  > {
    return this.prisma.topic.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            topicArticles: true,
            topicActions: true,
            topicEvents: true,
          },
        },
      },
    });
  }

  create(input: Prisma.TopicCreateInput): Promise<Topic> {
    return this.prisma.topic.create({ data: input });
  }

  update(slug: string, input: Prisma.TopicUpdateInput): Promise<Topic> {
    return this.prisma.topic.update({ where: { slug }, data: input });
  }

  async delete(slug: string): Promise<Topic> {
    return this.prisma.topic.delete({ where: { slug } });
  }

  async countLinkedContent(slug: string): Promise<{
    articles: number;
    actions: number;
    events: number;
  }> {
    const topic = await this.prisma.topic.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            topicArticles: true,
            topicActions: true,
            topicEvents: true,
          },
        },
      },
    });
    return {
      articles: topic?._count.topicArticles ?? 0,
      actions: topic?._count.topicActions ?? 0,
      events: topic?._count.topicEvents ?? 0,
    };
  }
}
