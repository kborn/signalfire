import type { PrismaClient } from '@prisma/client';
import type { JestPrisma } from '@quramy/jest-prisma-core';

declare global {
  var jestPrisma: JestPrisma<PrismaClient>;
}

export {};
