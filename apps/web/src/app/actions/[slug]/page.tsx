import { getActionDetails } from '@/lib/api/actions';
import { ApiError } from '@/lib/api/error';
import { notFound } from 'next/navigation';
import { ArticleBody } from '@/components/article-body';
export const dynamic = 'force-dynamic';
import { TopicSummary } from '@/components/topic-summary';
import { ArticleSummary } from '@/components/article-summary';

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
  return (
    <div className="detailPage">
      <section className="detailHeader">
        <h1>{action.title}</h1>
      </section>
      <section className="topicDetailSections">
        <section className="detailMetaGroup">
          <p>{action.summary}</p>
          <p>{action.actionType}</p>
          <p>Published {action.publishedAt}</p>
          <p>Updated {action.updatedAt}</p>
        </section>

        <section>
          <ArticleBody content={action.description} />
        </section>
        {action.topics.length > 0 && (
          <section className="relatedSection">
            <h3>Related Topics</h3>
            <div className="relatedList">
              {action.topics.map((topic) => (
                <TopicSummary key={topic.id} topic={topic} variant="related" />
              ))}
            </div>
          </section>
        )}
        {action.articles.length > 0 && (
          <section className="relatedSection">
            <h3>Articles</h3>
            <div className="relatedList">
              {action.articles.map((article) => (
                <ArticleSummary key={article.id} article={article} variant="related" />
              ))}
            </div>
          </section>
        )}
      </section>
    </div>
  );
}
