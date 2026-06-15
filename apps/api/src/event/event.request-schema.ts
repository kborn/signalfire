import { z } from 'zod';

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

function getDefaultStartDate(): Date {
  return new Date();
}

function getDefaultEndDate(start: Date): Date {
  const date = new Date(start);
  date.setUTCMonth(date.getUTCMonth() + 3);
  return date;
}

const requiredDatetimeWithDefault = (fieldLabel: string, defaultDateFn: () => Date) =>
  z.preprocess(
    (value) => {
      if (value == null) return defaultDateFn();

      if (typeof value === 'string') {
        const trimmed = value.trim();
        return trimmed.length === 0 ? null : trimmed;
      }

      return defaultDateFn();
    },
    z
      .string()
      .trim()
      .datetime({ offset: false, local: true, message: `${fieldLabel} must be valid` })
      .transform((value) => new Date(value)),
  );

const optionalNullableDatetime = (fieldLabel: string) =>
  z.preprocess(
    (value) => {
      if (value == null) return null;

      if (typeof value === 'string') {
        const trimmed = value.trim();
        return trimmed.length === 0 ? null : trimmed;
      }

      return value;
    },
    z
      .string()
      .trim()
      .datetime({ offset: false, local: true, message: `${fieldLabel} must be valid` })
      .transform((value) => new Date(value)),
  );

function addEndTimeAfterStartIssue(
  ctx: z.RefinementCtx,
  startDate: Date,
  endDate: Date,
  path: (string | number)[],
) {
  if (endDate < startDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path,
      message: 'End datetime must be greater than or equal to start datetime',
    });
  }
}

export const eventRequestSchema = z
  .object({
    topicSlug: optionalNullableTrimmedString(120),
    startDate: requiredDatetimeWithDefault('Start datetime', getDefaultStartDate),
    endDate: optionalNullableDatetime('End datetime'),
    city: optionalNullableTrimmedString(120),
    region: optionalNullableTrimmedString(120),
  })
  .superRefine((value, ctx) => {
    value.endDate = value.endDate ?? getDefaultEndDate(value.startDate);
    addEndTimeAfterStartIssue(ctx, value.startDate, value.endDate, ['endDate']);
  });
