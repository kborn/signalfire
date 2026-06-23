import React from 'react';
import { getActionDetails } from '@/lib/api/actions';
import { ApiError } from '@/lib/api/error';
import { notFound } from 'next/navigation';
import { MarkdownContent } from '@/components/markdown-content';
import { ArticleSummary } from '@/components/article-summary';

import { formatActionTypeLabel } from '@/lib/common/utils';
import Link from 'next/link';

export const revalidate = 3600;

async function fetchActionDetails(params: Promise<{ slug: string }>) {
  const { slug } = await params;
  try {
    return await getActionDetails(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}

export default async function ActionDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const action = await fetchActionDetails(params);
  const actionType = formatActionTypeLabel(action.actionType);
  const actionDomain = action.externalUrl
    ? new URL(action.externalUrl).hostname.replace(/^www\./, '')
    : null;

  return (
    <div className="detailPage motifPage">
      <nav
        className="detailBreadcrumb"
        aria-label="Back"
        data-topic={action.topics[0]?.slug}
        style={
          action.topics[0]?.color
            ? ({ '--topic-accent': action.topics[0].color } as React.CSSProperties)
            : undefined
        }
      >
        {action.topics.length > 0 ? (
          <Link href={`/issues/${action.topics[0].slug}`} className="detailBreadcrumbLink">
            ← {action.topics[0].name}
          </Link>
        ) : (
          <Link href="/actions" className="detailBreadcrumbLink">
            ← Actions
          </Link>
        )}
      </nav>
      <section className="detailHeader detailHero">
        <p className="summaryMeta">{actionType}</p>
        <h1 className="pageTitle">{action.title}</h1>
      </section>
      <section className="detailContent">
        <p className="detailLead">{action.summary}</p>

        {actionDomain ? (
          <div className="ctaGroup">
            <p className="section-label">Your next step</p>
            <a
              href={action.externalUrl!}
              className="primaryCTA"
              target="_blank"
              rel="noopener noreferrer"
            >
              Take Action on {actionDomain} →
            </a>
          </div>
        ) : null}

        <section>
          <MarkdownContent content={action.description} />
        </section>
        {action.topics.length > 0 && (
          <section className="relatedSection">
            <h3>Related Issues</h3>
            <ul className="relatedList">
              {action.topics.map((topic) => (
                <li
                  key={topic.id}
                  className="relatedListItem"
                  data-topic={topic.slug}
                  style={
                    topic.color
                      ? ({ '--topic-accent': topic.color } as React.CSSProperties)
                      : undefined
                  }
                >
                  <Link href={`/issues/${topic.slug}`} className="relatedListItemTitle">
                    {topic.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
        {action.articles.length > 0 && (
          <section className="relatedSection">
            <h3>Read First</h3>
            <div className="relatedList">
              {action.articles.map((article) => (
                <ArticleSummary key={article.id} article={article} variant="related" />
              ))}
            </div>
          </section>
        )}
      </section>
      <div className="detailPageNav">
        <Link href="/actions" className="textCTA">
          Browse more actions
        </Link>
      </div>
      <section className="page-section detailContributeNudge">
        <p className="section-label">Know of another way to act?</p>
        <p className="metaText">Know of an action, event, or resource we missed? Send it in.</p>
        <Link href="/submit" className="textCTA">
          Submit content
        </Link>
      </section>
    </div>
  );
}
