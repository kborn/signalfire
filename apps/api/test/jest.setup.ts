import type { PrismaClient } from '@prisma/client';
import type { JestPrisma } from '@quramy/jest-prisma-core';

declare global {
  var jestPrisma: JestPrisma<PrismaClient>;

  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toThrowUniqueViolation(): Promise<R>;
    }
  }
}

expect.extend({
  async toThrowUniqueViolation(promise: Promise<unknown>) {
    try {
      await promise;
      return {
        pass: false,
        message: () => 'Expected a Unique Violation (P2002), but the database operation succeeded.',
      };
    } catch (error: unknown) {
      const code =
        typeof error === 'object' && error !== null && 'code' in error
          ? (error as { code?: string }).code
          : undefined;

      const message = error instanceof Error ? error.message : String(error);

      const isUniqueViolation = code === 'P2002' || /Unique constraint failed/i.test(message);

      return {
        pass: isUniqueViolation,
        message: () =>
          `Expected Unique Violation (P2002), but caught a different error: [${code}] ${message}`,
      };
    }
  },
});

export {};
