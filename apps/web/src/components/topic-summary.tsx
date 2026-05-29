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
    <article className={itemClassName}>
      <TitleTag className={titleClassName}>
        <Link href={`/topics/${topic.slug}`}>{topic.name}</Link>
      </TitleTag>
      <p className={summaryClassName}>{topic.description}</p>
    </article>
  );
}
