import { getArticlesList } from '@/lib/api/articles';
import { ArticleSummary } from '@/components/article-summary';
import { getTopicsList } from '@/lib/api/topics';
import { TopicSelector } from '@/components/topic-selector';
import { Pagination } from '@/components/pagination';
import { PageSizeSelector } from '@/components/page-size-selector';
import Link from 'next/link';
export const dynamic = 'force-dynamic';

function getNoResultsResponse(topicSlug?: string) {
  return (
    <section className="discoveryEmptyState">
      <p className="section-label">No articles yet</p>
      <h2>
        {topicSlug ? 'No published articles match this issue yet.' : 'No articles available yet.'}
      </h2>
      <p className="metaText">
        Try a different issue, browse actions, or check back after more explainers are published.
      </p>
      <div className="ctaRow">
        <Link href="/actions" className="secondaryCTA">
          Browse Actions
        </Link>
      </div>
    </section>
  );
}

function getEmptyPageResponse() {
  return (
    <section className="discoveryEmptyState">
      <p className="section-label">No results on this page</p>
      <h2>These filters have results, just not here.</h2>
      <p className="metaText">Try a previous page or change the issue filter.</p>
    </section>
  );
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
    <section className="page-section discoveryPage">
      <div className="discoveryPageHeader">
        <p className="section-label">Browse</p>
        <h1 className="pageTitle">Articles</h1>
        <p className="page-intro">
          Read reporting, explainers, and field guides about the issues that matter
        </p>
      </div>
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
