import { postSubmission } from '@/lib/api/base';
import { ArticleSubmissionRequest, SubmissionResponse } from '@signal-fire/api-contracts';

export async function postArticleSubmission(
  req: ArticleSubmissionRequest,
): Promise<SubmissionResponse> {
  return await postSubmission<SubmissionResponse>(req);
}
