import { Test, TestingModule } from '@nestjs/testing';
import { EventRepository } from './event.repository';
import { PrismaService } from '../prisma/prisma.service';
import { EntityStatus } from '@prisma/client';
import { buildEventEntity } from './event.test-fixtures';

const event = buildEventEntity();

describe('EventRepository', () => {
  let repository: EventRepository;
  const prismaMock = {
    event: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventRepository, { provide: PrismaService, useValue: prismaMock }],
    }).compile();
    repository = module.get(EventRepository);
  });

  it('getById', async () => {
    prismaMock.event.findUnique.mockResolvedValue(event);

    const id = 1;
    const ret = await repository.getById(id);

    expect(ret).toEqual(event);
    expect(prismaMock.event.findUnique).toHaveBeenCalledWith({ where: { id: id } });
  });

  it('getPublishedById', async () => {
    prismaMock.event.findUnique.mockResolvedValue(event);

    const id = 1;
    const ret = await repository.getPublishedById(id);

    expect(ret).toEqual(event);
    expect(prismaMock.event.findUnique).toHaveBeenCalledWith({
      where: { status: EntityStatus.PUBLISHED, id: id },
    });
  });

  it('findPublished', async () => {
    prismaMock.event.findMany.mockResolvedValue([event]);

    const startOfDay = new Date('2025-12-17T00:00:00.000Z');
    const startOfNextDay = new Date('2025-12-18T00:00:00.000Z');
    const topicSlug = 'democracy';
    const ret = await repository.findPublished({
      topicSlug,
      startDate: startOfDay,
      endDate: startOfNextDay,
    });

    expect(ret).toEqual([event]);
    expect(prismaMock.event.findMany).toHaveBeenCalledWith({
      where: {
        status: EntityStatus.PUBLISHED,
        startTime: {
          gte: startOfDay,
          lt: startOfNextDay,
        },
        topicEvents: {
          some: {
            topic: {
              slug: topicSlug,
            },
          },
        },
      },
      orderBy: [{ startTime: 'asc' }, { id: 'asc' }],
    });
  });

  it('findByArticleId', async () => {
    prismaMock.event.findMany.mockResolvedValue([event]);

    const id = 1;
    const ret = await repository.findByArticleId(id);

    expect(ret).toEqual([event]);
    expect(prismaMock.event.findMany).toHaveBeenCalledWith({
      where: {
        status: EntityStatus.PUBLISHED,
        articleEvents: {
          some: {
            article: {
              id: id,
            },
          },
        },
      },
      orderBy: [{ startTime: 'asc' }, { id: 'asc' }],
    });
  });

  it('findByActionId', async () => {
    prismaMock.event.findMany.mockResolvedValue([event]);

    const id = 1;
    const ret = await repository.findByActionId(id);

    expect(ret).toEqual([event]);
    expect(prismaMock.event.findMany).toHaveBeenCalledWith({
      where: {
        status: EntityStatus.PUBLISHED,
        actionEvents: {
          some: {
            action: {
              id: id,
            },
          },
        },
      },
      orderBy: [{ startTime: 'asc' }, { id: 'asc' }],
    });
  });

  it('findEventsWithTopics', async () => {
    prismaMock.event.findMany.mockResolvedValue([event]);

    const ret = await repository.findEventsWithTopics(EntityStatus.DRAFT);

    expect(ret).toEqual([event]);
    expect(prismaMock.event.findMany).toHaveBeenCalledWith({
      where: {
        status: EntityStatus.DRAFT,
      },
      include: {
        topicEvents: {
          include: {
            topic: true,
          },
          orderBy: {
            topicId: 'asc',
          },
        },
      },
      orderBy: [{ updatedAt: 'desc' }, { id: 'asc' }],
    });
  });

  it('findByIdWithTopics', async () => {
    prismaMock.event.findUnique.mockResolvedValue(event);

    const id = 1;
    const ret = await repository.findByIdWithTopics(id);

    expect(ret).toEqual(event);
    expect(prismaMock.event.findUnique).toHaveBeenCalledWith({
      where: {
        id: id,
      },
      include: {
        topicEvents: {
          include: {
            topic: true,
          },
          orderBy: {
            topicId: 'asc',
          },
        },
      },
    });
  });
});
