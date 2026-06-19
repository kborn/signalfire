import { NextRequest } from 'next/server';
import type { AdminEventDetailResponse } from '@signal-fire/api-contracts';
import { proxyAdminJson, respondWithUpstreamJson } from '@/app/api/admin/_lib/proxy';
import { revalidateEventPages } from '@/app/api/admin/_lib/revalidation';

export async function POST(request: NextRequest) {
  const { data, upstream } = await proxyAdminJson(request, 'admin/events', 'POST');

  if (upstream.ok) {
    const event = data as AdminEventDetailResponse;
    revalidateEventPages(event.id, event.status);
  }

  return respondWithUpstreamJson(upstream, data);
}
