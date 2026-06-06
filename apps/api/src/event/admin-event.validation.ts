import { BadRequestException } from '@nestjs/common';
import type {
  AdminEventRequest,
  SubmissionResponseError,
  ValidationError,
} from '@signal-fire/api-contracts';
import { ZodError, type ZodIssue } from 'zod';
import { adminEventRequestSchema } from './admin-event.request-schema';

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

function buildValidationError(error: ZodError): SubmissionResponseError {
  return {
    errors: error.issues.map((issue: ZodIssue) => ({
      type: 'field',
      field: formatIssuePath(issue.path),
      message: issue.message,
    })) satisfies ValidationError[],
  };
}

export function validateAdminEventRequest(value: unknown): AdminEventRequest {
  const parsed = adminEventRequestSchema.safeParse(value);

  if (!parsed.success) {
    throw new BadRequestException(buildValidationError(parsed.error));
  }

  return parsed.data as AdminEventRequest;
}
