import { Injectable } from '@nestjs/common';
import { EventRepository } from './event.repository';
import { Event } from '@prisma/client';

@Injectable()
export class EventService {
  constructor(private repository: EventRepository) {}

  getEventDetail(id: number): Promise<Event | null> {
    return this.repository.getById(id);
  }

  getPublishedEventDetail(id: number): Promise<Event | null> {
    return this.repository.getPublishedById(id);
  }

  getEventsByArticle(articleId: number): Promise<Event[]> {
    return this.repository.findByArticleId(articleId);
  }

  getEventsByAction(actionId: number): Promise<Event[]> {
    return this.repository.findByActionId(actionId);
  }
}
