import type { Response } from 'express';

import { COOKIE_NAME } from '@signal-fire/admin-auth-shared';

import { clearAdminAuthCookie, setAdminAuthCookie } from './admin-auth.common';

describe('admin-auth.common', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('uses secure cookies in production', () => {
    process.env.NODE_ENV = 'production';
    const cookie = jest.fn();
    const response = { cookie } as unknown as Response;

    setAdminAuthCookie(response, 'session-token', new Date('2099-06-01T12:00:00.000Z'));

    expect(cookie).toHaveBeenCalledWith(
      COOKIE_NAME,
      'session-token',
      expect.objectContaining({ secure: true }),
    );
  });

  it('omits secure cookies in non-production environments', () => {
    process.env.NODE_ENV = 'development';
    const clearCookie = jest.fn();
    const response = { clearCookie } as unknown as Response;

    clearAdminAuthCookie(response);

    expect(clearCookie).toHaveBeenCalledWith(
      COOKIE_NAME,
      expect.objectContaining({ secure: false }),
    );
  });
});
