import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminSession, AdminUser } from '@prisma/client';
import { CreateAdminSessionInput, ReauthrorizeSessionInput } from './admin-auth.repository.type';

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

  updateSession(input: ReauthrorizeSessionInput): Promise<AdminSession> {
    return this.prisma.adminSession.update({
      where: {
        sessionToken: input.sessionToken,
      },
      data: {
        expiresAt: input.expiresAt,
        lastUsedAt: input.lastUsedAt,
      },
    });
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
