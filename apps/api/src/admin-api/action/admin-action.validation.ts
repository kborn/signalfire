import type { AdminActionRequest } from '@signal-fire/api-contracts';
import { adminActionRequestSchema } from './admin-action.request-schema';
import { parseOrThrow } from '../../common/zod-validation';

export function validateAdminActionRequest(value: unknown): AdminActionRequest {
  return parseOrThrow(adminActionRequestSchema, value, 'body');
}
