import type { AdminEventRequest } from '@signal-fire/api-contracts';
import { adminEventRequestSchema } from './admin-event.request-schema';
import { parseOrThrow } from '../../common/zod-validation';

export function validateAdminEventRequest(value: unknown): AdminEventRequest {
  return parseOrThrow(adminEventRequestSchema, value, 'body');
}
