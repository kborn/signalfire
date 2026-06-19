import Link from 'next/link';
import TopicEditorForm from '../_components/TopicEditorForm';
import { getAdminTopicDetail } from '@/lib/api/admin.server';
import { withAdminAuthRedirect } from '@/lib/admin/auth-redirect';
import { withNotFoundOn404 } from '@/lib/admin/not-found';

export const dynamic = 'force-dynamic';

export default async function AdminTopicDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = await withAdminAuthRedirect(`/admin/topics/${slug}`, () =>
    withNotFoundOn404(() => getAdminTopicDetail(slug)),
  );

  return (
    <section className="page-section actionEditorPage">
      <Link href="/admin/topics" className="adminBackLink">
        ← Back to issues
      </Link>
      <header className="adminHeader">
        <div>
          <h1 className="pageTitle">Edit Issue</h1>
          <p className="adminDek">
            {topic.articleCount} article{topic.articleCount !== 1 ? 's' : ''}, {topic.actionCount}{' '}
            action{topic.actionCount !== 1 ? 's' : ''}, {topic.eventCount} event
            {topic.eventCount !== 1 ? 's' : ''} linked.
          </p>
        </div>
      </header>
      <TopicEditorForm
        mode="edit"
        initialValues={{
          slug: topic.slug,
          name: topic.name,
          description: topic.description,
        }}
        linkedContent={{
          articles: topic.articleCount,
          actions: topic.actionCount,
          events: topic.eventCount,
        }}
      />
    </section>
  );
}
