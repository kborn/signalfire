import { TopicSummary } from '@/components/topic-summary';
import { getTopicsList } from '@/lib/api/topics';

export const revalidate = 60;

function getNoResultsResponse() {
  return (
    <section className="page-section">
      <h1 className="pageTitle">Issues</h1>
      <p>No issues available yet.</p>
    </section>
  );
}

export default async function TopicListPage() {
  const data = await getTopicsList();
  if (data.items.length === 0) {
    return getNoResultsResponse();
  }
  return (
    <section className="page-section discoveryPage">
      <div className="discoveryPageHeader">
        <p className="section-label">Browse</p>
        <h1 className="pageTitle">Issues</h1>
        <p className="page-intro">
          Explore the issues that matter to you and find ways to learn or act.
        </p>
      </div>
      <section className="collectionList">
        {data.items.map((topic) => (
          <TopicSummary key={topic.id} topic={topic} />
        ))}
      </section>
    </section>
  );
}
