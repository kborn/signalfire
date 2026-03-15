import { Injectable } from '@nestjs/common';
import { ActionRepository } from './action.repository';
import { Action } from '@prisma/client';

@Injectable()
export class ActionService {
  constructor(private repository: ActionRepository) {}

  getActionDetail(slug: string): Promise<Action | null> {
    return this.repository.findBySlug(slug);
  }

  getPublishedActionDetail(slug: string): Promise<Action | null> {
    return this.repository.findPublishedBySlug(slug);
  }

  getActionsForTopic(topicSlug: string): Promise<Action[]> {
    return this.repository.findPublishedByTopicSlug(topicSlug);
  }

  getActionsForArticle(articleId: number): Promise<Action[]> {
    return this.repository.findPublishedByArticleId(articleId);
  }
}
