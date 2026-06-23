import React from 'react';
import { getTopicDetails } from '@/lib/api/topics';
import { ApiError } from '@/lib/api/error';
import { notFound } from 'next/navigation';
import { ArticleSummary } from '@/components/article-summary';
import { ActionSummary } from '@/components/action-summary';
import Link from 'next/link';
import { JourneyStrip } from '@/components/journey-strip';

export const revalidate = 3600;

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
    <div className="detailPage motifPage">
      <JourneyStrip step={1} />
      <nav className="detailBreadcrumb" aria-label="Back">
        <Link href="/issues" className="detailBreadcrumbLink">
          ← All Issues
        </Link>
      </nav>
      <section className="detailHeader detailHero">
        <h1 className="pageTitle">{topic.name}</h1>
      </section>
      <section className="detailContent detailContent--topic">
        <p className="detailLead">{topic.description}</p>
        {topic.articles.length > 0 && (
          <section
            className="relatedSection issueStepSection"
            aria-labelledby="topic-articles-label"
          >
            <div
              className="issueStepHeader"
              data-topic={topic.slug}
              style={
                topic.color ? ({ '--topic-accent': topic.color } as React.CSSProperties) : undefined
              }
            >
              <h2 id="topic-articles-label" className="issueStepTitle">
                Read
              </h2>
              <p className="issueStepSub">
                Read enough to understand what&apos;s actually at stake.
              </p>
            </div>
            <div className="collectionList">
              {topic.articles.slice(0, 5).map((article) => (
                <ArticleSummary key={article.id} article={article} />
              ))}
            </div>
            {topic.articles.length > 5 && (
              <Link href={`/articles?topicSlug=${topic.slug}`} className="textCTA">
                Browse all {topic.articles.length} articles on {topic.name}
              </Link>
            )}
          </section>
        )}
        {topic.actions.length > 0 && (
          <section
            className="relatedSection issueStepSection issueStepSection--act"
            aria-labelledby="topic-actions-label"
          >
            <div
              className="issueStepHeader"
              data-topic={topic.slug}
              style={
                topic.color ? ({ '--topic-accent': topic.color } as React.CSSProperties) : undefined
              }
            >
              <h2 id="topic-actions-label" className="issueStepTitle">
                Act
              </h2>
              <p className="issueStepSub">This is where knowing becomes doing.</p>
            </div>
            <div className="collectionList">
              {topic.actions.slice(0, 5).map((action) => (
                <ActionSummary key={action.id} action={action} />
              ))}
            </div>
            {topic.actions.length > 5 && (
              <Link href={`/actions?topicSlug=${topic.slug}`} className="textCTA">
                Browse all {topic.actions.length} actions on {topic.name}
              </Link>
            )}
          </section>
        )}
        <section className="relatedSection issueStepSection topicEventCTA">
          <div
            className="issueStepHeader"
            data-topic={topic.slug}
            style={
              topic.color ? ({ '--topic-accent': topic.color } as React.CSSProperties) : undefined
            }
          >
            <h2 className="issueStepTitle">Events</h2>
            <p className="issueStepSub">
              Protests, town halls, volunteer shifts — find what&apos;s happening near you.
            </p>
          </div>
          <Link href={`/events?topicSlug=${topic.slug}`} className="primaryCTA">
            Find events on {topic.name}
          </Link>
        </section>
      </section>
    </div>
  );
}
