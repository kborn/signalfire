import type { AdminArticleRequest } from '@signal-fire/api-contracts';
import { adminArticleRequestSchema } from './admin-article.request-schema';
import { parseOrThrow } from '../../common/zod-validation';

export function validateAdminArticleRequest(value: unknown): AdminArticleRequest {
  return parseOrThrow(adminArticleRequestSchema, value, 'body');
}
