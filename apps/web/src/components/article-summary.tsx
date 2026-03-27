import Link from 'next/link';

type ArticleSummaryData = {
  slug: string;
  title: string;
  summary: string;
};

export function ArticleSummary({ article }: { article: ArticleSummaryData }) {
  return (
    <article>
      <h3>
        <Link href={`/articles/${article.slug}`}>{article.title}</Link>
      </h3>
      <p className="summary">{article.summary}</p>
    </article>
  );
}
