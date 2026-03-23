import { Prisma } from '@prisma/client';
import { ActionType, EntityStatus } from '@prisma/client';
import { generateRandomString } from './factory.utilities';

export async function createAction(overrides: Partial<Prisma.ActionCreateInput> = {}) {
  const status = overrides.status ?? EntityStatus.PUBLISHED;
  return jestPrisma.client.action.create({
    data: {
      slug: `action-${generateRandomString()}`,
      title: 'Test action',
      summary: 'Summary',
      description: 'Description',
      actionType: ActionType.DONATE,
      status,
      publishedAt: overrides.publishedAt ?? (status === EntityStatus.PUBLISHED ? new Date() : null),
      ...overrides,
    },
  });
}
