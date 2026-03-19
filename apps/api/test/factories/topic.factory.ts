import { Prisma } from '@prisma/client';
import { PrismaService } from '../../src/prisma/prisma.service';
import { generateRandomString } from './factory.utilities';

export async function createTopic(
  prisma: PrismaService,
  overrides: Partial<Prisma.TopicCreateInput> = {},
) {
  return prisma.topic.create({
    data: {
      slug: `topic-${generateRandomString()}`,
      name: 'Name',
      description: 'Description',
      ...overrides,
    },
  });
}
