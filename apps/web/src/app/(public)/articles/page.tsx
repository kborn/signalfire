import { getArticlesList } from '@/lib/api/articles';
import { ArticleSummary } from '@/components/article-summary';
import { getTopicsList } from '@/lib/api/topics';
import { TopicSelector } from '@/components/topic-selector';
import { Pagination } from '@/components/pagination';
import { PageSizeSelector } from '@/components/page-size-selector';
import Link from 'next/link';
import { JourneyStrip } from '@/components/journey-strip';

export const revalidate = 3600;

function getNoResultsResponse(topicSlug?: string) {
  return (
    <section className="discoveryEmptyState">
      <p className="section-label">No articles yet</p>
      <h2>
        {topicSlug ? 'No published articles match this issue yet.' : 'No articles available yet.'}
      </h2>
      <p className="metaText">
        Nothing here for that issue yet. Try another, or look for direct action while this one fills
        in.
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
    search?: string;
    page?: string;
    pageSize?: string;
  }>;
};

export default async function ArticleListPage({ searchParams }: ArticleListPageProps) {
  const params = await searchParams;
  const { topicSlug, search, page, pageSize } = params;
  const [resp, topics] = await Promise.all([
    getArticlesList({ topicSlug, search, page, pageSize }),
    getTopicsList(),
  ]);

  return (
    <section className="page-section discoveryPage">
      <JourneyStrip step={2} />
      <div className="discoveryPageHeader">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/bg-motif.png" alt="" aria-hidden="true" className="discoveryPageHeaderMotif" />
        <p className="section-label">Browse</p>
        <h1 className="pageTitle">Articles</h1>
        <p className="page-intro">
          Reading changes what you see. These articles give you something to work with.
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
