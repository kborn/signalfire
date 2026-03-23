import { Prisma } from '@prisma/client';
import { ActionType, EntityStatus } from '@prisma/client';
import { generateRandomString } from './factory.utilities';

export async function createAction(overrides: Partial<Prisma.ActionCreateInput> = {}) {
  return jestPrisma.client.action.create({
    data: {
      slug: `action-${generateRandomString()}`,
      title: 'Test action',
      summary: 'Summary',
      description: 'Description',
      actionType: ActionType.DONATE,
      status: EntityStatus.PUBLISHED,
      publishedAt: new Date(),
      ...overrides,
    },
  });
}
