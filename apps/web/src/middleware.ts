import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAME } from '@signal-fire/admin-auth-shared';
import { buildUrl } from '@/lib/api/base.shared';
import {
  buildAdminLoginRedirectPath,
  parseAdminSessionSetCookie,
} from '@/lib/admin/session-cookie';

function isAdminLoginPath(pathname: string): boolean {
  return pathname === '/admin/login';
}

function clearAdminSessionCookie(response: NextResponse): void {
  response.cookies.set({
    name: COOKIE_NAME,
    value: '',
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    expires: new Date(0),
  });
}

async function validateAdminSession(request: NextRequest): Promise<Response> {
  const cookieHeader = request.headers.get('cookie');

  return fetch(buildUrl('admin/auth/session'), {
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
    cache: 'no-store',
  });
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (isAdminLoginPath(pathname)) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(COOKIE_NAME);
  if (!sessionCookie) {
    return NextResponse.redirect(
      new URL(buildAdminLoginRedirectPath(pathname, search), request.url),
    );
  }

  const authResponse = await validateAdminSession(request);

  if (authResponse.status === 401) {
    const redirectResponse = NextResponse.redirect(
      new URL(buildAdminLoginRedirectPath(pathname, search), request.url),
    );
    clearAdminSessionCookie(redirectResponse);
    return redirectResponse;
  }

  if (!authResponse.ok) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  const refreshedCookie = parseAdminSessionSetCookie(authResponse.headers.get('set-cookie'));

  if (refreshedCookie) {
    response.cookies.set(refreshedCookie);
  }

  return response;
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
