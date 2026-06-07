import { AdminAuthService } from './admin-auth.service';
import { AdminAuthenticatedRequest } from './admin-auth.request';
import { COOKIE_NAME } from '@signal-fire/api-contracts';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

const SESSION_DURATION_MINS = 60 * 24;
@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private adminAuthService: AdminAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AdminAuthenticatedRequest>();
    return this.validateRequest(request);
  }

  private getNextExpiration(): Date {
    const date = new Date();
    date.setMinutes(date.getMinutes() + SESSION_DURATION_MINS);
    return date;
  }

  async validateRequest(req: AdminAuthenticatedRequest): Promise<boolean> {
    const sessionToken: unknown = req.cookies[COOKIE_NAME];
    if (typeof sessionToken !== 'string' || sessionToken.length === 0) {
      throw new UnauthorizedException('Authentication required');
    }
    const user = await this.adminAuthService.isAuthorized(sessionToken);
    req.adminUser = user;
    const nextExpiredAt = this.getNextExpiration();
    await this.adminAuthService.reAuthorize(sessionToken, nextExpiredAt);
    return true;
  }
}
