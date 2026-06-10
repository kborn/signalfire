import Link from 'next/link';
import EventEditorForm from '@/app/admin/events/_components/EventEditorForm';
import { withAdminAuthRedirect } from '@/lib/admin/auth-redirect';
import { getTopicsList } from '@/lib/api/topics';

export const dynamic = 'force-dynamic';

export default async function NewAdminEventPage() {
  const topics = await withAdminAuthRedirect('/admin/events/new', async () => {
    return await getTopicsList();
  });

  return (
    <section className="page-section articleEditorPage">
      <Link href="/admin/events" className="adminBackLink">
        ← Back to events
      </Link>

      <header className="adminHeader">
        <div>
          <h1 className="pageTitle">New Event</h1>
          <p className="adminDek">
            Create a curated event. The record id is assigned automatically and stays immutable.
          </p>
        </div>
      </header>

      <EventEditorForm
        mode="create"
        topics={topics.items}
        initialValues={{
          id: 0,
          title: '',
          summary: '',
          content: '',
          eventType: 'RALLY',
          startTime: '',
          endTime: null,
          locationName: '',
          publicLocationDescription: null,
          contactEmail: null,
          addressLine1: null,
          addressLine2: null,
          city: '',
          region: '',
          country: '',
          postalCode: '',
          website: null,
          topicSlugs: [],
          status: 'DRAFT',
        }}
      />
    </section>
  );
}
