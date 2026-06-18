import { NextRequest, NextResponse } from 'next/server';
import { buildUrl } from '@/lib/api/base.shared';

async function readResponseBody(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function proxyAdminJson(
  request: NextRequest,
  endpoint: string,
  method: 'POST' | 'PATCH',
): Promise<{ data: unknown; upstream: Response }> {
  const payload = await request.json();
  const cookieHeader = request.headers.get('cookie');

  const upstream = await fetch(buildUrl(endpoint), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
    cache: 'no-store',
    body: JSON.stringify(payload),
  });

  const data = await readResponseBody(upstream);
  return { data, upstream };
}

export function respondWithUpstreamJson(upstream: Response, data: unknown): NextResponse {
  return NextResponse.json(data, { status: upstream.status });
}
