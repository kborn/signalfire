import { articleRequestSchema } from './article.request-schema';
import { ValidatedArticleListQuery } from './article.type';
import { parseOrThrow } from '../common/zod-validation';

export function validateArticleRequest(value: unknown): ValidatedArticleListQuery {
  return parseOrThrow(articleRequestSchema, value, 'query');
}
