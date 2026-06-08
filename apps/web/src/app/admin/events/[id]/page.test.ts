import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getAdminEventDetails } from '@/lib/api/admin.server';
import { getTopicsList } from '@/lib/api/topics';

import AdminEventDetailPage from './page';
import EventEditorForm from '@/app/admin/events/_components/EventEditorForm';
import EventMetadataPanel from '@/app/admin/events/_components/EventMetadataPanel';

vi.mock('@/lib/api/admin.server', () => ({
  getAdminEventDetails: vi.fn(),
}));

vi.mock('@/lib/api/topics', () => ({
  getTopicsList: vi.fn(),
}));

vi.mock('@/app/admin/events/_components/EventEditorForm', () => ({
  default: vi.fn(() => null),
}));

vi.mock('@/app/admin/events/_components/EventMetadataPanel', () => ({
  default: vi.fn(() => null),
}));

describe('AdminEventDetailPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('loads the event and topics and passes edit defaults into the editor', async () => {
    vi.mocked(getAdminEventDetails).mockResolvedValue({
      id: 42,
      title: 'Climate Rally',
      summary: 'Join a rally for climate action.',
      description: 'Existing body',
      website: 'https://example.org/event',
      contactEmail: 'contact@example.org',
      publicLocationDescription: 'Meet near the fountain',
      addressLine1: '1 Main St',
      addressLine2: null,
      eventType: 'RALLY',
      startTime: '2026-05-14T17:00:00.000Z',
      endTime: '2026-05-14T19:00:00.000Z',
      locationName: 'City Hall',
      city: 'Boston',
      region: 'MA',
      country: 'USA',
      postalCode: '02108',
      status: 'DRAFT',
      updatedAt: '2026-05-13T12:00:00.000Z',
      publishedAt: null,
      topicSlugs: ['climate'],
    });
    vi.mocked(getTopicsList).mockResolvedValue({
      items: [
        { id: 1, slug: 'climate', name: 'Climate', description: 'Climate overview.' },
        { id: 2, slug: 'democracy', name: 'Democracy', description: 'Democracy overview.' },
      ],
    });

    const markup = renderToStaticMarkup(
      await AdminEventDetailPage({ params: Promise.resolve({ id: '42' }) }),
    );

    expect(getAdminEventDetails).toHaveBeenCalledWith(42);
    expect(getTopicsList).toHaveBeenCalledTimes(1);
    expect(markup).toContain('← Back to events');
    expect(markup).toContain('Edit Event');
    expect(markup).toContain('Update the event while keeping its record id stable.');

    expect(vi.mocked(EventMetadataPanel)).toHaveBeenCalledWith(
      expect.objectContaining({
        event: expect.objectContaining({
          id: 42,
          status: 'DRAFT',
        }),
      }),
      undefined,
    );

    expect(vi.mocked(EventEditorForm)).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: 'edit',
        topics: expect.arrayContaining([
          expect.objectContaining({ slug: 'climate' }),
          expect.objectContaining({ slug: 'democracy' }),
        ]),
        initialValues: expect.objectContaining({
          id: 42,
          title: 'Climate Rally',
          summary: 'Join a rally for climate action.',
          content: 'Existing body',
          eventType: 'RALLY',
          startTime: '2026-05-14T17:00:00.000Z',
          endTime: '2026-05-14T19:00:00.000Z',
          locationName: 'City Hall',
          city: 'Boston',
          region: 'MA',
          country: 'USA',
          postalCode: '02108',
          website: 'https://example.org/event',
          topicSlugs: ['climate'],
        }),
      }),
      undefined,
    );
  });
});
