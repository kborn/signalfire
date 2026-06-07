import { EntityStatus } from '@prisma/client';
import { z } from 'zod';

const trimmedString = () => z.string().trim();

const requiredTrimmedString = (fieldLabel: string, max: number) =>
  trimmedString()
    .min(1, `${fieldLabel} is required`)
    .max(max, `${fieldLabel} must be ${max} characters or fewer`);

const topicSlugsSchema = z
  .array(requiredTrimmedString('Topic slug', 120))
  .min(1, 'At least one topic slug is required');

export const adminArticleRequestSchema = z.object({
  title: requiredTrimmedString('Title', 200),
  summary: requiredTrimmedString('Summary', 300),
  content: requiredTrimmedString('Content', 50000),
  topicSlugs: topicSlugsSchema,
  author: requiredTrimmedString('Author', 120),
  status: z.nativeEnum(EntityStatus),
});
