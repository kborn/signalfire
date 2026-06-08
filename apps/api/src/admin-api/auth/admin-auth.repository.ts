import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminSession, AdminUser } from '@prisma/client';
import { CreateAdminSessionInput, UpdateAdminSessionInput } from './admin-auth.repository.type';

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

  getAdminUserByEmail(email: string): Promise<AdminUser | null> {
    return this.prisma.adminUser.findUnique({
      where: {
        email: email,
      },
    });
  }

  updateSession(input: UpdateAdminSessionInput): Promise<AdminSession> {
    return this.prisma.adminSession.update({
      where: {
        sessionToken: input.sessionToken,
      },
      data: {
        expiresAt: input.expiresAt,
        lastUsedAt: input.lastUsedAt ? input.lastUsedAt : undefined,
      },
    });
  }

  async logOutAllUserSessions(input: UpdateAdminSessionInput): Promise<void> {
    const session = await this.prisma.adminSession.findUnique({
      where: { sessionToken: input.sessionToken },
      select: { adminUserId: true },
    });

    if (!session) {
      return;
    }

    await this.prisma.adminSession.updateMany({
      where: {
        adminUserId: session.adminUserId,
        expiresAt: {
          gt: new Date(),
        },
      },
      data: {
        expiresAt: input.expiresAt,
      },
    });

    return;
  }

  createSession(input: CreateAdminSessionInput): Promise<AdminSession> {
    return this.prisma.adminSession.create({
      data: {
        sessionToken: input.sessionToken,
        adminUserId: input.adminUserId,
        createdAt: input.createdAt,
        expiresAt: input.expiresAt,
      },
    });
  }
}
