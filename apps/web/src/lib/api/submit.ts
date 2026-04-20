import { post } from '@/lib/api/base';
import { ArticleSubmissionRequest, SubmissionResponse } from '@signal-fire/api-contracts';

export async function postArticleSubmission(
  req: ArticleSubmissionRequest,
): Promise<SubmissionResponse> {
  return await post<SubmissionResponse>(req);
}

// export async function postEventSubmission(slug: string): Promise<SubmissionResponse> {
//   return await post<SubmissionResponse>(`topics/${slug}`);
// }
