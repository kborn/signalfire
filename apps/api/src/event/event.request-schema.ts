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
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

function getDefaultEndDate(start: Date): Date {
  const date = new Date(start);
  date.setUTCMonth(date.getUTCMonth() + 3);
  return date;
}

function parseDateOnlyString(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return null;
  }

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

function toExclusiveEndOfDay(date: Date): Date {
  const exclusiveEnd = new Date(date);
  exclusiveEnd.setUTCDate(exclusiveEnd.getUTCDate() + 1);
  return exclusiveEnd;
}

const optionalDateOnly = (fieldLabel: string) =>
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
        .refine((value) => parseDateOnlyString(value) !== null, `${fieldLabel} must be valid`)
        .transform((value) => parseDateOnlyString(value)!),
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
  startDate: optionalDateOnly('Start date'),
  endDate: optionalDateOnly('End date'),
  city: optionalNullableTrimmedString(120),
  region: optionalNullableTrimmedString(120),
});

export const eventRequestSchema = parsedEventRequestSchema
  .transform((value) => {
    const startDate = value.startDate ?? getDefaultStartDate();
    const endDate = value.endDate
      ? toExclusiveEndOfDay(value.endDate)
      : getDefaultEndDate(startDate);

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
