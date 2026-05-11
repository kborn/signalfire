import { SubmissionType } from '@prisma/client';

export class UnknownSubmissionTopicsError extends Error {
  constructor(readonly slugs: string[]) {
    super(`Unknown topic slugs: ${slugs.join(', ')}`);
    this.name = 'UnknownSubmissionTopicsError';
  }
}

export class ReviewSubmissionTypeError extends Error {
  constructor(
    readonly expected: SubmissionType,
    actual: SubmissionType,
  ) {
    super(`Unexpected type in submission review. Expected ${expected} but received ${actual}`);
    this.name = 'ReviewSubmissionTypeError';
  }
}
