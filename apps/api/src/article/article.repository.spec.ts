import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ArticleRepository } from './article.repository';
import { EntityStatus } from '@prisma/client';

const article = {
  id: 1,
  slug: 'protect-voting-rights',
  title: 'Protect Voting Rights',
  summary: 'A short article summary.',
  content: 'Full article content.',
  status: 'PUBLISHED',
  author: 'SignalFire Staff',
  createdAt: new Date(),
  publishedAt: new Date(),
  updatedAt: new Date(),
};

describe('ArticleRepository', () => {
  let repository: ArticleRepository;
  const prismaMock = {
    article: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticleRepository, { provide: PrismaService, useValue: prismaMock }],
    }).compile();
    repository = module.get(ArticleRepository);
  });

  it('findBySlug', async () => {
    prismaMock.article.findUnique.mockResolvedValue(article);

    const slug = 'test';
    const ret = await repository.findBySlug(slug);

    expect(ret).toEqual(article);
    expect(prismaMock.article.findUnique).toHaveBeenCalledWith({
      where: { slug: slug },
    });
  });

  it('findPublishedBySlug', async () => {
    prismaMock.article.findUnique.mockResolvedValue(article);

    const slug = 'test';
    const ret = await repository.findPublishedBySlug(slug);

    expect(ret).toEqual(article);
    expect(prismaMock.article.findUnique).toHaveBeenCalledWith({
      where: { slug: slug, status: EntityStatus.PUBLISHED },
      include: {
        topicArticles: {
          include: {
            topic: true,
          },
        },
        articleActions: {
          include: {
            action: true,
          },
        },
      },
    });
  });

  it('findPublishedByTopicSlug', async () => {
    prismaMock.article.findMany.mockResolvedValue([article]);

    const slug = 'test';
    const ret = await repository.findPublishedByTopicSlug(slug);

    expect(ret).toEqual([article]);
    expect(prismaMock.article.findMany).toHaveBeenCalledWith({
      where: {
        status: EntityStatus.PUBLISHED,
        topicArticles: {
          some: {
            topic: {
              slug: slug,
            },
          },
        },
      },
    });
  });

  it('findPublishedByActionId', async () => {
    prismaMock.article.findMany.mockResolvedValue([article]);

    const id = 1;
    const ret = await repository.findPublishedByActionId(id);

    expect(ret).toEqual([article]);
    expect(prismaMock.article.findMany).toHaveBeenCalledWith({
      where: {
        status: EntityStatus.PUBLISHED,
        articleActions: {
          some: {
            action: {
              id: id,
            },
          },
        },
      },
    });
  });
});
