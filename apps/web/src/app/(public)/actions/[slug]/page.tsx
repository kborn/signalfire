import { connection } from 'next/server';
import { getActionDetails } from '@/lib/api/actions';
import { ApiError } from '@/lib/api/error';
import { notFound } from 'next/navigation';
import { MarkdownContent } from '@/components/markdown-content';
import { ArticleSummary } from '@/components/article-summary';
import { formatContentDate } from '@/lib/common/time';
import { formatActionTypeLabel } from '@/lib/common/utils';
import Link from 'next/link';

export const revalidate = 60;

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
  await connection();
  const action = await fetchActionDetails(params);
  const publishedAt = formatContentDate(action.publishedAt);
  const updatedAt = formatContentDate(action.updatedAt);
  const actionType = formatActionTypeLabel(action.actionType);
  const actionDomain = action.externalUrl
    ? new URL(action.externalUrl).hostname.replace(/^www\./, '')
    : null;

  return (
    <div className="detailPage motifPage">
      <nav className="detailBreadcrumb" aria-label="Back">
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
      <section className="detailHeader">
        <h1 className="pageTitle">{action.title}</h1>
      </section>
      <section className="detailContent">
        <p className="detailLead">{action.summary}</p>

        {actionDomain ? (
          <div className="ctaGroup">
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

        <section className="detailMetaGroup">
          <div className="metaBlock">
            <p className="metaLabel">Action Type</p>
            <p className="metaValue">{actionType}</p>
          </div>
          {publishedAt && (
            <div className="metaBlock">
              <p className="metaLabel">Published</p>
              <p className="metaValue">{publishedAt}</p>
            </div>
          )}
          {updatedAt && (
            <div className="metaBlock">
              <p className="metaLabel">Updated</p>
              <p className="metaValue">{updatedAt}</p>
            </div>
          )}
        </section>

        <section>
          <MarkdownContent content={action.description} />
        </section>
        {action.topics.length > 0 && (
          <section className="relatedSection">
            <h3>Related Topics</h3>
            <ul className="relatedList">
              {action.topics.map((topic) => (
                <li key={topic.id} className="relatedListItem">
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
            <h3>Learn More</h3>
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
        <p className="metaText">
          If you know of an event, resource, or opportunity that should be listed here, submit it
          for review.
        </p>
        <Link href="/submit" className="textCTA">
          Submit content
        </Link>
      </section>
    </div>
  );
}
