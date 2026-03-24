import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ActionRepository } from './action.repository';
import { ActionService } from './action.service';
import { ActionController } from './action.controller';
import { TopicRepository } from '../topic/topic.repository';
import { ArticleRepository } from '../article/article.repository';

@Module({
  imports: [PrismaModule],
  providers: [ActionService, ActionRepository, TopicRepository, ArticleRepository],
  exports: [ActionService],
  controllers: [ActionController],
})
export class ActionModule {}
