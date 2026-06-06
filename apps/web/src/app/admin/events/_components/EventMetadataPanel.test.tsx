import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import EventMetadataPanel from './EventMetadataPanel';

describe('EventMetadataPanel', () => {
  afterEach(() => {
    cleanup();
  });

  it('links the event id to the live page when published and shows key metadata', () => {
    render(
      <EventMetadataPanel
        event={{
          id: 42,
          title: 'Town Hall',
          summary: 'Summary',
          description: 'Description',
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
          status: 'PUBLISHED',
          updatedAt: '2026-05-14T20:00:00.000Z',
          publishedAt: '2026-05-14T20:00:00.000Z',
          topicSlugs: ['democracy'],
        }}
      />,
    );

    expect(screen.getByRole('link', { name: '42' })).toHaveAttribute('href', '/events/42');
    expect(screen.getByText('PUBLISHED')).toBeInTheDocument();
    expect(screen.getByText('Rally')).toBeInTheDocument();
    expect(
      screen.getByText((_, element) => {
        return (
          element?.tagName.toLowerCase() === 'time' &&
          element.getAttribute('datetime') === '2026-05-14T17:00:00.000Z'
        );
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('02108')).toBeInTheDocument();
  });

  it('renders the event id as plain text when the event is a draft', () => {
    render(
      <EventMetadataPanel
        event={{
          id: 42,
          title: 'Town Hall',
          summary: 'Summary',
          description: 'Description',
          website: null,
          contactEmail: null,
          publicLocationDescription: null,
          addressLine1: null,
          addressLine2: null,
          eventType: 'RALLY',
          startTime: '2026-05-14T17:00:00.000Z',
          endTime: null,
          locationName: 'City Hall',
          city: 'Boston',
          region: 'MA',
          country: 'USA',
          postalCode: '02108',
          status: 'DRAFT',
          updatedAt: '2026-05-14T20:00:00.000Z',
          publishedAt: null,
          topicSlugs: ['democracy'],
        }}
      />,
    );

    expect(screen.queryByRole('link', { name: '42' })).not.toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getAllByText('--')).toHaveLength(1);
  });
});
