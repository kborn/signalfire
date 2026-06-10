import { z } from 'zod';

const trimmedString = () => z.string().trim();

const requiredTrimmedString = (fieldLabel: string, max: number) =>
  trimmedString()
    .min(1, `${fieldLabel} is required`)
    .max(max, `${fieldLabel} must be ${max} characters or fewer`);

export const adminLoginRequestSchema = z.object({
  email: requiredTrimmedString('Email', 320).email('Email must be a valid email address'),
  password: requiredTrimmedString('Password', 500),
});
