import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ArticleService } from './article.service';
import { ArticleRepository } from './article.repository';
import { ArticleController } from './article.controller';
import { TopicRepository } from '../topic/topic.repository';
import { ActionRepository } from '../action/action.repository';

@Module({
  imports: [PrismaModule],
  providers: [ArticleService, ArticleRepository, TopicRepository, ActionRepository],
  exports: [ArticleService, ArticleRepository],
  controllers: [ArticleController],
})
export class ArticleModule {}
