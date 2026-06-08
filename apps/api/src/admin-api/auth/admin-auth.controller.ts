import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { type AdminLoginRequest, COOKIE_NAME } from '@signal-fire/api-contracts';
import type { Request, Response } from 'express';
import { clearAdminAuthCookie, setAdminAuthCookie } from './admin-auth.common';

@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly service: AdminAuthService) {}

  @Post('/login')
  async login(
    @Body() reqBody: AdminLoginRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ ok: boolean }> {
    const session = await this.service.login(reqBody.email, reqBody.password);
    setAdminAuthCookie(res, session.sessionToken, session.expiresAt);
    return { ok: true };
  }

  @Post('/logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ ok: boolean }> {
    const sessionToken: unknown = req.cookies[COOKIE_NAME];
    if (typeof sessionToken === 'string' && sessionToken.length > 0) {
      await this.service.logout(sessionToken);
    }

    clearAdminAuthCookie(res);
    return { ok: true };
  }
}
