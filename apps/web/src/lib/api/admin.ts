import { patchJson, postJson, postSubmissionReview } from '@/lib/api/base';
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
  return await postSubmissionReview<ModerationReviewSuccess>(req, id);
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

export async function createAdminEvent(
  payload: AdminEventRequest,
): Promise<AdminEventDetailResponse> {
  return await postJson<AdminEventDetailResponse>('admin/events', payload);
}

export async function updateAdminEvent(
  id: number,
  payload: AdminEventRequest,
): Promise<AdminEventDetailResponse> {
  return await patchJson<AdminEventDetailResponse>(`admin/events/${id}`, payload);
}
