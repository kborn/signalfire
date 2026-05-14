import { makeRequest } from '@/lib/api/base';
import {
  ModerationSubmissionListFilters,
  ModerationSubmissionList,
} from '@signal-fire/api-contracts';

export async function getSubmissionsList(
  filters?: ModerationSubmissionListFilters,
): Promise<ModerationSubmissionList> {
  return await makeRequest<ModerationSubmissionList>('admin/submissions', filters);
}

// export async function getActionDetails(slug: string): Promise<ActionDetailResponse> {
//   return await makeRequest<ActionDetailResponse>(`actions/${slug}`);
// }
