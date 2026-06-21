export type EventSearchParams = {
  topicSlug?: string;
  startDate?: string;
  endDate?: string;
  city?: string;
  region?: string;
  page?: string;
  pageSize?: string;
};

export type ResolvedEventSearchParams = EventSearchParams & {
  startDate: string;
  endDate: string;
};
