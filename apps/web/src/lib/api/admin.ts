import { deleteAuthenticated, patchAuthenticatedJson, postAuthenticatedJson } from '@/lib/api/base';
import {
  AdminActionDetailResponse,
  AdminActionRequest,
  AdminArticleDetailResponse,
  AdminArticleRequest,
  AdminEventDetailResponse,
  AdminEventRequest,
  AdminTopicDetailResponse,
  AdminTopicRequest,
  ModerationReviewRequest,
  type ModerationReviewSuccess,
} from '@signal-fire/api-contracts';

export async function postSubmissionReviewReq(
  req: ModerationReviewRequest,
  id: number,
): Promise<ModerationReviewSuccess> {
  return await postAuthenticatedJson<ModerationReviewSuccess>(
    `/api/admin/submissions/${id}/review`,
    req,
  );
}

export async function createAdminAction(
  payload: AdminActionRequest,
): Promise<AdminActionDetailResponse> {
  return await postAuthenticatedJson<AdminActionDetailResponse>('/api/admin/actions', payload);
}

export async function updateAdminAction(
  slug: string,
  payload: AdminActionRequest,
): Promise<AdminActionDetailResponse> {
  return await patchAuthenticatedJson<AdminActionDetailResponse>(
    `/api/admin/actions/${slug}`,
    payload,
  );
}

export async function createAdminArticle(
  payload: AdminArticleRequest,
): Promise<AdminArticleDetailResponse> {
  return await postAuthenticatedJson<AdminArticleDetailResponse>('/api/admin/articles', payload);
}

export async function updateAdminArticle(
  slug: string,
  payload: AdminArticleRequest,
): Promise<AdminArticleDetailResponse> {
  return await patchAuthenticatedJson<AdminArticleDetailResponse>(
    `/api/admin/articles/${slug}`,
    payload,
  );
}

export async function createAdminEvent(
  payload: AdminEventRequest,
): Promise<AdminEventDetailResponse> {
  return await postAuthenticatedJson<AdminEventDetailResponse>('/api/admin/events', payload);
}

export async function updateAdminEvent(
  id: number,
  payload: AdminEventRequest,
): Promise<AdminEventDetailResponse> {
  return await patchAuthenticatedJson<AdminEventDetailResponse>(`/api/admin/events/${id}`, payload);
}

export async function createAdminTopic(
  payload: AdminTopicRequest,
): Promise<AdminTopicDetailResponse> {
  return await postAuthenticatedJson<AdminTopicDetailResponse>('/api/admin/topics', payload);
}

export async function updateAdminTopic(
  slug: string,
  payload: AdminTopicRequest,
): Promise<AdminTopicDetailResponse> {
  return await patchAuthenticatedJson<AdminTopicDetailResponse>(
    `/api/admin/topics/${slug}`,
    payload,
  );
}

export async function deleteAdminTopic(slug: string): Promise<void> {
  return await deleteAuthenticated(`/api/admin/topics/${slug}`);
}
