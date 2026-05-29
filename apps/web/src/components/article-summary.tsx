import Link from 'next/link';
import type { ArticleSummary as ArticleSummaryData } from '@signal-fire/api-contracts';
import { formatContentDate } from '@/lib/common/time';

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
  const publishedAt = formatContentDate(article.publishedAt);

  return (
    <article className={itemClassName}>
      <TitleTag className={titleClassName}>
        <Link href={`/articles/${article.slug}`}>{article.title}</Link>
      </TitleTag>
      {publishedAt && <p className="summaryMeta">Published {publishedAt}</p>}
      <p className={summaryClassName}>{article.summary}</p>
    </article>
  );
}
