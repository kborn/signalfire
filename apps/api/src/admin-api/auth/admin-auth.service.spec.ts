import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { AdminSession, AdminUser } from '@prisma/client';
import bcrypt from 'bcryptjs';

import { AdminAuthRepository } from './admin-auth.repository';
import { AdminAuthService } from './admin-auth.service';

describe('AdminAuthService', () => {
  let service: AdminAuthService;

  const repoMock = {
    getAdminSession: jest.fn(),
    getAdminUser: jest.fn(),
    getAdminUserByEmail: jest.fn(),
    updateSession: jest.fn(),
    createSession: jest.fn(),
    logOutAllUserSessions: jest.fn(),
  };

  const activeUser: AdminUser = {
    id: 7,
    email: 'admin@example.com',
    passwordHash: 'stored-hash',
    isActive: true,
    createdAt: new Date('2026-06-01T12:00:00.000Z'),
    updatedAt: new Date('2026-06-01T12:00:00.000Z'),
  };

  const activeSession: AdminSession = {
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
      providers: [AdminAuthService, { provide: AdminAuthRepository, useValue: repoMock }],
    }).compile();

    service = module.get(AdminAuthService);
  });

  it('isAuthorized returns the active admin user for a valid session', async () => {
    repoMock.getAdminSession.mockResolvedValue(activeSession);
    repoMock.getAdminUser.mockResolvedValue(activeUser);

    await expect(service.isAuthorized('session-token')).resolves.toEqual(activeUser);
    expect(repoMock.getAdminSession).toHaveBeenCalledWith('session-token');
    expect(repoMock.getAdminUser).toHaveBeenCalledWith(7);
  });

  it('isAuthorized rejects when the session is missing', async () => {
    repoMock.getAdminSession.mockResolvedValue(null);

    await expect(service.isAuthorized('missing')).rejects.toThrow(UnauthorizedException);
    expect(repoMock.getAdminUser).not.toHaveBeenCalled();
  });

  it('isAuthorized rejects when the session is expired', async () => {
    repoMock.getAdminSession.mockResolvedValue({
      ...activeSession,
      expiresAt: new Date('2000-01-01T00:00:00.000Z'),
    });

    await expect(service.isAuthorized('session-token')).rejects.toThrow(UnauthorizedException);
    expect(repoMock.getAdminUser).not.toHaveBeenCalled();
  });

  it('isAuthorized rejects when the admin user is inactive', async () => {
    repoMock.getAdminSession.mockResolvedValue(activeSession);
    repoMock.getAdminUser.mockResolvedValue({
      ...activeUser,
      isActive: false,
    });

    await expect(service.isAuthorized('session-token')).rejects.toThrow(UnauthorizedException);
  });

  it('reAuthorize refreshes expiry and last-used timestamps', async () => {
    repoMock.updateSession.mockResolvedValue(activeSession);

    await expect(service.reAuthorize('session-token')).resolves.toEqual(activeSession);
    expect(repoMock.updateSession).toHaveBeenCalledWith(expect.any(Object));
    const updateSessionMock = repoMock.updateSession as jest.MockedFunction<
      (input: { sessionToken: string; expiresAt: Date; lastUsedAt?: Date }) => Promise<AdminSession>
    >;
    const reauthorizeInput = updateSessionMock.mock.calls[0][0];
    expect(reauthorizeInput).toBeDefined();
    const typedReauthorizeInput = reauthorizeInput as {
      sessionToken: string;
      expiresAt: Date;
      lastUsedAt?: Date;
    };
    expect(typedReauthorizeInput.sessionToken).toBe('session-token');
    expect(typedReauthorizeInput.expiresAt).toBeInstanceOf(Date);
    expect(typedReauthorizeInput.lastUsedAt).toBeInstanceOf(Date);
  });

  it('login creates a session for valid credentials', async () => {
    repoMock.getAdminUserByEmail.mockResolvedValue(activeUser);
    repoMock.createSession.mockResolvedValue(activeSession);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

    await expect(service.login('admin@example.com', 'FindYourFight1')).resolves.toEqual(
      activeSession,
    );

    expect(repoMock.createSession).toHaveBeenCalledWith(expect.any(Object));
    const createSessionMock = repoMock.createSession as jest.MockedFunction<
      (input: {
        adminUserId: number;
        sessionToken: string;
        expiresAt: Date;
        createdAt: Date;
      }) => Promise<AdminSession>
    >;
    const createSessionInput = createSessionMock.mock.calls[0][0];
    expect(createSessionInput).toBeDefined();
    const typedCreateSessionInput = createSessionInput as {
      adminUserId: number;
      sessionToken: string;
      expiresAt: Date;
      createdAt: Date;
    };
    expect(typedCreateSessionInput.adminUserId).toBe(7);
    expect(typedCreateSessionInput.sessionToken).toEqual(expect.any(String));
    expect(typedCreateSessionInput.expiresAt).toBeInstanceOf(Date);
    expect(typedCreateSessionInput.createdAt).toBeInstanceOf(Date);
  });

  it('login rejects when the email is unknown', async () => {
    repoMock.getAdminUserByEmail.mockResolvedValue(null);

    await expect(service.login('missing@example.com', 'FindYourFight1')).rejects.toThrow(
      UnauthorizedException,
    );
    expect(repoMock.createSession).not.toHaveBeenCalled();
  });

  it('login rejects when the password is invalid', async () => {
    repoMock.getAdminUserByEmail.mockResolvedValue(activeUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

    await expect(service.login('admin@example.com', 'wrong-password')).rejects.toThrow(
      UnauthorizedException,
    );
    expect(repoMock.createSession).not.toHaveBeenCalled();
  });

  it('logout expires all active sessions for the current admin user', async () => {
    repoMock.logOutAllUserSessions.mockResolvedValue(undefined);

    await expect(service.logout('session-token')).resolves.toBeUndefined();
    expect(repoMock.logOutAllUserSessions).toHaveBeenCalledWith(expect.any(Object));
    const logoutAllSessionsMock = repoMock.logOutAllUserSessions as jest.MockedFunction<
      (input: { sessionToken: string; expiresAt: Date }) => Promise<void>
    >;
    const logoutInput = logoutAllSessionsMock.mock.calls[0][0];
    expect(logoutInput).toBeDefined();
    const typedLogoutInput = logoutInput as {
      sessionToken: string;
      expiresAt: Date;
    };
    expect(typedLogoutInput.sessionToken).toBe('session-token');
    expect(typedLogoutInput.expiresAt).toBeInstanceOf(Date);
  });
});
