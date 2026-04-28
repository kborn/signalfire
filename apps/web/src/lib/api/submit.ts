import { postSubmission } from '@/lib/api/base';
import {
  ArticleSubmissionRequest,
  EventSubmissionRequest,
  SubmissionResponse,
} from '@signal-fire/api-contracts';

export async function postArticleSubmission(
  req: ArticleSubmissionRequest,
): Promise<SubmissionResponse> {
  return await postSubmission<SubmissionResponse>(req);
}

export async function postEventSubmission(
  req: EventSubmissionRequest,
): Promise<SubmissionResponse> {
  return await postSubmission<SubmissionResponse>(req);
}
