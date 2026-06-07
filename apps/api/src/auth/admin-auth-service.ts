import { AdminAuthRepository } from './admin-auth.repository';
import { AdminSession, AdminUser } from '@prisma/client';
import { Injectable, UnauthorizedException } from '@nestjs/common';

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

  async reAuthorize(sessionToken: string, nextExpiredAt: Date): Promise<AdminSession> {
    return await this.adminAuthRepository.updateSession(sessionToken, nextExpiredAt);
  }
}
