import { Test, TestingModule } from '@nestjs/testing';
import { ActionRepository } from './action.repository';
import { PrismaService } from '../prisma/prisma.service';
import { ActionType, EntityStatus } from '@prisma/client';
import { buildActionEntity } from './action.test-fixtures';

describe('ActionRepository', () => {
  let repository: ActionRepository;
  const prismaMock = {
    action: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  };
  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [ActionRepository, { provide: PrismaService, useValue: prismaMock }],
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
    prismaMock.action.findMany.mockResolvedValue([action1, action2]);

    const ret = await repository.findPublished();

    expect(ret).toEqual([action1, action2]);
    expect(prismaMock.action.findMany).toHaveBeenCalledWith({
      where: {
        status: EntityStatus.PUBLISHED,
      },
      orderBy: [{ publishedAt: 'desc' }, { id: 'asc' }],
    });
  });

  it('findBySlug', async () => {
    const action = buildActionEntity();
    prismaMock.action.findUnique.mockResolvedValue(action);

    const slug = 'test';
    const ret = await repository.findBySlug(slug);

    expect(ret).toEqual(action);
    expect(prismaMock.action.findUnique).toHaveBeenCalledWith({ where: { slug: slug } });
  });

  it('findPublishedBySlug', async () => {
    const action = buildActionEntity();
    prismaMock.action.findUnique.mockResolvedValue(action);

    const slug = 'test';
    const ret = await repository.findPublishedBySlug(slug);

    expect(ret).toEqual(action);
    expect(prismaMock.action.findUnique).toHaveBeenCalledWith({
      where: { slug: slug, status: EntityStatus.PUBLISHED },
      include: {
        topicActions: {
          orderBy: {
            topic: {
              id: 'asc',
            },
          },
          include: {
            topic: true,
          },
        },
        articleActions: {
          orderBy: {
            article: {
              id: 'asc',
            },
          },
          include: {
            article: true,
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
});
