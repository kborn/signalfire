import { Test, TestingModule } from '@nestjs/testing';
import { ActionRepository } from './action.repository';
import { PrismaService } from '../prisma/prisma.service';
import { ActionType, EntityStatus } from '@prisma/client';
import { buildActionEntity, buildActionWithTopicsEntity } from './action.test-fixtures';

describe('ActionRepository', () => {
  let repository: ActionRepository;
  const prismaMock = {
    action: {
      count: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };
  const prismaServiceMock = {
    ...prismaMock,
    $transaction: jest.fn(<T>(callback: (tx: typeof prismaMock) => Promise<T>) =>
      callback(prismaMock),
    ),
  };
  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [ActionRepository, { provide: PrismaService, useValue: prismaServiceMock }],
    }).compile();
    repository = module.get(ActionRepository);
  });

  it('findPublished', async () => {
    const action1 = buildActionEntity();
    const action2 = buildActionEntity({
      id: 2,
      slug: 'join-neighborhood-climate-coalition',
      title: 'Join A Neighborhood Climate Coalition',
      summary: 'Work with local residents on recurring climate pressure campaigns.',
      actionType: ActionType.VOLUNTEER,
      publishedAt: new Date('2025-12-18T03:24:00.000Z'),
    });
    prismaMock.action.count.mockResolvedValue(2);
    prismaMock.action.findMany.mockResolvedValue([action1, action2]);

    const ret = await repository.findPublished({ page: 1, pageSize: 10, topicSlug: undefined });
    expect(ret.page).toBe(1);
    expect(ret.pageSize).toBe(10);
    expect(ret.totalItems).toBe(2);
    expect(ret.totalPages).toBe(1);
    expect(ret.items).toHaveLength(2);
    expect(prismaMock.action.findMany).toHaveBeenCalledWith({
      where: {
        status: EntityStatus.PUBLISHED,
        topicActions: undefined,
      },
      orderBy: [{ publishedAt: 'desc' }, { id: 'asc' }],
      skip: 0,
      take: 10,
    });
  });

  it('findPublished filters by topic slug', async () => {
    const action = buildActionEntity();
    prismaMock.action.count.mockResolvedValue(1);
    prismaMock.action.findMany.mockResolvedValue([action]);

    const ret = await repository.findPublished({
      page: 1,
      pageSize: 10,
      topicSlug: 'democracy',
    });
    expect(ret.page).toBe(1);
    expect(ret.pageSize).toBe(10);
    expect(ret.totalItems).toBe(1);
    expect(ret.totalPages).toBe(1);
    expect(ret.items).toHaveLength(1);
    expect(prismaMock.action.findMany).toHaveBeenCalledWith({
      where: {
        status: EntityStatus.PUBLISHED,
        topicActions: {
          some: {
            topic: {
              slug: 'democracy',
            },
          },
        },
      },
      orderBy: [{ publishedAt: 'desc' }, { id: 'asc' }],
      skip: 0,
      take: 10,
    });
  });

  it('findPublishedBySlug', async () => {
    const action = buildActionEntity();
    prismaMock.action.findFirst.mockResolvedValue(action);

    const slug = 'test';
    const ret = await repository.findPublishedBySlug(slug);

    expect(ret).toEqual(action);
    expect(prismaMock.action.findFirst).toHaveBeenCalledWith({
      where: { slug: slug, status: EntityStatus.PUBLISHED },
    });
  });

  it('findAllWithTopics', async () => {
    const action = buildActionWithTopicsEntity();
    prismaMock.action.findMany.mockResolvedValue([action]);

    const ret = await repository.findActionsWithTopics();

    expect(ret).toEqual([action]);
    expect(prismaMock.action.findMany).toHaveBeenCalledWith({
      where: undefined,
      include: {
        topicActions: {
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

  it('findBySlugWithTopics', async () => {
    const action = buildActionWithTopicsEntity();
    prismaMock.action.findUnique.mockResolvedValue(action);

    const slug = 'test';
    const ret = await repository.findBySlugWithTopics(slug);

    expect(ret).toEqual(action);
    expect(prismaMock.action.findUnique).toHaveBeenCalledWith({
      where: { slug: slug },
      include: {
        topicActions: {
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

  it('findPublishedByTopicSlug', async () => {
    const action = buildActionEntity();
    prismaMock.action.findMany.mockResolvedValue([action]);

    const slug = 'test';
    const ret = await repository.findPublishedByTopicSlug(slug);

    expect(ret).toEqual([action]);
    expect(prismaMock.action.findMany).toHaveBeenCalledWith({
      where: {
        status: EntityStatus.PUBLISHED,
        topicActions: {
          some: {
            topic: {
              slug: slug,
            },
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });
  });

  it('findPublishedByArticleId', async () => {
    const action = buildActionEntity();
    prismaMock.action.findMany.mockResolvedValue([action]);

    const id = 1;
    const ret = await repository.findPublishedByArticleId(id);

    expect(ret).toEqual([action]);
    expect(prismaMock.action.findMany).toHaveBeenCalledWith({
      where: {
        status: EntityStatus.PUBLISHED,
        articleActions: {
          some: {
            article: {
              id: id,
            },
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });
  });

  it('findPublishedByEventId', async () => {
    const action = buildActionEntity();
    prismaMock.action.findMany.mockResolvedValue([action]);

    const id = 1;
    const ret = await repository.findPublishedByEventId(id);

    expect(ret).toEqual([action]);
    expect(prismaMock.action.findMany).toHaveBeenCalledWith({
      where: {
        status: EntityStatus.PUBLISHED,
        actionEvents: {
          some: {
            event: {
              id: id,
            },
          },
        },
      },
      orderBy: [{ publishedAt: 'desc' }, { id: 'asc' }],
    });
  });

  it('create', async () => {
    const action = buildActionWithTopicsEntity();
    prismaMock.action.findUnique.mockResolvedValue(null);
    prismaMock.action.create.mockResolvedValue(action);
    const assignedAt = new Date('2026-01-01T00:00:01.000Z');
    jest.useFakeTimers().setSystemTime(assignedAt);
    try {
      const ret = await repository.create({
        title: action.title,
        slug: action.slug,
        summary: action.summary,
        description: action.description,
        actionType: action.actionType,
        status: action.status,
        publishedAt: action.publishedAt,
        topicIds: [1],
      });

      expect(ret).toEqual(action);
      expect(prismaMock.action.create).toHaveBeenCalledWith({
        data: {
          title: action.title,
          slug: action.slug,
          summary: action.summary,
          description: action.description,
          actionType: action.actionType,
          status: action.status,
          publishedAt: action.publishedAt,
          topicActions: {
            create: [
              {
                topic: { connect: { id: 1 } },
                assignedBy: 'admin',
                assignedAt: assignedAt,
              },
            ],
          },
        },
        include: {
          topicActions: {
            include: {
              topic: true,
            },
            orderBy: {
              topicId: 'asc',
            },
          },
        },
      });
    } finally {
      jest.useRealTimers();
    }
  });

  it('update', async () => {
    const action = buildActionWithTopicsEntity();
    prismaMock.action.findUnique.mockResolvedValue({
      publishedAt: action.publishedAt,
      status: action.status,
    });
    prismaMock.action.update.mockResolvedValue(action);
    const assignedAt = new Date('2026-01-01T00:00:02.000Z');
    jest.useFakeTimers().setSystemTime(assignedAt);
    try {
      const ret = await repository.update(action.slug, {
        title: action.title,
        summary: action.summary,
        description: action.description,
        actionType: action.actionType,
        status: action.status,
        topicIds: [1],
      });

      expect(ret).toEqual(action);
      expect(prismaMock.action.update).toHaveBeenCalledWith({
        where: {
          slug: action.slug,
        },
        data: {
          title: action.title,
          summary: action.summary,
          description: action.description,
          actionType: action.actionType,
          status: action.status,
          publishedAt: action.publishedAt,
          topicActions: {
            deleteMany: {},
            create: [
              {
                topic: { connect: { id: 1 } },
                assignedBy: 'admin',
                assignedAt: assignedAt,
              },
            ],
          },
        },
        include: {
          topicActions: {
            include: {
              topic: true,
            },
            orderBy: {
              topicId: 'asc',
            },
          },
        },
      });
    } finally {
      jest.useRealTimers();
    }
  });
});
