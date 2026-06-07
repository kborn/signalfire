import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AdminAuthService } from './admin-auth.service';
import { AdminAuthRepository } from './admin-auth.repository';
import { AdminAuthGuard } from './admin-auth.guard';

@Module({
  imports: [PrismaModule],
  providers: [AdminAuthGuard, AdminAuthService, AdminAuthRepository],
  exports: [AdminAuthGuard, AdminAuthService],
})
export class AdminAuthModule {}
