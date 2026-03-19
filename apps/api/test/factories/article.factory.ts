import { PrismaService } from '../../src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { EntityStatus } from '@prisma/client';
import { generateRandomString } from './factory.utilities';

export async function createArticle(
  prisma: PrismaService,
  overrides: Partial<Prisma.ArticleCreateInput> = {},
) {
  return prisma.article.create({
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
