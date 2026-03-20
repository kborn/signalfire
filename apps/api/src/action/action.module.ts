import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ActionRepository } from './action.repository';
import { ActionService } from './action.service';
import { ActionController } from './action.controller';

@Module({
  imports: [PrismaModule],
  providers: [ActionService, ActionRepository],
  exports: [ActionService],
  controllers: [ActionController],
})
export class ActionModule {}
