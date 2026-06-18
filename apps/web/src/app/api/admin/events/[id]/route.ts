import { NextRequest } from 'next/server';
import type { AdminEventDetailResponse } from '@signal-fire/api-contracts';
import { proxyAdminJson, respondWithUpstreamJson } from '@/app/api/admin/_lib/proxy';
import { revalidateEventPages } from '@/app/api/admin/_lib/revalidation';

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { data, upstream } = await proxyAdminJson(request, `admin/events/${id}`, 'PATCH');

  if (upstream.ok) {
    const event = data as AdminEventDetailResponse;
    revalidateEventPages(event.id, event.status);
  }

  return respondWithUpstreamJson(upstream, data);
}
