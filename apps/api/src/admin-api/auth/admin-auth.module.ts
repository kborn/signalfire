import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AdminAuthService } from './admin-auth.service';
import { AdminAuthRepository } from './admin-auth.repository';
import { AdminAuthGuard } from './admin-auth.guard';
import { AdminActionController } from './admin-auth.controller';

@Module({
  imports: [PrismaModule],
  providers: [AdminAuthGuard, AdminAuthService, AdminAuthRepository],
  exports: [AdminAuthGuard, AdminAuthService],
  controllers: [AdminActionController],
})
export class AdminAuthModule {}
