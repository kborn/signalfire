import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { EventService } from './event.service';
import { EventRepository } from './event.repository';
import { TopicModule } from '../topic/topic.module';
import { TopicRepository } from '../topic/topic.repository';
import { ActionModule } from '../action/action.module';
import { ActionRepository } from '../action/action.repository';
import { ArticleModule } from '../article/article.module';
import { ArticleRepository } from '../article/article.repository';
@Module({
  imports: [PrismaModule, TopicModule, ActionModule, ArticleModule],
  providers: [EventService, EventRepository, TopicRepository, ArticleRepository, ActionRepository],
  exports: [EventService],
})
export class EventModule {}
