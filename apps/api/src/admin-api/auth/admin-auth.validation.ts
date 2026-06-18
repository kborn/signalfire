import type { AdminLoginRequest } from '@signal-fire/api-contracts';
import { adminLoginRequestSchema } from './admin-auth.request-schema';
import { parseOrThrow } from '../../common/zod-validation';

export function validateAdminLoginRequest(value: unknown): AdminLoginRequest {
  return parseOrThrow(adminLoginRequestSchema, value, 'body');
}
