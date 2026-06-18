import { ValidatedEventListQuery } from './event.type';
import { eventRequestSchema } from './event.request-schema';
import { parseOrThrow } from '../common/zod-validation';

export function validateEventRequest(value: unknown): ValidatedEventListQuery {
  return parseOrThrow(eventRequestSchema, value, 'body');
}
