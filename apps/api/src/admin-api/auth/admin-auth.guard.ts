import { AdminAuthService } from './admin-auth.service';
import { AdminAuthenticatedRequest } from './admin-auth.request';
import { COOKIE_NAME } from '@signal-fire/api-contracts';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminSession } from '@prisma/client';
import type { Response } from 'express';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private adminAuthService: AdminAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AdminAuthenticatedRequest>();
    const session = await this.validateRequest(request);
    const response = context.switchToHttp().getResponse<Response>();
    response.cookie(COOKIE_NAME, session.sessionToken, {
      httpOnly: true,
      // TODO: make dynamic based on environment
      secure: false,
      sameSite: 'lax',
      path: '/',
      expires: session.expiresAt,
    });
    return true;
  }

  async validateRequest(req: AdminAuthenticatedRequest): Promise<AdminSession> {
    const sessionToken: unknown = req.cookies[COOKIE_NAME];
    if (typeof sessionToken !== 'string' || sessionToken.length === 0) {
      throw new UnauthorizedException('Authentication required');
    }
    const user = await this.adminAuthService.isAuthorized(sessionToken);
    req.adminUser = user;
    return await this.adminAuthService.reAuthorize(sessionToken);
  }
}
