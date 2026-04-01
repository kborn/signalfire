import Link from 'next/link';

type ArticleSummaryData = {
  slug: string;
  title: string;
  summary: string;
};

type ArticleSummaryVariant = 'collection' | 'related';

type ArticleSummaryProps = {
  article: ArticleSummaryData;
  variant?: ArticleSummaryVariant;
};

export function ArticleSummary({ article, variant = 'collection' }: ArticleSummaryProps) {
  const itemClassName = variant === 'related' ? 'relatedListItem' : 'collectionItem';
  const titleClassName = variant === 'related' ? 'relatedListItemTitle' : 'collectionItemTitle';
  const summaryClassName =
    variant === 'related' ? 'relatedListItemSummary' : 'collectionItemSummary';
  const TitleTag = variant === 'related' ? 'h4' : 'h2';

  return (
    <article className={itemClassName}>
      <TitleTag className={titleClassName}>
        <Link href={`/articles/${article.slug}`}>{article.title}</Link>
      </TitleTag>
      <p className={summaryClassName}>{article.summary}</p>
    </article>
  );
}
