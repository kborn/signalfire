import { getArticlesList } from '@/lib/api/articles';
import { ArticleSummary } from '@/components/article-summary';
import { getTopicsList } from '@/lib/api/topics';
import { TopicSelector } from '@/components/topic-selector';
import { Pagination } from '@/components/pagination';
import { PageSizeSelector } from '@/components/page-size-selector';
export const dynamic = 'force-dynamic';

function getNoResultsResponse(topicSlug?: string) {
  return (
    <p>{topicSlug ? 'No articles found for this topic yet.' : 'No articles available yet.'}</p>
  );
}

function getEmptyPageResponse() {
  return <p>No articles on this page. Try a previous page or change the filters.</p>;
}

type ArticleListPageProps = {
  searchParams: Promise<{
    topicSlug?: string;
    page?: string;
    pageSize?: string;
  }>;
};

export default async function ArticleListPage({ searchParams }: ArticleListPageProps) {
  const params = await searchParams;
  const { topicSlug, page, pageSize } = params;
  const [resp, topics] = await Promise.all([
    getArticlesList({ topicSlug, page, pageSize }),
    getTopicsList(),
  ]);

  return (
    <section className="page-section">
      <h1 className="pageTitle">Articles</h1>
      <p className="page-intro">
        Read reporting, explainers, and field guides about the issues that matter
      </p>
      <TopicSelector topics={topics} basePath="/articles" params={params} />
      <section className="collectionList">
        {resp.items.length === 0
          ? resp.totalItems === 0
            ? getNoResultsResponse(topicSlug)
            : getEmptyPageResponse()
          : resp.items.map((article) => <ArticleSummary key={article.id} article={article} />)}
      </section>
      <div className="paginationToolbar">
        <PageSizeSelector basePath="/articles" params={params} />
        <Pagination
          basePath="/articles"
          page={resp.page}
          totalPages={resp.totalPages}
          params={params}
        />
      </div>
    </section>
  );
}
