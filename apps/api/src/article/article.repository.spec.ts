import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ArticleRepository } from './article.repository';
import { EntityStatus } from '@prisma/client';
import { buildArticleEntity } from './article.test-fixtures';

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

  it('findPublished', async () => {
    const article1 = buildArticleEntity();
    const article2 = buildArticleEntity({
      id: 2,
      slug: 'how-local-climate-policy-works',
      title: 'How Local Climate Policy Works',
      summary: 'A guide to city-level climate policy.',
      publishedAt: new Date('2025-12-18T03:24:00.000Z'),
    });
    prismaMock.article.findMany.mockResolvedValue([article1, article2]);

    const ret = await repository.findPublished();

    expect(ret).toEqual([article1, article2]);
    expect(prismaMock.article.findMany).toHaveBeenCalledWith({
      where: {
        status: EntityStatus.PUBLISHED,
      },
      orderBy: {
        publishedAt: 'desc',
      },
    });
  });

  it('findBySlug', async () => {
    const article = buildArticleEntity();
    prismaMock.article.findUnique.mockResolvedValue(article);

    const slug = 'test';
    const ret = await repository.findBySlug(slug);

    expect(ret).toEqual(article);
    expect(prismaMock.article.findUnique).toHaveBeenCalledWith({
      where: { slug: slug },
    });
  });

  it('findPublishedBySlug', async () => {
    const article = buildArticleEntity();
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
    const article = buildArticleEntity();
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
    const article = buildArticleEntity();
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
