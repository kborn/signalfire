import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AdminAuthService } from './admin-auth-service';
import { AdminAuthRepository } from './admin-auth.repository';

@Module({
  imports: [PrismaModule],
  providers: [AdminAuthService, AdminAuthRepository],
  exports: [AdminAuthService],
})
export class AdminAuthModule {}
