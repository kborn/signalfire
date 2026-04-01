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
        <h1 className="pageTitle">{topic.name}</h1>
      </section>
      <section className="detailContent">
        <p>{topic.description}</p>
        {topic.articles.length > 0 && (
          <section className="relatedSection">
            <h3>Articles</h3>
            <div className="relatedList">
              {topic.articles.map((article) => (
                <ArticleSummary key={article.id} article={article} variant="related" />
              ))}
            </div>
          </section>
        )}
        {topic.actions.length > 0 && (
          <section className="relatedSection">
            <h3>Actions</h3>
            <div className="relatedList">
              {topic.actions.map((action) => (
                <ActionSummary key={action.id} action={action} variant="related" />
              ))}
            </div>
          </section>
        )}
        <section className="ctaGroup topicEventCTA">
          <h3>Events</h3>
          <p className="metaText">Browse upcoming events related to this topic.</p>
          <Link href={`/events?topicSlug=${topic.slug}`} className="secondaryCTA">
            Browse Events
          </Link>
        </section>
      </section>
    </div>
  );
}
