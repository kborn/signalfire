import { getTopicDetails } from '@/lib/api/topics';
import { ApiError } from '@/lib/api/error';
import { notFound } from 'next/navigation';
import { ArticleSummary } from '@/components/article-summary';
import { ActionSummary } from '@/components/action-summary';
import Link from 'next/link';

export const revalidate = 60;

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
      <section className="detailHeader detailHero">
        <h1 className="pageTitle">{topic.name}</h1>
      </section>
      <section className="detailContent detailContent--topic">
        <section className="detailMetaPanel">
          <p className="detailLead">{topic.description}</p>
        </section>
        {topic.articles.length > 0 && (
          <section className="relatedSection" aria-labelledby="topic-articles-label">
            <div className="relatedSectionHeader">
              <p id="topic-articles-label" className="section-label">
                Step 2 - Read enough to act
              </p>
              <p className="relatedSectionTagline">
                Read explainers and field guides that make the issue easier to follow.
              </p>
            </div>
            <div className="collectionList">
              {topic.articles.map((article) => (
                <ArticleSummary key={article.id} article={article} />
              ))}
            </div>
          </section>
        )}
        {topic.actions.length > 0 && (
          <section className="relatedSection" aria-labelledby="topic-actions-label">
            <div className="relatedSectionHeader">
              <p id="topic-actions-label" className="section-label">
                Step 3 - Choose a next step
              </p>
              <p className="relatedSectionTagline">Take practical next steps you can do now.</p>
            </div>
            <div className="collectionList">
              {topic.actions.map((action) => (
                <ActionSummary key={action.id} action={action} />
              ))}
            </div>
          </section>
        )}
        <section className="ctaGroup topicEventCTA">
          <div className="relatedSectionHeader">
            <p className="section-label">Events</p>
            <p className="relatedSectionTagline">
              Find upcoming in-person opportunities tied to this issue.
            </p>
          </div>
          <Link href={`/events?topicSlug=${topic.slug}`} className="secondaryCTA">
            Browse Events For This Issue
          </Link>
        </section>
      </section>
    </div>
  );
}
