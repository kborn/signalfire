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

const optionalDatetime = (fieldLabel: string) =>
  z
    .preprocess(
      (value) => {
        if (value == null) return undefined;

        if (typeof value === 'string') {
          const trimmed = value.trim();
          return trimmed.length === 0 ? undefined : trimmed;
        }

        return value;
      },
      z
        .string()
        .trim()
        .datetime({ offset: false, local: true, message: `${fieldLabel} must be valid` })
        .transform((value) => new Date(value)),
    )
    .optional();

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

const parsedEventRequestSchema = z.object({
  topicSlug: optionalNullableTrimmedString(120),
  startDate: optionalDatetime('Start datetime'),
  endDate: optionalDatetime('End datetime'),
  city: optionalNullableTrimmedString(120),
  region: optionalNullableTrimmedString(120),
});

export const eventRequestSchema = parsedEventRequestSchema
  .transform((value) => {
    const startDate = value.startDate ?? getDefaultStartDate();
    const endDate = value.endDate ?? getDefaultEndDate(startDate);

    return {
      topicSlug: value.topicSlug ?? undefined,
      startDate,
      endDate,
      city: value.city ?? undefined,
      region: value.region ?? undefined,
    };
  })
  .superRefine((value, ctx) => {
    addEndTimeAfterStartIssue(ctx, value.startDate, value.endDate, ['endDate']);
  });
