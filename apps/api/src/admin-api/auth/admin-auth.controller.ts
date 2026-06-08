import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import {
  type AdminLoginRequest,
  type AdminSessionResponse,
  COOKIE_NAME,
} from '@signal-fire/api-contracts';
import type { Request, Response } from 'express';
import { clearAdminAuthCookie, setAdminAuthCookie } from './admin-auth.common';
import { AdminAuthGuard } from './admin-auth.guard';
import { CurrentAdmin } from './current-admin.decorator';
import type { AdminUser } from '@prisma/client';

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

  @Get('/session')
  @UseGuards(AdminAuthGuard)
  session(@CurrentAdmin() adminUser: AdminUser): AdminSessionResponse {
    return {
      authenticated: true,
      adminUser: {
        id: adminUser.id,
        email: adminUser.email,
      },
    };
  }
}
