import Link from 'next/link';
import type { TopicSummary as TopicSummaryData } from '@signal-fire/api-contracts';

type TopicSummaryVariant = 'collection' | 'related';

type TopicSummaryProps = {
  topic: TopicSummaryData;
  variant?: TopicSummaryVariant;
};

export function TopicSummary({ topic, variant = 'collection' }: TopicSummaryProps) {
  const itemClassName = variant === 'related' ? 'relatedListItem' : 'collectionItem';
  const titleClassName = variant === 'related' ? 'relatedListItemTitle' : 'collectionItemTitle';
  const summaryClassName =
    variant === 'related' ? 'relatedListItemSummary' : 'collectionItemSummary';
  const TitleTag = variant === 'related' ? 'h4' : 'h2';
  return (
    <Link href={`/topics/${topic.slug}`} className={itemClassName}>
      <TitleTag className={titleClassName}>{topic.name}</TitleTag>
      <p className={summaryClassName}>{topic.description}</p>
    </Link>
  );
}
