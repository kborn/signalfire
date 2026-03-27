import { getActionDetails } from '@/lib/api/actions';
import { ApiError } from '@/lib/api/error';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArticleBody } from '@/components/article-body';
export const dynamic = 'force-dynamic';

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
    <div className="page-section">
      <section>
        <h1>{action.title}</h1>
        <p>{action.summary}</p>
      </section>
      <section>
        <ArticleBody content={action.description} />
      </section>
      <section>
        <h2>Related Topics</h2>
        {action.topics.map((topic) => (
          <div key={topic.id}>
            <h2>
              <Link href={`/topics/${topic.slug}`}>{topic.name}</Link>
            </h2>
            <p>{topic.description}</p>
          </div>
        ))}
      </section>
      <section>
        <h2>Articles</h2>
        {action.articles.map((article) => (
          <div key={article.id}>
            <Link href={`/articles/${article.slug}`}>{article.title}</Link>
            <p className="summary"> {article.summary}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
