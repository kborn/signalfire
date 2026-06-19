export type AdminTopicRequest = {
  name: string;
  description: string;
};

export type AdminTopicSummary = {
  id: number;
  slug: string;
  name: string;
  description: string;
  articleCount: number;
  actionCount: number;
  eventCount: number;
};

export type AdminTopicDetailResponse = AdminTopicSummary;

export type AdminTopicListResponse = {
  items: AdminTopicSummary[];
};
