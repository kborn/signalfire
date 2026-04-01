import Link from 'next/link';

type ArticleSummaryData = {
  slug: string;
  title: string;
  summary: string;
};

export function ArticleSummary({ article }: { article: ArticleSummaryData }) {
  return (
    <article className="collectionItem">
      <h2 className="collectionItemTitle">
        <Link href={`/articles/${article.slug}`}>{article.title}</Link>
      </h2>
      <p className="collectionItemSummary">{article.summary}</p>
    </article>
  );
}
