ALTER TABLE "_article"
ADD CONSTRAINT article_published_status_published_at_required
CHECK (
  -- publishedAt needs to be set when status is PUBLISHED but null otherwise
  ("status" != 'PUBLISHED' AND "publishedAt" IS  NULL)
  OR
  ("status" = 'PUBLISHED' AND "publishedAt" IS NOT NULL)
);

ALTER TABLE "_action"
ADD CONSTRAINT action_published_status_published_at_required
CHECK (

  -- publishedAt needs to be set when status is PUBLISHED but null otherwise
  ("status" != 'PUBLISHED' AND "publishedAt" IS  NULL)
  OR
  ("status" = 'PUBLISHED' AND "publishedAt" IS NOT NULL)
);


ALTER TABLE "_event"
ADD CONSTRAINT event_published_status_published_at_required
CHECK (
  -- publishedAt needs to be set when status is PUBLISHED but null otherwise
  ("status" != 'PUBLISHED' AND "publishedAt" IS  NULL)
  OR
  ("status" = 'PUBLISHED' AND "publishedAt" IS NOT NULL)
);