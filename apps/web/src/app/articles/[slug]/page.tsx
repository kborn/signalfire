import { getArticleDetails } from '@/lib/api/articles';
import { ApiError } from '@/lib/api/error';
import { ArticleBody } from '@/components/article-body';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { TopicSummary } from '@/components/topic-summary';
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

  return (
    <div className="page-section">
      <section>
        <h1>{article.title}</h1>
        <p>{article.summary}</p>
        <p>{article.author}</p>
        <p>{article.publishedAt}</p>
        <p>{article.updatedAt}</p>
      </section>
      <section>
        <ArticleBody content={article.content} />
      </section>
      <section>
        <h2>Topics</h2>
        {article.topics.map((topic) => (
          <TopicSummary key={topic.id} topic={topic} />
        ))}
      </section>
      <section>
        <h2>Take Action</h2>
        {article.actions.map((action) => (
          <div key={action.id}>
            <Link href={`/actions/${action.slug}`}>{action.title}</Link>
            <p className="summary"> {action.summary}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
