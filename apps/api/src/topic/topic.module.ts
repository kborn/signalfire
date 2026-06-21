import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TopicService } from './topic.service';
import { TopicRepository } from './topic.repository';
import { TopicController } from './topic.controller';

@Module({
  imports: [PrismaModule],
  providers: [TopicService, TopicRepository],
  exports: [TopicService, TopicRepository],
  controllers: [TopicController],
})
export class TopicModule {}
