export type ActionType = 'GUIDE' | 'LINK' | 'CONTACT' | 'DONATE' | 'VOLUNTEER';

export type EventType = 'PROTEST' | 'RALLY' | 'VOLUNTEER' | 'TOWN_HALL' | 'WORKSHOP' | 'MEETING';

export type ActionSummary = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  actionType: ActionType;
  publishedAt: string;
};

export type TopicSummary = {
  id: number;
  slug: string;
  name: string;
  description: string;
};

export type ArticleSummary = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
};

export type EventSummary = {
  id: number;
  title: string;
  summary: string;
  eventType: EventType;
  startTime: string;
  endTime: string | null;
  city: string | null;
  region: string | null;
  postalCode: string | null;
  country: string | null;
};
