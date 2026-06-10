import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EntityStatus } from '@prisma/client';
import { AdminArticleController } from './admin-article.controller';
import { AdminArticleService } from './admin-article.service';
import { UnknownSubmissionTopicsError } from '../../submission/submission.error';

describe('AdminArticleController', () => {
  let controller: AdminArticleController;

  const serviceMock = {
    create: jest.fn(),
    update: jest.fn(),
    getAdminArticleList: jest.fn(),
    getAdminArticleDetail: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AdminArticleController],
      providers: [{ provide: AdminArticleService, useValue: serviceMock }],
    }).compile();

    controller = app.get(AdminArticleController);
  });

  it('create maps unknown topic errors to BadRequestException', async () => {
    serviceMock.create.mockRejectedValue(new UnknownSubmissionTopicsError(['unknown-topic']));

    await expect(
      controller.create({
        title: 'Climate Article',
        summary: 'Summary',
        content: 'Content',
        author: 'John Smith',
        topicSlugs: ['unknown-topic'],
        status: EntityStatus.PUBLISHED,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('update maps unknown topic errors to BadRequestException', async () => {
    serviceMock.update.mockRejectedValue(new UnknownSubmissionTopicsError(['unknown-topic']));

    await expect(
      controller.update('climate-article', {
        title: 'Climate Article',
        summary: 'Summary',
        content: 'Content',
        author: 'John Smith',
        topicSlugs: ['unknown-topic'],
        status: EntityStatus.PUBLISHED,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('rejects invalid list status values', async () => {
    await expect(controller.findArticles('ARCHIVED' as never)).rejects.toThrow(BadRequestException);
  });

  it('delegates list and detail reads to the service', async () => {
    serviceMock.getAdminArticleList.mockResolvedValue({ items: [] });
    serviceMock.getAdminArticleDetail.mockResolvedValue({ id: 1, slug: 'a' });

    await expect(controller.findArticles('DRAFT')).resolves.toEqual({ items: [] });
    await expect(controller.findArticle('climate-article')).resolves.toEqual({
      id: 1,
      slug: 'a',
    });
  });
});
