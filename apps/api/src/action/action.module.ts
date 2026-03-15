import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ActionRepository } from './action.repository';
import { ActionService } from './action.service';

@Module({
  imports: [PrismaModule],
  providers: [ActionService, ActionRepository],
  exports: [ActionService],
})
export class ActionModule {}
