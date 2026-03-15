import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TopicService } from './topic.service';
import { TopicRepository } from './topic.repository';

@Module({
  imports: [PrismaModule],
  providers: [TopicService, TopicRepository],
  exports: [TopicService],
})
export class TopicModule {}
