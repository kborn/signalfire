import Link from 'next/link';
import ArticleEditorForm from '@/app/admin/articles/_components/ArticleEditorForm';
import { withAdminAuthRedirect } from '@/lib/admin/auth-redirect';
import { getTopicsList } from '@/lib/api/topics';

export const dynamic = 'force-dynamic';

export default async function NewAdminArticlePage() {
  const topics = await withAdminAuthRedirect('/admin/articles/new', async () => {
    return await getTopicsList();
  });

  return (
    <section className="page-section articleEditorPage">
      <Link href="/admin/articles" className="adminBackLink">
        ← Back to articles
      </Link>

      <header className="adminHeader">
        <div>
          <h1 className="pageTitle">New Article</h1>
          <p className="adminDek">
            Create a curated article. The slug is generated from the title and stays immutable.
          </p>
        </div>
      </header>

      <ArticleEditorForm
        mode="create"
        topics={topics.items}
        initialValues={{
          slug: '',
          title: '',
          summary: '',
          author: '',
          content: '',
          topicSlugs: [],
        }}
      />
    </section>
  );
}
