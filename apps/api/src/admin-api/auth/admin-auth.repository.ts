import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminSession, AdminUser } from '@prisma/client';

@Injectable()
export class AdminAuthRepository {
  constructor(private prisma: PrismaService) {}

  getAdminSession(sessionToken: string): Promise<AdminSession | null> {
    return this.prisma.adminSession.findUnique({
      where: {
        sessionToken: sessionToken,
      },
    });
  }

  getAdminUser(userId: number): Promise<AdminUser | null> {
    return this.prisma.adminUser.findUnique({
      where: {
        id: userId,
      },
    });
  }

  updateSession(sessionToken: string, nextExpiredAt: Date): Promise<AdminSession> {
    return this.prisma.adminSession.update({
      where: {
        sessionToken: sessionToken,
      },
      data: {
        expiresAt: nextExpiredAt,
      },
    });
  }
}
