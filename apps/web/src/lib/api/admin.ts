import { patchAuthenticatedJson, postAuthenticatedJson } from '@/lib/api/base';
import {
  AdminActionDetailResponse,
  AdminActionRequest,
  AdminArticleDetailResponse,
  AdminArticleRequest,
  AdminEventDetailResponse,
  AdminEventRequest,
  ModerationReviewRequest,
  type ModerationReviewSuccess,
} from '@signal-fire/api-contracts';

export async function postSubmissionReviewReq(
  req: ModerationReviewRequest,
  id: number,
): Promise<ModerationReviewSuccess> {
  return await postAuthenticatedJson<ModerationReviewSuccess>(
    `admin/submissions/${id}/review`,
    req,
  );
}

export async function createAdminAction(
  payload: AdminActionRequest,
): Promise<AdminActionDetailResponse> {
  return await postAuthenticatedJson<AdminActionDetailResponse>('admin/actions', payload);
}

export async function updateAdminAction(
  slug: string,
  payload: AdminActionRequest,
): Promise<AdminActionDetailResponse> {
  return await patchAuthenticatedJson<AdminActionDetailResponse>(`admin/actions/${slug}`, payload);
}

export async function createAdminArticle(
  payload: AdminArticleRequest,
): Promise<AdminArticleDetailResponse> {
  return await postAuthenticatedJson<AdminArticleDetailResponse>('admin/articles', payload);
}

export async function updateAdminArticle(
  slug: string,
  payload: AdminArticleRequest,
): Promise<AdminArticleDetailResponse> {
  return await patchAuthenticatedJson<AdminArticleDetailResponse>(
    `admin/articles/${slug}`,
    payload,
  );
}

export async function createAdminEvent(
  payload: AdminEventRequest,
): Promise<AdminEventDetailResponse> {
  return await postAuthenticatedJson<AdminEventDetailResponse>('admin/events', payload);
}

export async function updateAdminEvent(
  id: number,
  payload: AdminEventRequest,
): Promise<AdminEventDetailResponse> {
  return await patchAuthenticatedJson<AdminEventDetailResponse>(`admin/events/${id}`, payload);
}
