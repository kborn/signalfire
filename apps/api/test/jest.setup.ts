import { Prisma } from '@prisma/client';

declare global {
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
      const isP2002 =
        error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';

      if (isP2002) {
        return { pass: true, message: () => '' };
      }

      const code = error instanceof Prisma.PrismaClientKnownRequestError ? error.code : 'unknown';
      const message = error instanceof Error ? error.message : String(error);

      return {
        pass: false,
        message: () =>
          `Expected Unique Violation (P2002), but caught a different error: [${code}] ${message}`,
      };
    }
  },
});

export {};
