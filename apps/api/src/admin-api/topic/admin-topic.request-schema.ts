import { z } from 'zod';

const requiredTrimmedString = (fieldLabel: string, max: number) =>
  z
    .string()
    .trim()
    .min(1, `${fieldLabel} is required`)
    .max(max, `${fieldLabel} must be ${max} characters or fewer`);

export const adminTopicRequestSchema = z.object({
  name: requiredTrimmedString('Name', 120),
  description: requiredTrimmedString('Description', 500),
  color: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Color must be a valid hex color (e.g. #5b88c7)')
    .optional(),
});
