import { z } from 'zod';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '../common/pagination';

const optionalNullableTrimmedString = (max: number) =>
  z.preprocess(
    (value) => {
      if (value === undefined || value === null) {
        return null;
      }

      if (typeof value === 'string') {
        const trimmed = value.trim();
        return trimmed.length === 0 ? null : trimmed;
      }

      return value;
    },
    z.string().trim().max(max, `Must be ${max} characters or fewer`).nullable(),
  );

const optionalPositiveInteger = (fieldLabel: string, max?: number) =>
  z.preprocess(
    (value) => {
      if (value == null) return undefined;
      if (typeof value === 'string') {
        const trimmed = value.trim();
        return trimmed.length === 0 ? undefined : trimmed;
      }
      return value;
    },
    z.coerce
      .number()
      .int(`${fieldLabel} must be a whole number`)
      .positive(`${fieldLabel} must be a positive integer`)
      .refine((value) => (max == null ? true : value <= max), {
        message: max == null ? `${fieldLabel} is invalid` : `${fieldLabel} must be ${max} or less`,
      })
      .optional(),
  );

export const actionRequestSchema = z
  .object({
    topicSlug: optionalNullableTrimmedString(120),
    search: optionalNullableTrimmedString(200),
    page: optionalPositiveInteger('Page'),
    pageSize: optionalPositiveInteger('Page size', MAX_PAGE_SIZE),
  })
  .transform((value) => ({
    topicSlug: value.topicSlug ?? undefined,
    search: value.search ?? undefined,
    page: value.page ?? DEFAULT_PAGE,
    pageSize: value.pageSize ?? DEFAULT_PAGE_SIZE,
  }));
