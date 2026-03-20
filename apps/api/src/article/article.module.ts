import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ArticleService } from './article.service';
import { ArticleRepository } from './article.repository';
import { ArticleController } from './article.controller';

@Module({
  imports: [PrismaModule],
  providers: [ArticleService, ArticleRepository],
  exports: [ArticleService],
  controllers: [ArticleController],
})
export class ArticleModule {}
