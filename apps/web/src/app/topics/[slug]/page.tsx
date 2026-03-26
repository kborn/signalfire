import Link from 'next/link';
import { getTopicDetails } from '@/lib/api/topics';

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
          <Link key={article.id} href={`/articles/${article.slug}`}>
            {article.title}
          </Link>
        ))}
      </section>
      <section>
        <h2>Actions</h2>
        {topic.actions.map((action) => (
          <Link key={action.id} href={`/actions/${action.slug}`}>
            {action.title}
          </Link>
        ))}
      </section>
    </div>
  );
}
