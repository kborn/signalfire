import { Body, Controller, Post, Res } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { type AdminLoginRequest, COOKIE_NAME } from '@signal-fire/api-contracts';
import express from 'express';

@Controller('admin/auth')
export class AdminActionController {
  constructor(private readonly service: AdminAuthService) {}
  @Post('/login')
  async create(
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
}
