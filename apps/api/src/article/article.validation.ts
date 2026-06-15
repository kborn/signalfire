import { BadRequestException } from '@nestjs/common';
import type { SubmissionResponseError } from '@signal-fire/api-contracts';
import { ZodError, type ZodIssue } from 'zod';
import { articleRequestSchema } from './article.request-schema';
import { ValidatedArticleListQuery } from './article.type';

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

export function validateArticleRequest(value: unknown): ValidatedArticleListQuery {
  const parsed = articleRequestSchema.safeParse(value);

  if (!parsed.success) {
    throw new BadRequestException(buildValidationError(parsed.error));
  }

  return parsed.data as ValidatedArticleListQuery;
}
