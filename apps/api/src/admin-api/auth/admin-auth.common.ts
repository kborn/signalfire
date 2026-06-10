import { COOKIE_NAME } from '@signal-fire/admin-auth-shared';
import type { Response } from 'express';

const SESSION_DURATION_MINS = 60 * 12;

export function getNextExpiration(): Date {
  const date = new Date();
  date.setMinutes(date.getMinutes() + SESSION_DURATION_MINS);
  return date;
}

function shouldUseSecureCookie(): boolean {
  // TODO: replace with a more explicit environment/config check
  return false;
}

function buildAdminAuthCookieOptions(expires: Date) {
  return {
    httpOnly: true,
    secure: shouldUseSecureCookie(),
    sameSite: 'lax' as const,
    path: '/',
    expires,
  };
}

function buildAdminAuthClearCookieOptions() {
  return {
    path: '/',
    sameSite: 'lax' as const,
    secure: shouldUseSecureCookie(),
  };
}

export function setAdminAuthCookie(
  response: Response,
  sessionToken: string,
  expiresAt: Date,
): void {
  response.cookie(COOKIE_NAME, sessionToken, buildAdminAuthCookieOptions(expiresAt));
}

export function clearAdminAuthCookie(response: Response): void {
  response.clearCookie(COOKIE_NAME, buildAdminAuthClearCookieOptions());
}
