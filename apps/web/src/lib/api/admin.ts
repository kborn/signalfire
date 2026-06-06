import { makeRequest, patchJson, postJson, postSubmissionReview } from '@/lib/api/base';
import {
  AdminActionDetailResponse,
  AdminActionListFilters,
  AdminActionListResponse,
  AdminActionRequest,
  AdminArticleDetailResponse,
  AdminArticleListFilters,
  AdminArticleListResponse,
  AdminArticleRequest,
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

export async function getAdminArticlesList(
  filters?: AdminArticleListFilters,
): Promise<AdminArticleListResponse> {
  return await makeRequest<AdminArticleListResponse>('admin/articles', filters);
}

export async function getAdminArticleDetails(slug: string): Promise<AdminArticleDetailResponse> {
  return await makeRequest<AdminArticleDetailResponse>(`admin/articles/${slug}`);
}

export async function createAdminArticle(
  payload: AdminArticleRequest,
): Promise<AdminArticleDetailResponse> {
  return await postJson<AdminArticleDetailResponse>('admin/articles', payload);
}

export async function updateAdminArticle(
  slug: string,
  payload: AdminArticleRequest,
): Promise<AdminArticleDetailResponse> {
  return await patchJson<AdminArticleDetailResponse>(`admin/articles/${slug}`, payload);
}
