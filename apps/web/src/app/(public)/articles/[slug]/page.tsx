import React from 'react';
import { getArticleDetails } from '@/lib/api/articles';
import { ApiError } from '@/lib/api/error';
import { MarkdownContent } from '@/components/markdown-content';
import { notFound } from 'next/navigation';
import { ActionSummary } from '@/components/action-summary';
import { formatContentDate } from '@/lib/common/time';
import Link from 'next/link';

export const revalidate = 3600;

async function fetchArticleDetails(params: Promise<{ slug: string }>) {
  const { slug } = await params;
  try {
    return await getArticleDetails(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}

export default async function ArticleDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const article = await fetchArticleDetails(params);
  const publishedAt = formatContentDate(article.publishedAt);
  const updatedAt = formatContentDate(article.updatedAt);

  return (
    <div className="detailPage motifPage">
      <nav
        className="detailBreadcrumb"
        aria-label="Back"
        data-topic={article.topics[0]?.slug}
        style={
          article.topics[0]?.color
            ? ({ '--topic-accent': article.topics[0].color } as React.CSSProperties)
            : undefined
        }
      >
        {article.topics.length > 0 ? (
          <Link href={`/issues/${article.topics[0].slug}`} className="detailBreadcrumbLink">
            ← {article.topics[0].name}
          </Link>
        ) : (
          <Link href="/articles" className="detailBreadcrumbLink">
            ← Articles
          </Link>
        )}
      </nav>
      <section className="detailHeader detailHero">
        <h1 className="pageTitle">{article.title}</h1>
      </section>
      <section className="detailContent">
        <section className="detailNarrativePanel">
          <p className="articleLead">{article.summary}</p>
          <MarkdownContent content={article.content} />
        </section>

        <aside className="detailMetaGroup detailMetaPanel articleMetaPanel">
          <div className="detailMetaRow">
            <div className="metaBlock">
              <p className="metaLabel">Author</p>
              <p className="metaValue">{article.author}</p>
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
          </div>
        </aside>

        {article.actions.length > 0 ? (
          <section className="relatedSection">
            <div className="relatedSectionHeader">
              <p className="section-label">Now act</p>
              <h3>Take Action</h3>
            </div>
            <div className="relatedList">
              {article.actions.map((action) => (
                <ActionSummary key={action.id} action={action} variant="related" />
              ))}
            </div>
          </section>
        ) : article.topics.length > 0 ? (
          <section className="relatedSection articleActionNudge">
            <p className="section-label">Now act</p>
            <p className="relatedSectionTagline">
              Find concrete actions you can take on {article.topics[0].name}.
            </p>
            <Link href={`/actions?topicSlug=${article.topics[0].slug}`} className="textCTA">
              Find actions on {article.topics[0].name}
            </Link>
          </section>
        ) : null}
        {article.topics.length > 0 && (
          <section className="relatedSection">
            <div className="relatedSectionHeader">
              <h3>Explore This Issue Further</h3>
              <p className="relatedSectionTagline">
                Find everything else on this issue in one place — more to read, actions to take, and
                local events.
              </p>
            </div>
            <Link href={`/issues/${article.topics[0].slug}`} className="textCTA">
              Go to {article.topics[0].name}
            </Link>
          </section>
        )}
      </section>
      <div className="detailPageNav">
        <Link href="/articles" className="textCTA">
          Browse more articles
        </Link>
      </div>
      <section className="page-section detailContributeNudge">
        <p className="section-label">Know something we missed?</p>
        <p className="metaText">
          If you have something that should be here — an article, a guide, a resource — send it in.
        </p>
        <Link href="/submit" className="textCTA">
          Submit content
        </Link>
      </section>
    </div>
  );
}
