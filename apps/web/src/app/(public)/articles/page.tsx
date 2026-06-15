import { getArticlesList } from '@/lib/api/articles';
import { ArticleSummary } from '@/components/article-summary';
import { getTopicsList } from '@/lib/api/topics';
import { TopicSelector } from '@/components/topic-selector';
export const dynamic = 'force-dynamic';

function getNoResultsResponse(topicSlug?: string) {
  return (
    <section className="page-section">
      <h1 className="pageTitle">Articles</h1>
      <p>{topicSlug ? 'No articles found for this topic yet.' : 'No articles available yet.'}</p>
    </section>
  );
}

type ArticleListPageProps = {
  searchParams: Promise<{
    topicSlug?: string;
  }>;
};

export default async function ArticleListPage({ searchParams }: ArticleListPageProps) {
  const { topicSlug } = await searchParams;
  const [resp, topics] = await Promise.all([getArticlesList(topicSlug), getTopicsList()]);
  if (resp.items.length === 0) {
    return getNoResultsResponse(topicSlug);
  }
  return (
    <section className="page-section">
      <h1 className="pageTitle">Articles</h1>
      <p className="page-intro">
        Read reporting, explainers, and field guides about the issues that matter
      </p>
      <TopicSelector topics={topics} basePath="/articles" params={await searchParams} />
      <section className="collectionList">
        {resp.items.map((article) => (
          <ArticleSummary key={article.id} article={article} />
        ))}
      </section>
    </section>
  );
}
