import { NextRequest, NextResponse } from 'next/server';
import { buildUrl } from '@/lib/api/base.shared';

export async function POST(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie');

  const upstream = await fetch(buildUrl('admin/auth/logout'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
    body: JSON.stringify({}),
    cache: 'no-store',
  });

  return NextResponse.json({ ok: upstream.ok }, { status: upstream.status });
}
