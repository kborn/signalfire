import { connection } from 'next/server';
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
  await connection();
  const topic = await fetchTopicDetails(params);
  return (
    <div className="detailPage motifPage">
      <nav className="detailBreadcrumb" aria-label="Back">
        <Link href="/issues" className="detailBreadcrumbLink">
          ← All Issues
        </Link>
      </nav>
      <section className="detailHeader detailHero">
        <h1 className="pageTitle">{topic.name}</h1>
      </section>
      <section className="detailContent detailContent--topic">
        <section className="detailMetaPanel">
          <p className="detailLead">{topic.description}</p>
        </section>
        {topic.articles.length > 0 && (
          <section
            className="relatedSection issueStepSection"
            aria-labelledby="topic-articles-label"
          >
            <div className="issueStepHeader" data-topic={topic.slug}>
              <span className="issueStepNum">02</span>
              <h2 id="topic-articles-label" className="issueStepTitle">
                Read
              </h2>
              <p className="issueStepSub">Explainers and field guides for this issue</p>
            </div>
            <div className="collectionList">
              {topic.articles.map((article) => (
                <ArticleSummary key={article.id} article={article} />
              ))}
            </div>
          </section>
        )}
        {topic.actions.length > 0 && (
          <section
            className="relatedSection issueStepSection"
            aria-labelledby="topic-actions-label"
          >
            <div className="issueStepHeader" data-topic={topic.slug}>
              <span className="issueStepNum">03</span>
              <h2 id="topic-actions-label" className="issueStepTitle">
                Act
              </h2>
              <p className="issueStepSub">Concrete next steps you can take right now</p>
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
