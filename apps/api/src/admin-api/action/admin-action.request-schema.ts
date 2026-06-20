import { ActionType, EntityStatus } from '@prisma/client';
import { z } from 'zod';

const trimmedString = () => z.string().trim();

const requiredTrimmedString = (fieldLabel: string, max: number) =>
  trimmedString()
    .min(1, `${fieldLabel} is required`)
    .max(max, `${fieldLabel} must be ${max} characters or fewer`);

const topicSlugsSchema = z
  .array(requiredTrimmedString('Topic slug', 120))
  .min(1, 'At least one topic slug is required');

export const adminActionRequestSchema = z.object({
  title: requiredTrimmedString('Title', 200),
  summary: requiredTrimmedString('Summary', 300),
  description: requiredTrimmedString('Description', 50000),
  externalUrl: z
    .string()
    .trim()
    .url('External URL must be a valid URL')
    .max(2048, 'External URL must be 2048 characters or fewer')
    .nullable()
    .optional(),
  actionType: z.nativeEnum(ActionType),
  topicSlugs: topicSlugsSchema,
  status: z.nativeEnum(EntityStatus),
});
