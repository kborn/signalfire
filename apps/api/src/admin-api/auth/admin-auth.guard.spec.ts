import { UnauthorizedException } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import type { AdminSession, AdminUser } from '@prisma/client';
import type { Response } from 'express';

import { COOKIE_NAME } from '@signal-fire/admin-auth-shared';

import { AdminAuthGuard } from './admin-auth.guard';
import type { AdminAuthenticatedRequest } from './admin-auth.request';
import { AdminAuthService } from './admin-auth.service';

describe('AdminAuthGuard', () => {
  const serviceMock = {
    isAuthorized: jest.fn(),
    reAuthorize: jest.fn(),
  };

  const guard = new AdminAuthGuard(serviceMock as unknown as AdminAuthService);

  const adminUser: AdminUser = {
    id: 7,
    email: 'admin@example.com',
    passwordHash: 'stored-hash',
    isActive: true,
    createdAt: new Date('2026-06-01T12:00:00.000Z'),
    updatedAt: new Date('2026-06-01T12:00:00.000Z'),
  };

  const session: AdminSession = {
    id: 11,
    sessionToken: 'session-token',
    adminUserId: 7,
    createdAt: new Date('2026-06-01T12:00:00.000Z'),
    lastUsedAt: new Date('2026-06-01T12:00:00.000Z'),
    expiresAt: new Date('2099-06-01T12:00:00.000Z'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  function buildContext(
    request: Partial<AdminAuthenticatedRequest>,
    response: Partial<Response>,
  ): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => response,
      }),
    } as ExecutionContext;
  }

  it('rejects requests with no session cookie', async () => {
    const request = {
      cookies: {},
    } as Partial<AdminAuthenticatedRequest>;
    const response = {
      cookie: jest.fn(),
    } as Partial<Response>;

    await expect(guard.canActivate(buildContext(request, response))).rejects.toThrow(
      UnauthorizedException,
    );
    expect(serviceMock.isAuthorized).not.toHaveBeenCalled();
  });

  it('authorizes valid requests, refreshes the session, and resets the cookie', async () => {
    serviceMock.isAuthorized.mockResolvedValue(adminUser);
    serviceMock.reAuthorize.mockResolvedValue(session);

    const request = {
      cookies: {
        [COOKIE_NAME]: 'session-token',
      },
    } as Partial<AdminAuthenticatedRequest>;
    const response = {
      cookie: jest.fn(),
    } as Partial<Response>;

    await expect(guard.canActivate(buildContext(request, response))).resolves.toBe(true);

    expect(serviceMock.isAuthorized).toHaveBeenCalledWith('session-token');
    expect(serviceMock.reAuthorize).toHaveBeenCalledWith('session-token');
    expect((request as AdminAuthenticatedRequest).adminUser).toEqual(adminUser);
    expect(response.cookie).toHaveBeenCalledWith(
      COOKIE_NAME,
      'session-token',
      expect.objectContaining({
        httpOnly: true,
        path: '/',
        expires: session.expiresAt,
      }),
    );
  });
});
