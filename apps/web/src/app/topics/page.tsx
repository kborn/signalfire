import { TopicSummary } from '@/components/topic-summary';
import { getTopicsList } from '@/lib/api/topics';
export const dynamic = 'force-dynamic';

function getNoResultsResponse() {
  return (
    <section className="page-section">
      <h1>Topics</h1>
      <p>No topics available yet.</p>
    </section>
  );
}

export default async function TopicListPage() {
  const data = await getTopicsList();
  if (data.items.length === 0) {
    return getNoResultsResponse();
  }
  return (
    <section className="page-section">
      <h1>Topics</h1>
      <p className="page-intro">Browse civic issues and discover related articles and actions</p>
      <section className="collectionList">
        {data.items.map((topic) => (
          <TopicSummary key={topic.id} topic={topic} />
        ))}
      </section>
    </section>
  );
}
