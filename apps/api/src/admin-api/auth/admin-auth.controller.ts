import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { type AdminLoginRequest, COOKIE_NAME } from '@signal-fire/api-contracts';
import express from 'express';

@Controller('admin/auth')
export class AdminActionController {
  constructor(private readonly service: AdminAuthService) {}

  @Post('/login')
  async login(
    @Body() reqBody: AdminLoginRequest,
    @Res({ passthrough: true }) res: express.Response,
  ): Promise<{ ok: boolean }> {
    const session = await this.service.login(reqBody.email, reqBody.password);
    res.cookie(COOKIE_NAME, session.sessionToken, {
      httpOnly: true,
      // TODO: make dynamic based on environment
      secure: false,
      sameSite: 'lax',
      path: '/',
      expires: session.expiresAt,
    });
    return { ok: true };
  }

  @Post('/logout')
  async logout(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response,
  ): Promise<{ ok: boolean }> {
    const sessionToken: unknown = req.cookies[COOKIE_NAME];
    if (typeof sessionToken === 'string' && sessionToken.length > 0) {
      await this.service.logout(sessionToken);
    }

    res.clearCookie(COOKIE_NAME, {
      path: '/',
      sameSite: 'lax',
      // TODO: make dynamic based on environment
      secure: false,
    });
    return { ok: true };
  }
}
