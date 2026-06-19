import { NextRequest } from 'next/server';
import type { AdminTopicDetailResponse } from '@signal-fire/api-contracts';
import {
  proxyAdminJson,
  proxyAdminDelete,
  respondWithUpstreamJson,
  respondWithUpstreamStatus,
} from '@/app/api/admin/_lib/proxy';
import { revalidateTopicAdminPages } from '@/app/api/admin/_lib/revalidation';

export async function PATCH(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const { data, upstream } = await proxyAdminJson(request, `admin/topics/${slug}`, 'PATCH');

  if (upstream.ok) {
    const topic = data as AdminTopicDetailResponse;
    revalidateTopicAdminPages(topic.slug);
  }

  return respondWithUpstreamJson(upstream, data);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const { upstream } = await proxyAdminDelete(request, `admin/topics/${slug}`);

  if (upstream.ok) {
    revalidateTopicAdminPages(slug);
  }

  return respondWithUpstreamStatus(upstream);
}
