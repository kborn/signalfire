import { EntityStatus, EventType } from '@prisma/client';
import { z } from 'zod';

const trimmedString = () => z.string().trim();

const requiredTrimmedString = (fieldLabel: string, max: number) =>
  trimmedString()
    .min(1, `${fieldLabel} is required`)
    .max(max, `${fieldLabel} must be ${max} characters or fewer`);

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

const optionalNullableEmail = () =>
  z.preprocess((value) => {
    if (value === undefined || value === null) {
      return null;
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed.length === 0 ? null : trimmed;
    }

    return value;
  }, z.string().trim().email('Email must be valid').max(320, 'Email must be 320 characters or fewer').nullable());

const topicSlugsSchema = z
  .array(requiredTrimmedString('Topic slug', 120))
  .min(1, 'At least one topic slug is required');

const optionalNullableDatetime = (fieldLabel: string) =>
  z.preprocess(
    (value) => {
      if (value == null) {
        return null;
      }

      if (typeof value === 'string') {
        const trimmed = value.trim();
        return trimmed.length === 0 ? null : trimmed;
      }

      return value;
    },
    z
      .string()
      .trim()
      .datetime({ offset: true, message: `${fieldLabel} must be valid` })
      .nullable(),
  );

export const adminEventRequestSchema = z
  .object({
    title: requiredTrimmedString('Title', 200),
    summary: requiredTrimmedString('Summary', 300),
    description: requiredTrimmedString('Description', 50000),
    eventType: z.nativeEnum(EventType),
    startTime: z
      .string()
      .trim()
      .datetime({ offset: true, message: 'Start datetime must be valid' }),
    endTime: optionalNullableDatetime('End datetime'),
    locationName: requiredTrimmedString('Location name', 200),
    publicLocationDescription: optionalNullableTrimmedString(2000),
    contactEmail: optionalNullableEmail(),
    addressLine1: optionalNullableTrimmedString(300),
    addressLine2: optionalNullableTrimmedString(120),
    city: requiredTrimmedString('City', 120),
    region: requiredTrimmedString('Region', 120),
    country: requiredTrimmedString('Country', 120),
    postalCode: requiredTrimmedString('Postal Code', 32),
    website: optionalNullableTrimmedString(2000),
    topicSlugs: topicSlugsSchema,
    status: z.nativeEnum(EntityStatus),
  })
  .superRefine((value, ctx) => {
    if (value.endTime != null && new Date(value.endTime) < new Date(value.startTime)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endTime'],
        message: 'End datetime must be greater than or equal to start datetime',
      });
    }
  });
