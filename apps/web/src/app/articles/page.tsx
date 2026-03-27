import { getArticlesList } from '@/lib/api/articles';
import { ArticleSummary } from '@/components/article-summary';
export const dynamic = 'force-dynamic';

function getNoResultsResponse() {
  return (
    <section className="page-section">
      <h1>Articles</h1>
      <p>No articles available yet.</p>
    </section>
  );
}

export default async function ArticleListPage() {
  const resp = await getArticlesList();
  if (resp.items.length === 0) {
    return getNoResultsResponse();
  }
  return (
    <section className="page-section">
      <h1>Articles</h1>
      <p>Read and understand the issues that matter</p>
      {resp.items.map((article) => (
        <ArticleSummary key={article.id} article={article} />
      ))}
    </section>
  );
}
