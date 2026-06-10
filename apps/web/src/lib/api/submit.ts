import { postJson } from '@/lib/api/base';
import {
  ArticleSubmissionRequest,
  EventSubmissionRequest,
  SubmissionResponse,
} from '@signal-fire/api-contracts';

export async function postArticleSubmission(
  req: ArticleSubmissionRequest,
): Promise<SubmissionResponse> {
  return await postJson<SubmissionResponse>('submissions', req);
}

export async function postEventSubmission(
  req: EventSubmissionRequest,
): Promise<SubmissionResponse> {
  return await postJson<SubmissionResponse>('submissions', req);
}
