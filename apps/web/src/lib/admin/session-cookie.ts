import { COOKIE_NAME } from '@signal-fire/admin-auth-shared';

export type ParsedAdminSessionCookie = {
  name: string;
  value: string;
  expires?: Date;
  path: string;
  httpOnly: boolean;
  sameSite: 'lax' | 'strict' | 'none';
  secure: boolean;
};

export function buildAdminLoginRedirectPath(pathname: string, search: string): string {
  const next = `${pathname}${search}`;
  return `/admin/login?next=${encodeURIComponent(next)}`;
}

export function parseAdminSessionSetCookie(
  setCookieHeader: string | null,
): ParsedAdminSessionCookie | null {
  if (!setCookieHeader) {
    return null;
  }

  const segments = setCookieHeader.split(';').map((segment) => segment.trim());
  const [cookieSegment, ...attributeSegments] = segments;

  if (!cookieSegment?.startsWith(`${COOKIE_NAME}=`)) {
    return null;
  }

  const value = cookieSegment.slice(`${COOKIE_NAME}=`.length);
  const parsedCookie: ParsedAdminSessionCookie = {
    name: COOKIE_NAME,
    value,
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
    secure: false,
  };

  for (const attribute of attributeSegments) {
    const [rawKey, rawValue] = attribute.split('=');
    const key = rawKey.toLowerCase();

    if (key === 'expires' && rawValue) {
      parsedCookie.expires = new Date(rawValue);
      continue;
    }

    if (key === 'path' && rawValue) {
      parsedCookie.path = rawValue;
      continue;
    }

    if (key === 'samesite' && rawValue) {
      const sameSiteValue = rawValue.toLowerCase();
      if (sameSiteValue === 'lax' || sameSiteValue === 'strict' || sameSiteValue === 'none') {
        parsedCookie.sameSite = sameSiteValue;
      }
      continue;
    }

    if (key === 'httponly') {
      parsedCookie.httpOnly = true;
      continue;
    }

    if (key === 'secure') {
      parsedCookie.secure = true;
    }
  }

  return parsedCookie;
}
