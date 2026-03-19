import { Prisma } from '@prisma/client';
import { PrismaService } from '../../src/prisma/prisma.service';
import { ActionType, EntityStatus } from '@prisma/client';
import { generateRandomString } from './factory.utilities';

export async function createAction(
  prisma: PrismaService,
  overrides: Partial<Prisma.ActionCreateInput> = {},
) {
  return prisma.action.create({
    data: {
      slug: `action-${generateRandomString()}`,
      title: 'Test action',
      summary: 'Summary',
      description: 'Description',
      actionType: ActionType.DONATE,
      status: EntityStatus.PUBLISHED,
      ...overrides,
    },
  });
}
