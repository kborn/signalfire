import { BadRequestException } from '@nestjs/common';
import type { SubmissionResponseError } from '@signal-fire/api-contracts';
import { ZodError, type ZodIssue } from 'zod';
import { actionRequestSchema } from './action.request-schema';
import { ValidatedActionListQuery } from './action.type';

function formatIssuePath(path: PropertyKey[]): string {
  if (path.length === 0) {
    return 'query';
  }

  return path.reduce<string>((acc, segment) => {
    if (typeof segment === 'number') {
      return `${acc}[${segment}]`;
    }

    const segmentText = String(segment);
    return acc.length === 0 ? segmentText : `${acc}.${segmentText}`;
  }, '');
}

function buildValidationError(error: ZodError): SubmissionResponseError {
  return {
    errors: error.issues.map((issue: ZodIssue) => ({
      type: 'field',
      field: formatIssuePath(issue.path),
      message: issue.message,
    })),
  };
}

export function validateActionRequest(value: unknown): ValidatedActionListQuery {
  const parsed = actionRequestSchema.safeParse(value);

  if (!parsed.success) {
    throw new BadRequestException(buildValidationError(parsed.error));
  }

  return parsed.data as ValidatedActionListQuery;
}
