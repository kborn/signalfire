import { getArticleDetails } from '@/lib/api/articles';
import { ApiError } from '@/lib/api/error';
import { MarkdownContent } from '@/components/markdown-content';
import { notFound } from 'next/navigation';
import { TopicSummary } from '@/components/topic-summary';
import { ActionSummary } from '@/components/action-summary';
import { formatContentDate } from '@/lib/common/time';

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
  const article = await fetchArticleDetails(params);
  const publishedAt = formatContentDate(article.publishedAt);
  const updatedAt = formatContentDate(article.updatedAt);

  return (
    <div className="detailPage">
      <section className="detailHeader detailHero">
        <h1 className="pageTitle">{article.title}</h1>
      </section>
      <section className="detailContent detailContent--article">
        <section className="detailMetaGroup detailMetaPanel">
          <p className="detailLead">{article.summary}</p>
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
        </section>

        <section className="detailNarrativePanel">
          <MarkdownContent content={article.content} />
        </section>
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
    </div>
  );
}
