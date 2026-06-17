import { BadRequestException } from '@nestjs/common';
import type {
  ModerationReviewRequest,
  SubmissionRequest,
  SubmissionResponseError,
} from '@signal-fire/api-contracts';
import { ZodError, type ZodIssue } from 'zod';
import {
  moderationSubmissionRequestSchema,
  submissionRequestSchema,
} from './submission.request-schema';

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

function buildSubmissionValidationError(error: ZodError): SubmissionResponseError {
  return {
    errors: error.issues.map((issue: ZodIssue) => ({
      type: 'field',
      field: formatIssuePath(issue.path),
      message: issue.message,
    })),
  };
}

export function validateSubmissionRequest(value: unknown): SubmissionRequest {
  const parsed = submissionRequestSchema.safeParse(value);

  if (!parsed.success) {
    throw new BadRequestException(buildSubmissionValidationError(parsed.error));
  }

  return parsed.data;
}

export function validateSubmissionModerationRequest(value: unknown): ModerationReviewRequest {
  const parsed = moderationSubmissionRequestSchema.safeParse(value);

  if (!parsed.success) {
    throw new BadRequestException(buildSubmissionValidationError(parsed.error));
  }

  return parsed.data;
}
