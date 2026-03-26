import Link from 'next/link';
import { getTopicDetails } from '@/lib/api/topics';
export const dynamic = 'force-dynamic';

export default async function TopicDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = await getTopicDetails(slug);
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
