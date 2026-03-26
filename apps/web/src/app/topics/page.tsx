import Link from 'next/link';
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
      <p>Browse civic issues and discover related articles and actions</p>
      {data.items.map((topic) => (
        <div key={topic.id}>
          <h2>
            <Link href={`/topics/${topic.slug}`}>{topic.name}</Link>
          </h2>
          <p>{topic.description}</p>
        </div>
      ))}
    </section>
  );
}
