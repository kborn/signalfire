import React from 'react';
import { getTopicDetails } from '@/lib/api/topics';
import { ApiError } from '@/lib/api/error';
import { notFound } from 'next/navigation';
import { ArticleSummary } from '@/components/article-summary';
import { ActionSummary } from '@/components/action-summary';
import Link from 'next/link';

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
      <nav className="detailBreadcrumb" aria-label="Back">
        <Link href="/issues" className="detailBreadcrumbLink">
          ← All Issues
        </Link>
      </nav>
      <section className="detailHeader detailHero">
        <h1 className="pageTitle">{topic.name}</h1>
      </section>
      <section className="detailContent detailContent--topic">
        <div className="issueOverviewSection">
          <div
            className="issueStepHeader"
            data-topic={topic.slug}
            style={
              topic.color ? ({ '--topic-accent': topic.color } as React.CSSProperties) : undefined
            }
          >
            <span className="issueStepNum">01</span>
            <h2 className="issueStepTitle">Go Deep</h2>
            <p className="issueStepSub">
              Start here. Read enough to understand what&apos;s at stake — where the pressure is and
              where it&apos;s missing.
            </p>
          </div>
          <p className="detailLead">{topic.description}</p>
        </div>
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
              <span className="issueStepNum">02</span>
              <h2 id="topic-articles-label" className="issueStepTitle">
                Read
              </h2>
              <p className="issueStepSub">
                Read enough to understand what&apos;s actually at stake.
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
          <section
            className="relatedSection issueStepSection"
            aria-labelledby="topic-actions-label"
          >
            <div
              className="issueStepHeader"
              data-topic={topic.slug}
              style={
                topic.color ? ({ '--topic-accent': topic.color } as React.CSSProperties) : undefined
              }
            >
              <span className="issueStepNum">03</span>
              <h2 id="topic-actions-label" className="issueStepTitle">
                Act
              </h2>
              <p className="issueStepSub">This is where knowing becomes doing</p>
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
              Find in-person events and organizing opportunities near you.
            </p>
          </div>
          <Link href={`/events?topicSlug=${topic.slug}`} className="secondaryCTA">
            Find Related Events
          </Link>
        </section>
      </section>
    </div>
  );
}
