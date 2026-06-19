import { revalidatePath } from 'next/cache';
import type { EntityStatus, ModerationReviewSuccess } from '@signal-fire/api-contracts';

function revalidateTopicPages(topicSlugs: string[]) {
  for (const topicSlug of topicSlugs) {
    revalidatePath(`/topics/${topicSlug}`);
  }
}

export function revalidateArticlePages(slug: string, topicSlugs: string[]) {
  revalidatePath('/articles');
  revalidatePath(`/articles/${slug}`);
  revalidateTopicPages(topicSlugs);
}

export function revalidateActionPages(slug: string, topicSlugs: string[]) {
  revalidatePath('/actions');
  revalidatePath(`/actions/${slug}`);
  revalidateTopicPages(topicSlugs);
}

export function revalidateEventPages(id: number, publishStatus: EntityStatus) {
  revalidatePath('/events');

  if (publishStatus === 'PUBLISHED') {
    revalidatePath(`/events/${id}`);
  }
}

export function revalidateModerationOutcome(result: ModerationReviewSuccess) {
  revalidatePath('/admin/submissions');
  revalidatePath(`/admin/submissions/${result.submissionId}`);

  if (result.status !== 'APPROVED' || !result.createdRecord) {
    return;
  }

  if (result.createdRecord.recordType === 'ARTICLE' && result.createdRecord.slug) {
    revalidatePath('/articles');
    revalidatePath(`/articles/${result.createdRecord.slug}`);
    return;
  }

  if (result.createdRecord.recordType === 'EVENT' && result.createdRecord.id != null) {
    revalidateEventPages(result.createdRecord.id, result.createdRecord.publishStatus);
  }
}
