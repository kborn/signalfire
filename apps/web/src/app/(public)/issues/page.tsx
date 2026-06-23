import { TopicSummary } from '@/components/topic-summary';
import { getTopicsList } from '@/lib/api/topics';
import { JourneyStrip } from '@/components/journey-strip';

export const revalidate = 3600;

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
      <JourneyStrip step={1} />
      <div className="discoveryPageHeader">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/bg-motif.png" alt="" aria-hidden="true" className="discoveryPageHeaderMotif" />
        <p className="section-label">Browse</p>
        <h1 className="pageTitle">Issues</h1>
        <p className="page-intro">
          Some of these issues have been building for decades. Others are moving fast. All of them
          need people willing to focus. Start with the one that already has your attention.
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
