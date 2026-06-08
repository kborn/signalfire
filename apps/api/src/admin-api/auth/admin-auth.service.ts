import { AdminAuthRepository } from './admin-auth.repository';
import { AdminSession, AdminUser } from '@prisma/client';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import * as crypto from 'node:crypto';
import { getNextExpiration } from './admin-auth.common';

@Injectable()
export class AdminAuthService {
  constructor(private adminAuthRepository: AdminAuthRepository) {}

  async isAuthorized(sessionToken: string): Promise<AdminUser> {
    const session = await this.adminAuthRepository.getAdminSession(sessionToken);
    if (!session) {
      throw new UnauthorizedException(`Authentication required`);
    }
    if (session.expiresAt < new Date()) {
      throw new UnauthorizedException(`Authentication required`);
    }
    const user = await this.adminAuthRepository.getAdminUser(session.adminUserId);
    if (!user) {
      throw new UnauthorizedException(`Authentication required`);
    }
    if (!user.isActive) {
      throw new UnauthorizedException(`Authentication required`);
    }
    return user;
  }

  async reAuthorize(sessionToken: string): Promise<AdminSession> {
    const updateSessionInput = {
      sessionToken: sessionToken,
      expiresAt: getNextExpiration(),
      lastUsedAt: new Date(),
    };
    return await this.adminAuthRepository.updateSession(updateSessionInput);
  }

  async login(email: string, password: string): Promise<AdminSession> {
    const user = await this.adminAuthRepository.getAdminUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Authentication required');
    }

    if (!(await this.validatePassword(password, user.passwordHash))) {
      throw new UnauthorizedException('Authentication required');
    }

    const createSessionInput = {
      sessionToken: crypto.randomUUID(),
      adminUserId: user.id,
      expiresAt: getNextExpiration(),
      createdAt: new Date(),
    };

    return await this.adminAuthRepository.createSession(createSessionInput);
  }

  async logout(sessionToken: string): Promise<void> {
    const updateSessionInput = {
      sessionToken: sessionToken,
      expiresAt: new Date(),
    };

    return await this.adminAuthRepository.logOutAllUserSessions(updateSessionInput);
  }

  private async validatePassword(plainPassword: string, storedHash: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, storedHash);
  }
}
