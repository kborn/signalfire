import Link from 'next/link';

type ActionSummaryData = {
  slug: string;
  title: string;
  summary: string;
};

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
  return (
    <article className={itemClassName}>
      <TitleTag className={titleClassName}>
        <Link href={`/actions/${action.slug}`}>{action.title}</Link>
      </TitleTag>
      <p className={summaryClassName}>{action.summary}</p>
    </article>
  );
}
