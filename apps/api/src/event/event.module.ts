import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { EventService } from './event.service';
import { EventRepository } from './event.repository';

@Module({
  imports: [PrismaModule],
  providers: [EventService, EventRepository],
  exports: [EventService],
})
export class EventModule {}
