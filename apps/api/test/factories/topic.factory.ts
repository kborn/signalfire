import { Prisma } from '@prisma/client';
import { generateRandomString } from './factory.utilities';

export async function createTopic(overrides: Partial<Prisma.TopicCreateInput> = {}) {
  return jestPrisma.client.topic.create({
    data: {
      slug: `topic-${generateRandomString()}`,
      name: 'Name',
      description: 'Description',
      ...overrides,
    },
  });
}
