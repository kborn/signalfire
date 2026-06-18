import type { ModerationReviewRequest, SubmissionRequest } from '@signal-fire/api-contracts';
import {
  moderationSubmissionRequestSchema,
  submissionRequestSchema,
} from './submission.request-schema';
import { parseOrThrow } from '../common/zod-validation';

export function validateSubmissionRequest(value: unknown): SubmissionRequest {
  return parseOrThrow(submissionRequestSchema, value, 'body');
}

export function validateSubmissionModerationRequest(value: unknown): ModerationReviewRequest {
  return parseOrThrow(moderationSubmissionRequestSchema, value, 'body');
}
