import { BadRequestException } from '@nestjs/common';
import { EntityStatus } from '@prisma/client';
import { validateAdminArticleRequest } from './admin-article.validation';

describe('validateAdminArticleRequest', () => {
  it('trims and accepts a valid request', () => {
    expect(
      validateAdminArticleRequest({
        title: '  Climate Article  ',
        summary: '  A short summary.  ',
        content: '  A longer description.  ',
        author: '  John Smith  ',
        topicSlugs: ['  climate  ', '  democracy  '],
        status: EntityStatus.PUBLISHED,
      }),
    ).toEqual({
      title: 'Climate Article',
      summary: 'A short summary.',
      content: 'A longer description.',
      author: 'John Smith',
      topicSlugs: ['climate', 'democracy'],
      status: EntityStatus.PUBLISHED,
    });
  });

  it('rejects invalid requests with field errors', () => {
    expect(() =>
      validateAdminArticleRequest({
        title: ' ',
        summary: '',
        content: '',
        author: '',
        topicSlugs: [],
        status: 'PUBLISHED',
      }),
    ).toThrow(BadRequestException);
  });
});
