import { makeRequest, postSubmissionReview } from '@/lib/api/base';
import {
  ModerationSubmissionListFilters,
  ModerationSubmissionList,
  ModerationSubmissionDetail,
  ModerationReviewRequest,
  ModerationReviewResponse,
} from '@signal-fire/api-contracts';

export async function getSubmissionsList(
  filters?: ModerationSubmissionListFilters,
): Promise<ModerationSubmissionList> {
  return await makeRequest<ModerationSubmissionList>('admin/submissions', filters);
}

export async function getSubmissionsDetails(id: number): Promise<ModerationSubmissionDetail> {
  return await makeRequest<ModerationSubmissionDetail>(`admin/submissions/${id}`);
}

export async function postSubmissionReviewReq(
  req: ModerationReviewRequest,
  id,
): Promise<ModerationReviewResponse> {
  return await postSubmissionReview<ModerationReviewResponse>(req, id);
}
