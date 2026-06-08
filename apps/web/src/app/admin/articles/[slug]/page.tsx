import Link from 'next/link';
import ArticleEditorForm from '@/app/admin/articles/_components/ArticleEditorForm';
import ArticleMetadataPanel from '@/app/admin/articles/_components/ArticleMetadataPanel';
import { getAdminArticleDetails } from '@/lib/api/admin.server';
import { getTopicsList } from '@/lib/api/topics';

export const dynamic = 'force-dynamic';

export default async function AdminArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [article, topics] = await Promise.all([getAdminArticleDetails(slug), getTopicsList()]);

  return (
    <section className="page-section articleEditorPage">
      <Link href="/admin/articles" className="adminBackLink">
        ← Back to articles
      </Link>

      <header className="adminHeader">
        <div>
          <h1 className="pageTitle">Edit Article</h1>
          <p className="adminDek">Update the article while keeping its bookmarked slug stable.</p>
        </div>
      </header>

      <div className="adminStack">
        <ArticleMetadataPanel article={article} />
        <ArticleEditorForm
          mode="edit"
          topics={topics.items}
          initialValues={{
            slug: article.slug,
            title: article.title,
            summary: article.summary,
            content: article.content,
            author: article.author,
            topicSlugs: article.topicSlugs,
          }}
        />
      </div>
    </section>
  );
}
