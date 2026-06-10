import Link from 'next/link';
import ActionEditorForm from '@/app/admin/actions/_components/ActionEditorForm';
import ActionMetadataPanel from '@/app/admin/actions/_components/ActionMetadataPanel';
import { getAdminActionDetails } from '@/lib/api/admin.server';
import { getTopicsList } from '@/lib/api/topics';
import { withAdminAuthRedirect } from '@/lib/admin/auth-redirect';
import { withNotFoundOn404 } from '@/lib/admin/not-found';

export const dynamic = 'force-dynamic';

async function fetchActionDetails(slug: string) {
  return await withNotFoundOn404(async () => getAdminActionDetails(slug));
}

export default async function AdminActionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [action, topics] = await withAdminAuthRedirect(`/admin/actions/${slug}`, async () => {
    return await Promise.all([fetchActionDetails(slug), getTopicsList()]);
  });

  return (
    <section className="page-section actionEditorPage">
      <Link href="/admin/actions" className="adminBackLink">
        ← Back to actions
      </Link>

      <header className="adminHeader">
        <div>
          <h1 className="pageTitle">Edit Action</h1>
          <p className="adminDek">Update the action while keeping its bookmarked slug stable.</p>
        </div>
      </header>

      <div className="adminStack">
        <ActionMetadataPanel action={action} />
        <ActionEditorForm
          mode="edit"
          topics={topics.items}
          initialValues={{
            slug: action.slug,
            title: action.title,
            summary: action.summary,
            description: action.description,
            actionType: action.actionType,
            topicSlugs: action.topicSlugs,
          }}
        />
      </div>
    </section>
  );
}
