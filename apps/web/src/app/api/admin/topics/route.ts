import { NextRequest } from 'next/server';
import type { AdminTopicDetailResponse } from '@signal-fire/api-contracts';
import { proxyAdminJson, respondWithUpstreamJson } from '@/app/api/admin/_lib/proxy';
import { revalidateTopicAdminPages } from '@/app/api/admin/_lib/revalidation';

export async function POST(request: NextRequest) {
  const { data, upstream } = await proxyAdminJson(request, 'admin/topics', 'POST');

  if (upstream.ok) {
    const topic = data as AdminTopicDetailResponse;
    revalidateTopicAdminPages(topic.slug);
  }

  return respondWithUpstreamJson(upstream, data);
}
