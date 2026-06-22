import { connection } from 'next/server';
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
  await connection();
  const data = await getTopicsList();
  if (data.items.length === 0) {
    return getNoResultsResponse();
  }
  return (
    <section className="page-section discoveryPage">
      <div className="discoveryPageHeader">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/bg-motif.png" alt="" aria-hidden="true" className="discoveryPageHeaderMotif" />
        <p className="section-label">Browse</p>
        <h1 className="pageTitle">Issues</h1>
        <p className="page-intro">
          Some of these issues have been building for decades. Others are moving fast. All of them
          need people willing to focus.
        </p>
      </div>
      <section className="topicsGrid">
        {data.items.map((topic) => (
          <TopicSummary key={topic.id} topic={topic} />
        ))}
      </section>
    </section>
  );
}
