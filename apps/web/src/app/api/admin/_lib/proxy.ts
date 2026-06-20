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

export async function proxyAdminDelete(
  request: NextRequest,
  endpoint: string,
): Promise<{ upstream: Response }> {
  const cookieHeader = request.headers.get('cookie');

  const upstream = await fetch(buildUrl(endpoint), {
    method: 'DELETE',
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
    cache: 'no-store',
  });

  return { upstream };
}

export function respondWithUpstreamStatus(upstream: Response): NextResponse {
  return new NextResponse(null, { status: upstream.status });
}
