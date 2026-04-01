import { getTopicDetails } from '@/lib/api/topics';
import { ApiError } from '@/lib/api/error';
import { notFound } from 'next/navigation';
export const dynamic = 'force-dynamic';
import { ArticleSummary } from '@/components/article-summary';
import { ActionSummary } from '@/components/action-summary';
import Link from 'next/link';

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
    <div className="detailPage">
      <section className="detailHeader">
        <h1>{topic.name}</h1>
      </section>
      <section className="topicDetailSections">
        <p>{topic.description}</p>
        <section className="relatedSection">
          <h3>Articles</h3>
          {topic.articles.map((article) => (
            <ArticleSummary key={article.id} article={article} />
          ))}
        </section>
        <section className="relatedSection">
          <h3>Actions</h3>
          {topic.actions.map((action) => (
            <ActionSummary key={action.id} action={action} />
          ))}
        </section>
      </section>
      <section className="topicEventCTA">
        <Link href={`/events?topicSlug=${topic.slug}`}>Browse Events</Link>
      </section>
    </div>
  );
}
