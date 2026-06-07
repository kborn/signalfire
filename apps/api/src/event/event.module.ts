import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { EventService } from './event.service';
import { EventRepository } from './event.repository';
import { TopicModule } from '../topic/topic.module';
import { ActionModule } from '../action/action.module';
import { ArticleModule } from '../article/article.module';
import { EventController } from './event.controller';
@Module({
  imports: [PrismaModule, TopicModule, ActionModule, ArticleModule],
  providers: [EventService, EventRepository],
  exports: [EventService, EventRepository],
  controllers: [EventController],
})
export class EventModule {}
