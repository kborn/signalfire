import { Module } from '@nestjs/common';
import { ActionRepository } from '../action/action.repository';
import { ArticleRepository } from '../article/article.repository';
import { EventRepository } from '../event/event.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { SubmissionRepository } from '../submission/submission.repository';
import { SubmissionValidationPipe } from '../submission/submission-validation.pipe';
import { TopicRepository } from '../topic/topic.repository';
import { AdminActionController } from './action/admin-action.controller';
import { AdminActionService } from './action/admin-action.service';
import { AdminArticleController } from './article/admin-article.controller';
import { AdminArticleService } from './article/admin-article.service';
import { AdminAuthModule } from './auth/admin-auth.module';
import { AdminEventController } from './event/admin-event.controller';
import { AdminEventService } from './event/admin-event.service';
import { ModerationSubmissionController } from './moderation/moderation-submission.controller';
import { ModerationSubmissionService } from './moderation/moderation-submission.service';
import { AdminTopicController } from './topic/admin-topic.controller';
import { AdminTopicService } from './topic/admin-topic.service';

@Module({
  imports: [PrismaModule, AdminAuthModule],
  providers: [
    AdminActionService,
    AdminArticleService,
    AdminEventService,
    AdminTopicService,
    ModerationSubmissionService,
    SubmissionValidationPipe,
    ActionRepository,
    ArticleRepository,
    EventRepository,
    SubmissionRepository,
    TopicRepository,
  ],
  controllers: [
    AdminActionController,
    AdminArticleController,
    AdminEventController,
    AdminTopicController,
    ModerationSubmissionController,
  ],
  exports: [ModerationSubmissionService],
})
export class AdminApiModule {}
