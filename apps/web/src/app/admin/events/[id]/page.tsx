import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ApiError } from '@/lib/api/error';
import { getAdminEventDetails } from '@/lib/api/admin';
import { getTopicsList } from '@/lib/api/topics';
import EventEditorForm from '@/app/admin/events/_components/EventEditorForm';
import EventMetadataPanel from '@/app/admin/events/_components/EventMetadataPanel';

export const dynamic = 'force-dynamic';

async function fetchEventDetails(params: Promise<{ id: string }>) {
  const { id } = await params;
  const eventId = Number(id);

  if (!Number.isInteger(eventId) || eventId < 1) {
    notFound();
  }

  try {
    return await getAdminEventDetails(eventId);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}

export default async function AdminEventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [event, topics] = await Promise.all([fetchEventDetails(params), getTopicsList()]);

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
