import { NextRequest, NextResponse } from 'next/server';
import { buildUrl } from '@/lib/api/base.shared';
import { parseAdminSessionSetCookie } from '@/lib/admin/session-cookie';

export async function POST(request: NextRequest) {
  const payload = await request.json();

  const upstream = await fetch(buildUrl('admin/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  const body = await upstream.json().catch(() => null);
  const response = NextResponse.json(body, { status: upstream.status });

  if (upstream.ok) {
    const cookie = parseAdminSessionSetCookie(upstream.headers.get('set-cookie'));
    if (cookie) {
      response.cookies.set(cookie);
    }
  }

  return response;
}
