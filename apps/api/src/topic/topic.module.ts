import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TopicService } from './topic.service';
import { TopicRepository } from './topic.repository';
import { TopicController } from './topic.controller';
import { ArticleModule } from '../article/article.module';
import { ActionModule } from '../action/action.module';
@Module({
  imports: [PrismaModule, ArticleModule, ActionModule],
  providers: [TopicService, TopicRepository],
  exports: [TopicService, TopicRepository],
  controllers: [TopicController],
})
export class TopicModule {}
