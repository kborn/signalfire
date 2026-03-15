import { Test, TestingModule } from '@nestjs/testing';
import { ActionRepository } from './action.repository';
import { PrismaService } from '../prisma/prisma.service';
import { EntityStatus } from '@prisma/client';

const action = {
  id: 1,
  slug: 'call-your-representative',
  title: 'Call Your Representative',
  summary: 'A short action summary.',
  description: 'A longer action description.',
  actionType: 'CONTACT',
  status: 'PUBLISHED',
  createdAt: new Date(),
  updatedAt: new Date(),
};

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

  it('findBySlug', async () => {
    prismaMock.action.findUnique.mockResolvedValue(action);

    const slug = 'test';
    const ret = await repository.findBySlug(slug);

    expect(ret).toEqual(action);
    expect(prismaMock.action.findUnique).toHaveBeenCalledWith({ where: { slug: slug } });
  });

  it('findPublishedBySlug', async () => {
    prismaMock.action.findUnique.mockResolvedValue(action);

    const slug = 'test';
    const ret = await repository.findPublishedBySlug(slug);

    expect(ret).toEqual(action);
    expect(prismaMock.action.findUnique).toHaveBeenCalledWith({
      where: { slug: slug, status: EntityStatus.PUBLISHED },
    });
  });

  it('findPublishedByTopicSlug', async () => {
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
    });
  });

  it('findPublishedByArticleId', async () => {
    prismaMock.action.findMany.mockResolvedValue([action]);

    const id = 1;
    const ret = await repository.findPublishedByArticleId(1);

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
    });
  });
});
