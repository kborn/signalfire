import Link from 'next/link';
import { getTopicDetails } from '@/lib/api/topics';
import { ApiError } from '@/lib/api/error';
import { notFound } from 'next/navigation';
export const dynamic = 'force-dynamic';

async function fetchTopicDetails(params: Promise<{ slug: string }>) {
  const { slug } = await params;
  try {
    return await getTopicDetails(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}

export default async function TopicDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const topic = await fetchTopicDetails(params);
  return (
    <div className="page-section">
      <section>
        <h1>{topic.name}</h1>
        <p>{topic.description}</p>
      </section>
      <section>
        <h2>Articles</h2>
        {topic.articles.map((article) => (
          <div key={article.id}>
            <Link href={`/articles/${article.slug}`}>{article.title}</Link>
            <p className="summary"> {article.summary}</p>
          </div>
        ))}
      </section>
      <section>
        <h2>Actions</h2>
        {topic.actions.map((action) => (
          <div key={action.id}>
            <Link href={`/actions/${action.slug}`}>{action.title}</Link>
            <p className="summary"> {action.summary}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
