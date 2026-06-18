import { actionRequestSchema } from './action.request-schema';
import { ValidatedActionListQuery } from './action.type';
import { parseOrThrow } from '../common/zod-validation';

export function validateActionRequest(value: unknown): ValidatedActionListQuery {
  return parseOrThrow(actionRequestSchema, value, 'query');
}
