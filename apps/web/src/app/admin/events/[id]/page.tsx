import Link from 'next/link';
import { getAdminEventDetails } from '@/lib/api/admin.server';
import { getTopicsList } from '@/lib/api/topics';
import EventEditorForm from '@/app/admin/events/_components/EventEditorForm';
import EventMetadataPanel from '@/app/admin/events/_components/EventMetadataPanel';
import { withAdminAuthRedirect } from '@/lib/admin/auth-redirect';
import { parsePositiveIntOrNotFound, withNotFoundOn404 } from '@/lib/admin/not-found';

export const dynamic = 'force-dynamic';

async function fetchEventDetails(params: Promise<{ id: string }>) {
  const { id } = await params;
  const eventId = parsePositiveIntOrNotFound(id);
  return await withNotFoundOn404(async () => getAdminEventDetails(eventId));
}

export default async function AdminEventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [event, topics] = await withAdminAuthRedirect(async () => {
    return await Promise.all([fetchEventDetails(params), getTopicsList()]);
  });

  return (
    <section className="page-section articleEditorPage">
      <Link href="/admin/events" className="adminBackLink">
        ← Back to events
      </Link>

      <header className="adminHeader">
        <div>
          <h1 className="pageTitle">Edit Event</h1>
          <p className="adminDek">Update the event while keeping its record id stable.</p>
        </div>
      </header>

      <div className="adminStack">
        <EventMetadataPanel event={event} />
        <EventEditorForm
          mode="edit"
          topics={topics.items}
          initialValues={{
            id: event.id,
            title: event.title,
            summary: event.summary,
            content: event.description,
            eventType: event.eventType,
            startTime: event.startTime,
            endTime: event.endTime,
            locationName: event.locationName,
            publicLocationDescription: event.publicLocationDescription,
            contactEmail: event.contactEmail,
            addressLine1: event.addressLine1,
            addressLine2: event.addressLine2,
            city: event.city,
            region: event.region,
            country: event.country,
            postalCode: event.postalCode,
            website: event.website,
            topicSlugs: event.topicSlugs,
            status: event.status,
          }}
        />
      </div>
    </section>
  );
}
