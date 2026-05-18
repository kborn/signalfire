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

const resourceLinksSchema = z.preprocess(
  (value) => {
    if (value === undefined || value === null) {
      return null;
    }

    return value;
  },
  z
    .array(requiredTrimmedString('Resource link', 2000))
    .min(1, 'Resource links must be omitted, null, or a non-empty array')
    .nullable(),
);

const websiteUrlSchema = optionalNullableTrimmedString(2000);

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
      .datetime({ offset: true, message: `${fieldLabel} must be valid` })
      .nullable(),
  );

function addEndTimeAfterStartIssue(
  ctx: z.RefinementCtx,
  startTime: string,
  endTime: string | null | undefined,
  path: (string | number)[],
) {
  if (endTime == null) {
    return;
  }

  if (new Date(endTime) < new Date(startTime)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path,
      message: 'End datetime must be greater than or equal to start datetime',
    });
  }
}

const submissionCommonSchema = z.object({
  author: optionalNullableTrimmedString(120),
  submitterName: optionalNullableTrimmedString(120),
  submitterEmail: optionalNullableEmail(),
});

const articleSubmissionSchema = submissionCommonSchema.extend({
  submissionType: z.literal('ARTICLE'),
  payload: z.object({
    title: requiredTrimmedString('Title', 200),
    summary: requiredTrimmedString('Summary', 300),
    content: requiredTrimmedString('Content', 50000),
    topicSlugs: topicSlugsSchema,
    resourceLinks: resourceLinksSchema.optional(),
  }),
});

const eventSubmissionSchema = submissionCommonSchema
  .extend({
    submissionType: z.literal('EVENT'),
    payload: z.object({
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
      locationAddressLine1: optionalNullableTrimmedString(300),
      locationAddressLine2: optionalNullableTrimmedString(120),
      locationAddressCity: requiredTrimmedString('Location address city', 120),
      locationAddressRegion: requiredTrimmedString('Location address region', 120),
      locationAddressCountry: requiredTrimmedString('Location address country', 120),
      locationAddressZip: requiredTrimmedString('Postal Code', 32),
      contactEmail: optionalNullableEmail(),
      topicSlugs: topicSlugsSchema,
      websiteUrl: websiteUrlSchema.optional(),
    }),
  })
  .superRefine((value, ctx) => {
    addEndTimeAfterStartIssue(ctx, value.payload.startTime, value.payload.endTime, [
      'payload',
      'endTime',
    ]);
  });

export const submissionRequestSchema = z.discriminatedUnion('submissionType', [
  articleSubmissionSchema,
  eventSubmissionSchema,
]);

const reviewNotesSchema = optionalNullableTrimmedString(2000);

const moderationReviewRejectedSchema = z.object({
  decision: z.literal('REJECT'),
  reviewNotes: reviewNotesSchema,
});

const moderationReviewApproveArticleSchema = z.object({
  decision: z.literal('APPROVE_ARTICLE'),
  reviewNotes: reviewNotesSchema,
  publishStatus: z.nativeEnum(EntityStatus),
  normalized: z.object({
    title: requiredTrimmedString('Title', 200),
    summary: requiredTrimmedString('Summary', 300),
    content: requiredTrimmedString('Content', 50000),
    topicSlugs: topicSlugsSchema,
    author: requiredTrimmedString('Author', 120),
  }),
});

const moderationReviewApproveEventSchema = z
  .object({
    decision: z.literal('APPROVE_EVENT'),
    reviewNotes: reviewNotesSchema,
    publishStatus: z.nativeEnum(EntityStatus),
    normalized: z.object({
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
      addressLine1: optionalNullableTrimmedString(300),
      addressLine2: optionalNullableTrimmedString(120),
      city: requiredTrimmedString('City', 120),
      region: requiredTrimmedString('Region', 120),
      country: requiredTrimmedString('Country', 120),
      postalCode: requiredTrimmedString('Postal Code', 32),
      website: websiteUrlSchema.optional(),
      topicSlugs: topicSlugsSchema,
    }),
  })
  .superRefine((value, ctx) => {
    addEndTimeAfterStartIssue(ctx, value.normalized.startTime, value.normalized.endTime, [
      'normalized',
      'endTime',
    ]);
  });

export const moderationSubmissionRequestSchema = z.discriminatedUnion('decision', [
  moderationReviewRejectedSchema,
  moderationReviewApproveArticleSchema,
  moderationReviewApproveEventSchema,
]);
