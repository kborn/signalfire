import { PrismaClient } from '@prisma/client';
import { JestPrisma } from '@quramy/jest-prisma-core';

declare global {
  var jestPrisma: JestPrisma<PrismaClient>;
}

describe('rollback pilot', () => {
  it('creates a row', async () => {
    await jestPrisma.client.article.create({
      data: {
        slug: 'rollback-proof',
        title: 'Test article',
        summary: 'Summary',
        content: 'Content',
        status: 'PUBLISHED',
        author: 'Test Author',
        publishedAt: new Date(),
      },
    });
  });

  it('does not see rows from the previous test', async () => {
    await expect(
      jestPrisma.client.article.create({
        data: {
          slug: 'rollback-proof',
          title: 'Test article',
          summary: 'Summary',
          content: 'Content',
          status: 'PUBLISHED',
          author: 'Test Author',
          publishedAt: new Date(),
        },
      }),
    ).resolves.toBeDefined();
  });
});
