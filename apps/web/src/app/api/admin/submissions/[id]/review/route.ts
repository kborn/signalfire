import { NextRequest } from 'next/server';
import type { ModerationReviewSuccess } from '@signal-fire/api-contracts';
import { proxyAdminJson, respondWithUpstreamJson } from '@/app/api/admin/_lib/proxy';
import { revalidateModerationOutcome } from '@/app/api/admin/_lib/revalidation';

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { data, upstream } = await proxyAdminJson(
    request,
    `admin/submissions/${id}/review`,
    'POST',
  );

  if (upstream.ok) {
    revalidateModerationOutcome(data as ModerationReviewSuccess);
  }

  return respondWithUpstreamJson(upstream, data);
}
