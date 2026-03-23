import { Prisma } from '@prisma/client';
import { EntityStatus } from '@prisma/client';
import { generateRandomString } from './factory.utilities';

export async function createArticle(overrides: Partial<Prisma.ArticleCreateInput> = {}) {
  const status = overrides.status ?? EntityStatus.PUBLISHED;
  return jestPrisma.client.article.create({
    data: {
      slug: `article-${generateRandomString()}`,
      title: 'Test article',
      summary: 'Summary',
      content: 'Content',
      status,
      author: 'Test Author',
      publishedAt: overrides.publishedAt ?? (status === EntityStatus.PUBLISHED ? new Date() : null),
      ...overrides,
    },
  });
}
