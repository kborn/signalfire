import { NextRequest } from 'next/server';
import type { AdminActionDetailResponse } from '@signal-fire/api-contracts';
import { proxyAdminJson, respondWithUpstreamJson } from '@/app/api/admin/_lib/proxy';
import { revalidateActionPages } from '@/app/api/admin/_lib/revalidation';

export async function PATCH(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const { data, upstream } = await proxyAdminJson(request, `admin/actions/${slug}`, 'PATCH');

  if (upstream.ok) {
    const action = data as AdminActionDetailResponse;
    revalidateActionPages(action.slug, action.topicSlugs);
  }

  return respondWithUpstreamJson(upstream, data);
}
