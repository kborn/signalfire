import { getActionsList } from '@/lib/api/actions';
import { ActionSummary } from '@/components/action-summary';

import { getTopicsList } from '@/lib/api/topics';
import { TopicSelector } from '@/components/topic-selector';
import { PageSizeSelector } from '@/components/page-size-selector';
import { Pagination } from '@/components/pagination';
import Link from 'next/link';
export const dynamic = 'force-dynamic';

function getNoResultsResponse(topicSlug?: string) {
  return (
    <section className="discoveryEmptyState">
      <p className="section-label">No actions yet</p>
      <h2>{topicSlug ? 'No actions match this issue yet.' : 'No actions available yet.'}</h2>
      <p className="metaText">
        Try another issue, read related articles first, or check back after more action guides are
        published.
      </p>
      <div className="ctaRow">
        <Link href="/articles" className="secondaryCTA">
          Browse Articles
        </Link>
      </div>
    </section>
  );
}

function getEmptyPageResponse() {
  return (
    <section className="discoveryEmptyState">
      <p className="section-label">No results on this page</p>
      <h2>These filters still have actions available.</h2>
      <p className="metaText">Try a previous page or change the issue filter.</p>
    </section>
  );
}

type ActionListPageProps = {
  searchParams: Promise<{
    topicSlug?: string;
    page?: string;
    pageSize?: string;
  }>;
};

export default async function ActionListPage({ searchParams }: ActionListPageProps) {
  const params = await searchParams;
  const { topicSlug, page, pageSize } = params;
  const [resp, topics] = await Promise.all([
    getActionsList({ topicSlug, page, pageSize }),
    getTopicsList(),
  ]);

  return (
    <section className="page-section discoveryPage">
      <div className="discoveryPageHeader">
        <p className="section-label">Browse</p>
        <h1 className="pageTitle">Actions</h1>
        <p className="page-intro">Find practical ways to take meaningful action</p>
      </div>
      <TopicSelector topics={topics} basePath="/actions" params={params} />

      <section className="collectionList">
        {resp.items.length === 0
          ? resp.totalItems === 0
            ? getNoResultsResponse(topicSlug)
            : getEmptyPageResponse()
          : resp.items.map((action) => <ActionSummary key={action.id} action={action} />)}
      </section>
      <div className="paginationToolbar">
        <PageSizeSelector basePath="/actions" params={params} />
        <Pagination
          basePath="/actions"
          page={resp.page}
          totalPages={resp.totalPages}
          params={params}
        />
      </div>
    </section>
  );
}
