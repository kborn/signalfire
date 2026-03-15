import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { TopicModule } from './topic/topic.module';
import { ArticleModule } from './article/article.module';
import { ActionModule } from './action/action.module';
import { EventModule } from './event/event.module';
import { SubmissionModule } from './submission/submission.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    HealthModule,
    TopicModule,
    ArticleModule,
    ActionModule,
    EventModule,
    SubmissionModule,
  ],
})
export class AppModule {}
