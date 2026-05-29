import Link from 'next/link';
import type { ActionSummary as ActionSummaryData } from '@signal-fire/api-contracts';
import { formatContentDate } from '@/lib/common/time';
import { formatActionTypeLabel } from '@/lib/common/utils';

type ActionSummaryVariant = 'collection' | 'related';

type ActionSummaryProps = {
  action: ActionSummaryData;
  variant?: ActionSummaryVariant;
};

export function ActionSummary({ action, variant = 'collection' }: ActionSummaryProps) {
  const itemClassName = variant === 'related' ? 'relatedListItem' : 'collectionItem';
  const titleClassName = variant === 'related' ? 'relatedListItemTitle' : 'collectionItemTitle';
  const summaryClassName =
    variant === 'related' ? 'relatedListItemSummary' : 'collectionItemSummary';
  const TitleTag = variant === 'related' ? 'h4' : 'h2';
  const publishedAt = formatContentDate(action.publishedAt);
  const actionType = formatActionTypeLabel(action.actionType);

  return (
    <article className={itemClassName}>
      <TitleTag className={titleClassName}>
        <Link href={`/actions/${action.slug}`}>{action.title}</Link>
      </TitleTag>
      <p className="summaryMeta">{[actionType, publishedAt].filter(Boolean).join(' · ')}</p>
      <p className={summaryClassName}>{action.summary}</p>
    </article>
  );
}
