import { getArticleDetails } from '@/lib/api/articles';
import { ApiError } from '@/lib/api/error';
import { ArticleBody } from '@/components/article-body';
import { notFound } from 'next/navigation';
import { TopicSummary } from '@/components/topic-summary';
import { ActionSummary } from '@/components/action-summary';
import { formatContentDate } from '@/lib/common/time';

export const dynamic = 'force-dynamic';

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
      <section className="detailHeader">
        <h1>{article.title}</h1>
      </section>
      <section className="topicDetailSections">
        <section className="detailMetaGroup">
          <p>{article.summary}</p>
          <p>{article.author}</p>
          {publishedAt && <p>Published {publishedAt}</p>}
          {updatedAt && <p>Updated {updatedAt}</p>}
        </section>

        <section>
          <ArticleBody content={article.content} />
        </section>
        {article.topics.length > 0 && (
          <section className="relatedSection">
            <h3>Topics</h3>
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
