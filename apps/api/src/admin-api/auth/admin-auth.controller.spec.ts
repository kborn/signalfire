import { Test, TestingModule } from '@nestjs/testing';
import type { AdminSession, AdminUser } from '@prisma/client';
import type { Request, Response } from 'express';

jest.mock('@signal-fire/api-contracts', () => ({
  COOKIE_NAME: 'signal-fire-admin',
}));

import { COOKIE_NAME } from '@signal-fire/api-contracts';

import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';

describe('AdminAuthController', () => {
  let controller: AdminAuthController;

  const serviceMock = {
    login: jest.fn(),
    logout: jest.fn(),
  };

  const session: AdminSession = {
    id: 11,
    sessionToken: 'session-token',
    adminUserId: 7,
    createdAt: new Date('2026-06-01T12:00:00.000Z'),
    lastUsedAt: new Date('2026-06-01T12:00:00.000Z'),
    expiresAt: new Date('2099-06-01T12:00:00.000Z'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminAuthController],
      providers: [{ provide: AdminAuthService, useValue: serviceMock }],
    }).compile();

    controller = module.get(AdminAuthController);
  });

  it('login creates a session cookie and returns ok', async () => {
    serviceMock.login.mockResolvedValue(session);
    const cookie = jest.fn();
    const response = {
      cookie,
    } as unknown as Response;

    await expect(
      controller.login({ email: 'admin@example.com', password: 'password123' }, response),
    ).resolves.toEqual({ ok: true });

    expect(serviceMock.login).toHaveBeenCalledWith('admin@example.com', 'password123');
    expect(cookie).toHaveBeenCalledWith(
      COOKIE_NAME,
      'session-token',
      expect.objectContaining({
        httpOnly: true,
        path: '/',
        expires: session.expiresAt,
      }),
    );
  });

  it('logout clears the cookie and logs out when a session token is present', async () => {
    const request = {
      cookies: {
        [COOKIE_NAME]: 'session-token',
      },
    } as unknown as Request;
    const clearCookie = jest.fn();
    const response = {
      clearCookie,
    } as unknown as Response;

    await expect(controller.logout(request, response)).resolves.toEqual({ ok: true });

    expect(serviceMock.logout).toHaveBeenCalledWith('session-token');
    expect(clearCookie).toHaveBeenCalledWith(
      COOKIE_NAME,
      expect.objectContaining({
        path: '/',
      }),
    );
  });

  it('logout still clears the cookie when no session token is present', async () => {
    const request = {
      cookies: {},
    } as unknown as Request;
    const clearCookie = jest.fn();
    const response = {
      clearCookie,
    } as unknown as Response;

    await expect(controller.logout(request, response)).resolves.toEqual({ ok: true });

    expect(serviceMock.logout).not.toHaveBeenCalled();
    expect(clearCookie).toHaveBeenCalled();
  });

  it('session maps the current admin into the response shape', () => {
    const adminUser: AdminUser = {
      id: 7,
      email: 'admin@example.com',
      passwordHash: 'stored-hash',
      isActive: true,
      createdAt: new Date('2026-06-01T12:00:00.000Z'),
      updatedAt: new Date('2026-06-01T12:00:00.000Z'),
    };

    expect(controller.session(adminUser)).toEqual({
      authenticated: true,
      adminUser: {
        id: 7,
        email: 'admin@example.com',
      },
    });
  });
});
