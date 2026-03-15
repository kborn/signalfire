import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from './article.service';
import { ArticleRepository } from './article.repository';

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

describe('ArticleService', () => {
  let service: ArticleService;
  const repoMock = {
    findBySlug: jest.fn(),
    findPublishedBySlug: jest.fn(),
    findPublishedByTopicSlug: jest.fn(),
    findPublishedByActionId: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticleService, { provide: ArticleRepository, useValue: repoMock }],
    }).compile();
    service = module.get(ArticleService);
  });

  it('getArticleDetail', async () => {
    repoMock.findBySlug.mockResolvedValue(article);

    const slug = 'test';
    const ret = await service.getArticleDetail(slug);

    expect(ret).toEqual(article);
    expect(repoMock.findBySlug).toHaveBeenCalledWith(slug);
  });

  it('getPublishedArticleDetail', async () => {
    repoMock.findPublishedBySlug.mockResolvedValue(article);

    const slug = 'test';
    const ret = await service.getPublishedArticleDetail(slug);

    expect(ret).toEqual(article);
    expect(repoMock.findPublishedBySlug).toHaveBeenCalledWith(slug);
  });

  it('getArticlesForTopic', async () => {
    repoMock.findPublishedByTopicSlug.mockResolvedValue([article]);

    const slug = 'test';
    const ret = await service.getArticlesForTopic(slug);

    expect(ret).toEqual([article]);
    expect(repoMock.findPublishedByTopicSlug).toHaveBeenCalledWith(slug);
  });

  it('getArticlesForAction', async () => {
    repoMock.findPublishedByActionId.mockResolvedValue([article]);

    const id = 1;
    const ret = await service.getArticlesForAction(id);

    expect(ret).toEqual([article]);
    expect(repoMock.findPublishedByActionId).toHaveBeenCalledWith(id);
  });
});
