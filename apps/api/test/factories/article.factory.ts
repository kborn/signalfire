import { Prisma } from '@prisma/client';
import { EntityStatus } from '@prisma/client';
import { generateRandomString } from './factory.utilities';

export async function createArticle(overrides: Partial<Prisma.ArticleCreateInput> = {}) {
  return jestPrisma.client.article.create({
    data: {
      slug: `article-${generateRandomString()}`,
      title: 'Test article',
      summary: 'Summary',
      content: 'Content',
      status: EntityStatus.PUBLISHED,
      author: 'Test Author',
      publishedAt: new Date(),
      ...overrides,
    },
  });
}
