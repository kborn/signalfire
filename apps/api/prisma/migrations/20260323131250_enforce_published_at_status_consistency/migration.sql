ALTER TABLE "article"
ADD CONSTRAINT article_published_status_published_at_required
CHECK (
  -- published_at needs to be set when status is PUBLISHED but null otherwise
  ("status" != 'PUBLISHED' AND "published_at" IS  NULL)
  OR
  ("status" = 'PUBLISHED' AND "published_at" IS NOT NULL)
);

ALTER TABLE "action"
ADD CONSTRAINT action_published_status_published_at_required
CHECK (
  -- published_at needs to be set when status is PUBLISHED but null otherwise
  ("status" != 'PUBLISHED' AND "published_at" IS  NULL)
  OR
  ("status" = 'PUBLISHED' AND "published_at" IS NOT NULL)
);


ALTER TABLE "event"
ADD CONSTRAINT event_published_status_published_at_required
CHECK (
  -- published_at needs to be set when status is PUBLISHED but null otherwise
  ("status" != 'PUBLISHED' AND "published_at" IS  NULL)
  OR
  ("status" = 'PUBLISHED' AND "published_at" IS NOT NULL)
);
