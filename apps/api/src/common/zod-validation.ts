import { BadRequestException } from '@nestjs/common';
import type { SubmissionResponseError, ValidationError } from '@signal-fire/api-contracts';
import { ZodError, type ZodIssue, type ZodType } from 'zod';

export type ValidationSource = 'body' | 'query';

function formatIssuePath(path: PropertyKey[], source: ValidationSource): string {
  if (path.length === 0) {
    return source;
  }

  return path.reduce<string>((acc, segment) => {
    if (typeof segment === 'number') {
      return `${acc}[${segment}]`;
    }

    const segmentText = String(segment);
    return acc.length === 0 ? segmentText : `${acc}.${segmentText}`;
  }, '');
}

export function buildZodValidationError(
  error: ZodError,
  source: ValidationSource,
): SubmissionResponseError {
  return {
    errors: error.issues.map((issue: ZodIssue) => ({
      type: 'field',
      field: formatIssuePath(issue.path, source),
      message: issue.message,
    })) satisfies ValidationError[],
  };
}

export function parseOrThrow<T>(schema: ZodType<T>, value: unknown, source: ValidationSource): T {
  const parsed = schema.safeParse(value);

  if (!parsed.success) {
    throw new BadRequestException(buildZodValidationError(parsed.error, source));
  }

  return parsed.data;
}
