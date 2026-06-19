import { connection } from 'next/server';
import { getArticleDetails } from '@/lib/api/articles';
import { ApiError } from '@/lib/api/error';
import { MarkdownContent } from '@/components/markdown-content';
import { notFound } from 'next/navigation';
import { TopicSummary } from '@/components/topic-summary';
import { ActionSummary } from '@/components/action-summary';
import { formatContentDate } from '@/lib/common/time';
import Link from 'next/link';

export const revalidate = 60;

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
  await connection();
  const article = await fetchArticleDetails(params);
  const publishedAt = formatContentDate(article.publishedAt);
  const updatedAt = formatContentDate(article.updatedAt);

  return (
    <div className="detailPage motifPage">
      <nav className="detailBreadcrumb" aria-label="Back">
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
      <section className="detailContent detailContent--article">
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
        {article.topics.length > 0 && (
          <section className="relatedSection">
            <div className="relatedSectionHeader">
              <h3>Explore This Issue</h3>
              <p className="relatedSectionTagline">
                Jump back to the issue page for more background, actions, and events.
              </p>
            </div>
            <div className="relatedList">
              {article.topics.map((topic) => (
                <TopicSummary key={topic.id} topic={topic} variant="related" />
              ))}
            </div>
          </section>
        )}
        {article.actions.length > 0 && (
          <section className="relatedSection">
            <h3>Take Action</h3>
            <div className="relatedList">
              {article.actions.map((action) => (
                <ActionSummary key={action.id} action={action} variant="related" />
              ))}
            </div>
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
          If you have an article, guide, or event that belongs here, you can submit it for review.
        </p>
        <Link href="/submit" className="textCTA">
          Submit content
        </Link>
      </section>
    </div>
  );
}
