import Link from 'next/link';
import TopicEditorForm from '../_components/TopicEditorForm';
import { withAdminAuthRedirect } from '@/lib/admin/auth-redirect';

export const dynamic = 'force-dynamic';

export default async function NewAdminTopicPage() {
  await withAdminAuthRedirect('/admin/topics/new', async () => null);

  return (
    <section className="page-section actionEditorPage">
      <Link href="/admin/topics" className="adminBackLink">
        ← Back to issues
      </Link>
      <header className="adminHeader">
        <div>
          <h1 className="pageTitle">New Issue</h1>
          <p className="adminDek">The slug is generated from the name and cannot be changed.</p>
        </div>
      </header>
      <TopicEditorForm mode="create" initialValues={{ slug: '', name: '', description: '' }} />
    </section>
  );
}
