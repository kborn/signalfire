import { NextRequest } from 'next/server';
import type { AdminActionDetailResponse } from '@signal-fire/api-contracts';
import { proxyAdminJson, respondWithUpstreamJson } from '@/app/api/admin/_lib/proxy';
import { revalidateActionPages } from '@/app/api/admin/_lib/revalidation';

export async function POST(request: NextRequest) {
  const { data, upstream } = await proxyAdminJson(request, 'admin/actions', 'POST');

  if (upstream.ok) {
    const action = data as AdminActionDetailResponse;
    revalidateActionPages(action.slug, action.topicSlugs);
  }

  return respondWithUpstreamJson(upstream, data);
}
