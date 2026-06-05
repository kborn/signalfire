import { makeRequest, patchJson, postJson, postSubmissionReview } from '@/lib/api/base';
import {
  AdminActionDetailResponse,
  AdminActionListFilters,
  AdminActionListResponse,
  AdminActionRequest,
  ModerationSubmissionListFilters,
  ModerationSubmissionList,
  ModerationSubmissionDetail,
  ModerationReviewRequest,
  type ModerationReviewSuccess,
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
  id: number,
): Promise<ModerationReviewSuccess> {
  return await postSubmissionReview<ModerationReviewSuccess>(req, id);
}

export async function getAdminActionsList(
  filters?: AdminActionListFilters,
): Promise<AdminActionListResponse> {
  return await makeRequest<AdminActionListResponse>('admin/actions', filters);
}

export async function getAdminActionDetails(slug: string): Promise<AdminActionDetailResponse> {
  return await makeRequest<AdminActionDetailResponse>(`admin/actions/${slug}`);
}

export async function createAdminAction(
  payload: AdminActionRequest,
): Promise<AdminActionDetailResponse> {
  return await postJson<AdminActionDetailResponse>('admin/actions', payload);
}

export async function updateAdminAction(
  slug: string,
  payload: AdminActionRequest,
): Promise<AdminActionDetailResponse> {
  return await patchJson<AdminActionDetailResponse>(`admin/actions/${slug}`, payload);
}
