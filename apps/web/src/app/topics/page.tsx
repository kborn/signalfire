import Link from 'next/link';
import { getTopicsList } from '@/lib/api/topics';
import { ApiError } from '@/lib/api/error';
import { notFound } from 'next/navigation';
export const dynamic = 'force-dynamic';

async function fetchTopicsList() {
  try {
    return await getTopicsList();
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}

export default async function TopicListPage() {
  const data = await fetchTopicsList();
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
