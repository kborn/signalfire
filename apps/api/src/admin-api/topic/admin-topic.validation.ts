import type { AdminTopicRequest } from '@signal-fire/api-contracts';
import { adminTopicRequestSchema } from './admin-topic.request-schema';
import { parseOrThrow } from '../../common/zod-validation';

export function validateAdminTopicRequest(value: unknown): AdminTopicRequest {
  return parseOrThrow(adminTopicRequestSchema, value, 'body');
}
