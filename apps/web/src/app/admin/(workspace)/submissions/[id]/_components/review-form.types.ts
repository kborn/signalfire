export type ReviewFormErrors = {
  form?: string;

  title?: string;
  summary?: string;
  content?: string;
  author?: string;
  topicSlugs?: string;

  description?: string;
  eventType?: string;
  startTime?: string;
  endTime?: string;
  locationName?: string;
  publicLocationDescription?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  region?: string;
  country?: string;
  postalCode?: string;
  website?: string;
  contactEmail?: string;

  reviewNotes?: string;
};
