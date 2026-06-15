import { getActionsList } from '@/lib/api/actions';
import { ActionSummary } from '@/components/action-summary';

import { getTopicsList } from '@/lib/api/topics';
import { TopicSelector } from '@/components/topic-selector';
import { PageSizeSelector } from '@/components/page-size-selector';
import { Pagination } from '@/components/pagination';
export const dynamic = 'force-dynamic';

function getNoResultsResponse(topicSlug?: string) {
  return <p>{topicSlug ? 'No actions found for this topic yet.' : 'No actions available yet.'}</p>;
}

function getEmptyPageResponse() {
  return <p>No actions on this page. Try a previous page or change the filters.</p>;
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
    <section className="page-section">
      <h1 className="pageTitle">Actions</h1>
      <p className="page-intro">Find practical ways to take meaningful action</p>
      <TopicSelector topics={topics} basePath="/actions" params={await searchParams} />

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
