import { getActionsList } from '@/lib/api/actions';
import { ActionSummary } from '@/components/action-summary';

import { getTopicsList } from '@/lib/api/topics';
import { TopicSelector } from '@/components/topic-selector';
export const dynamic = 'force-dynamic';

function getNoResultsResponse(topicSlug?: string) {
  return (
    <section className="page-section">
      <h1 className="pageTitle">Actions</h1>
      <p>{topicSlug ? 'No actions found for this topic yet.' : 'No actions available yet.'}</p>
    </section>
  );
}

type ActionListPageProps = {
  searchParams: Promise<{
    topicSlug?: string;
  }>;
};

export default async function ActionListPage({ searchParams }: ActionListPageProps) {
  const { topicSlug } = await searchParams;
  const [actions, topics] = await Promise.all([getActionsList(topicSlug), getTopicsList()]);

  if (actions.items.length === 0) {
    return getNoResultsResponse(topicSlug);
  }
  return (
    <section className="page-section">
      <h1 className="pageTitle">Actions</h1>
      <p className="page-intro">Find practical ways to take meaningful action</p>
      <TopicSelector topics={topics} basePath="/actions" params={await searchParams} />
      <section className="collectionList">
        {actions.items.map((action) => (
          <ActionSummary key={action.id} action={action} />
        ))}
      </section>
    </section>
  );
}
