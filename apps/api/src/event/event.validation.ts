import { BadRequestException } from '@nestjs/common';
import { ValidatedEventListQuery } from './event.type';
import type { SubmissionResponseError } from '@signal-fire/api-contracts';
import { ZodError, type ZodIssue } from 'zod';
import { eventRequestSchema } from './event.request-schema';
function formatIssuePath(path: PropertyKey[]): string {
  if (path.length === 0) {
    return 'body';
  }

  return path.reduce<string>((acc, segment) => {
    if (typeof segment === 'number') {
      return `${acc}[${segment}]`;
    }

    const segmentText = String(segment);
    return acc.length === 0 ? segmentText : `${acc}.${segmentText}`;
  }, '');
}

function buildEventValidationError(error: ZodError): SubmissionResponseError {
  return {
    errors: error.issues.map((issue: ZodIssue) => ({
      type: 'field',
      field: formatIssuePath(issue.path),
      message: issue.message,
    })),
  };
}

export function validateEventRequest(value: unknown): ValidatedEventListQuery {
  const parsed = eventRequestSchema.safeParse(value);

  if (!parsed.success) {
    throw new BadRequestException(buildEventValidationError(parsed.error));
  }

  return parsed.data;
}
