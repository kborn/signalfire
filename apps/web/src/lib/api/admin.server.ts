import 'server-only';

import { makeServerAdminRequest } from '@/lib/api/base.server';
import {
  AdminActionDetailResponse,
  AdminActionListFilters,
  AdminActionListResponse,
  AdminArticleDetailResponse,
  AdminArticleListFilters,
  AdminArticleListResponse,
  AdminEventDetailResponse,
  AdminEventListFilters,
  AdminEventListResponse,
  AdminTopicDetailResponse,
  AdminTopicListResponse,
  ModerationSubmissionDetail,
  ModerationSubmissionList,
  ModerationSubmissionListFilters,
} from '@signal-fire/api-contracts';

export async function getSubmissionsList(
  filters?: ModerationSubmissionListFilters,
): Promise<ModerationSubmissionList> {
  return await makeServerAdminRequest<ModerationSubmissionList>('admin/submissions', filters);
}

export async function getSubmissionsDetails(id: number): Promise<ModerationSubmissionDetail> {
  return await makeServerAdminRequest<ModerationSubmissionDetail>(`admin/submissions/${id}`);
}

export async function getAdminActionsList(
  filters?: AdminActionListFilters,
): Promise<AdminActionListResponse> {
  return await makeServerAdminRequest<AdminActionListResponse>('admin/actions', filters);
}

export async function getAdminActionDetails(slug: string): Promise<AdminActionDetailResponse> {
  return await makeServerAdminRequest<AdminActionDetailResponse>(`admin/actions/${slug}`);
}

export async function getAdminArticlesList(
  filters?: AdminArticleListFilters,
): Promise<AdminArticleListResponse> {
  return await makeServerAdminRequest<AdminArticleListResponse>('admin/articles', filters);
}

export async function getAdminArticleDetails(slug: string): Promise<AdminArticleDetailResponse> {
  return await makeServerAdminRequest<AdminArticleDetailResponse>(`admin/articles/${slug}`);
}

export async function getAdminEventsList(
  filters?: AdminEventListFilters,
): Promise<AdminEventListResponse> {
  return await makeServerAdminRequest<AdminEventListResponse>('admin/events', filters);
}

export async function getAdminEventDetails(id: number): Promise<AdminEventDetailResponse> {
  return await makeServerAdminRequest<AdminEventDetailResponse>(`admin/events/${id}`);
}

export async function getAdminTopicsList(): Promise<AdminTopicListResponse> {
  return await makeServerAdminRequest<AdminTopicListResponse>('admin/topics');
}

export async function getAdminTopicDetail(slug: string): Promise<AdminTopicDetailResponse> {
  return await makeServerAdminRequest<AdminTopicDetailResponse>(`admin/topics/${slug}`);
}
