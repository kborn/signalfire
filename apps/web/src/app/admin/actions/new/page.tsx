import Link from 'next/link';
import ActionEditorForm from '@/app/admin/actions/_components/ActionEditorForm';
import { getTopicsList } from '@/lib/api/topics';
import { withAdminAuthRedirect } from '@/lib/admin/auth-redirect';

export const dynamic = 'force-dynamic';

export default async function NewAdminActionPage() {
  const topics = await withAdminAuthRedirect('/admin/actions/new', async () => {
    return await getTopicsList();
  });

  return (
    <section className="page-section actionEditorPage">
      <Link href="/admin/actions" className="adminBackLink">
        ← Back to actions
      </Link>

      <header className="adminHeader">
        <div>
          <h1 className="pageTitle">New Action</h1>
          <p className="adminDek">
            Create a curated action. The slug is generated from the title and stays immutable.
          </p>
        </div>
      </header>

      <ActionEditorForm
        mode="create"
        topics={topics.items}
        initialValues={{
          slug: '',
          title: '',
          summary: '',
          description: '',
          actionType: 'GUIDE',
          topicSlugs: [],
        }}
      />
    </section>
  );
}
