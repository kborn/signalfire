import { describe, expect, it } from 'vitest';

import { buildAdminLoginRedirectPath, parseAdminSessionSetCookie } from './session-cookie';

describe('session-cookie', () => {
  it('builds a login redirect path that preserves the current admin destination', () => {
    expect(buildAdminLoginRedirectPath('/admin/articles/example', '?status=DRAFT')).toBe(
      '/admin/login?next=%2Fadmin%2Farticles%2Fexample%3Fstatus%3DDRAFT',
    );
  });

  it('parses the admin session cookie attributes from a set-cookie header', () => {
    const cookie = parseAdminSessionSetCookie(
      'signal-fire-admin-session=session-token; Path=/; Expires=Wed, 11 Jun 2026 12:00:00 GMT; HttpOnly; SameSite=Lax; Secure',
    );

    expect(cookie).toEqual({
      name: 'signal-fire-admin-session',
      value: 'session-token',
      path: '/',
      expires: new Date('Wed, 11 Jun 2026 12:00:00 GMT'),
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
    });
  });

  it('returns null when the set-cookie header is for a different cookie', () => {
    expect(parseAdminSessionSetCookie('other-cookie=value; Path=/')).toBeNull();
  });
});
