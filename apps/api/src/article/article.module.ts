import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ArticleService } from './article.service';
import { ArticleRepository } from './article.repository';

@Module({
  imports: [PrismaModule],
  providers: [ArticleService, ArticleRepository],
  exports: [ArticleService],
})
export class ArticleModule {}
