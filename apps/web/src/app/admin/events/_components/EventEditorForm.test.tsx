import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ApiError, SubmissionError } from '@/lib/api/error';
import { createAdminEvent, updateAdminEvent } from '@/lib/api/admin';

import EventEditorForm from './EventEditorForm';

const routerMock = vi.hoisted(() => ({
  replace: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => routerMock,
}));

vi.mock('@/lib/api/admin', () => ({
  createAdminEvent: vi.fn(),
  updateAdminEvent: vi.fn(),
}));

const scrollIntoView = vi.fn();
const scrollTo = vi.fn();

Object.defineProperty(Element.prototype, 'scrollIntoView', {
  configurable: true,
  value: scrollIntoView,
});

Object.defineProperty(window, 'scrollTo', {
  configurable: true,
  value: scrollTo,
});

const topics = [
  {
    id: 1,
    slug: 'climate',
    name: 'Climate',
    description: 'Climate policy and event discovery.',
  },
  {
    id: 2,
    slug: 'democracy',
    name: 'Democracy',
    description: 'Voting rights and democratic institutions.',
  },
];

function mockCreateAdminEvent() {
  return vi.mocked(createAdminEvent);
}

function mockUpdateAdminEvent() {
  return vi.mocked(updateAdminEvent);
}

function renderCreateForm() {
  return render(
    <EventEditorForm
      mode="create"
      topics={topics}
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
    />,
  );
}

function renderEditForm() {
  return render(
    <EventEditorForm
      mode="edit"
      topics={topics}
      initialValues={{
        id: 42,
        title: 'Existing Title',
        summary: 'Existing summary',
        content: 'Existing body',
        eventType: 'MEETING',
        startTime: '2026-05-14T17:00:00.000Z',
        endTime: '2026-05-14T19:00:00.000Z',
        locationName: 'Existing Location',
        publicLocationDescription: 'Existing guidance',
        contactEmail: 'contact@example.org',
        addressLine1: '1 Existing St',
        addressLine2: null,
        city: 'Boston',
        region: 'MA',
        country: 'USA',
        postalCode: '02108',
        website: 'https://example.org/event',
        topicSlugs: ['climate'],
        status: 'DRAFT',
      }}
    />,
  );
}

async function fillValidEventFields() {
  const user = userEvent.setup();

  await user.type(screen.getByLabelText('Title'), '  Climate Event  ');
  await user.type(screen.getByLabelText('Summary'), '  Short event summary  ');
  await user.type(screen.getByLabelText('Body'), '  Full event body  ');
  await user.selectOptions(screen.getByLabelText('Event type'), 'MEETING');
  await user.type(screen.getByLabelText('Start Time'), '2026-05-14T17:00');
  await user.type(screen.getByLabelText('End Time'), '2026-05-14T19:00');
  await user.type(screen.getByLabelText('Location Name'), '  City Hall  ');
  await user.type(screen.getByLabelText('Street Address'), '  1 Main St  ');
  await user.type(screen.getByLabelText('City'), '  Boston  ');
  await user.type(screen.getByLabelText('State'), '  MA  ');
  await user.type(screen.getByLabelText('Country'), '  USA  ');
  await user.type(screen.getByLabelText('Postal Code'), ' 02108 ');
  await user.type(screen.getByLabelText('Website'), '  https://example.org/event  ');
  await user.click(screen.getByLabelText('Climate'));

  return user;
}

describe('EventEditorForm', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('shows local validation errors and scrolls to the first invalid field', async () => {
    const user = userEvent.setup();

    renderCreateForm();

    await user.click(screen.getByRole('button', { name: 'Create published' }));

    expect(createAdminEvent).not.toHaveBeenCalled();
    expect(screen.getByText('Title is required')).toBeInTheDocument();
    expect(screen.getByText('Summary is required')).toBeInTheDocument();
    expect(screen.getByText('Body is required')).toBeInTheDocument();
    expect(screen.getByText('Start date and time is required')).toBeInTheDocument();
    expect(screen.getByText('Location name is required')).toBeInTheDocument();
    expect(screen.getByText('City is required')).toBeInTheDocument();
    expect(screen.getByText('State is required')).toBeInTheDocument();
    expect(screen.getByText('Country is required')).toBeInTheDocument();
    expect(screen.getByText('Postal Code is required')).toBeInTheDocument();
    expect(screen.getByText('Select at least one topic')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toHaveAttribute('aria-invalid', 'true');

    await waitFor(() => {
      expect(scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'center',
      });
    });
    expect(scrollIntoView.mock.contexts[0]).toBe(screen.getByLabelText('Title'));
  });

  it('submits a normalized payload, scrolls to the top, and navigates to the saved event', async () => {
    const expectedStartTime = new Date('2026-05-14T17:00').toISOString();
    const expectedEndTime = new Date('2026-05-14T19:00').toISOString();

    mockCreateAdminEvent().mockResolvedValue({
      id: 42,
      title: 'Climate Event',
      summary: 'Short event summary',
      description: 'Full event body',
      website: 'https://example.org/event',
      contactEmail: null,
      publicLocationDescription: null,
      addressLine1: '1 Main St',
      addressLine2: null,
      eventType: 'MEETING',
      startTime: expectedStartTime,
      endTime: expectedEndTime,
      locationName: 'City Hall',
      city: 'Boston',
      region: 'MA',
      country: 'USA',
      postalCode: '02108',
      status: 'PUBLISHED',
      updatedAt: '2026-05-14T20:00:00.000Z',
      publishedAt: '2026-05-14T20:00:00.000Z',
      topicSlugs: ['climate'],
    });

    renderCreateForm();

    const user = await fillValidEventFields();
    await user.click(screen.getByRole('button', { name: 'Create published' }));

    expect(createAdminEvent).toHaveBeenCalledWith({
      title: 'Climate Event',
      summary: 'Short event summary',
      description: 'Full event body',
      eventType: 'MEETING',
      startTime: expectedStartTime,
      endTime: expectedEndTime,
      locationName: 'City Hall',
      publicLocationDescription: null,
      contactEmail: null,
      addressLine1: '1 Main St',
      addressLine2: null,
      city: 'Boston',
      region: 'MA',
      country: 'USA',
      postalCode: '02108',
      website: 'https://example.org/event',
      status: 'PUBLISHED',
      topicSlugs: ['climate'],
    });
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    expect(routerMock.replace).toHaveBeenCalledWith('/admin/events/42', {
      scroll: true,
    });
    expect(routerMock.refresh).toHaveBeenCalled();
  });

  it('maps API validation errors to inline field errors and scrolls to the first invalid field', async () => {
    mockUpdateAdminEvent().mockRejectedValue(
      new SubmissionError('Request failed for events', 400, 'events', [
        { type: 'field', field: 'description', message: 'Body is too long' },
        { type: 'field', field: 'topicSlugs[0]', message: 'Select at least one topic' },
      ]),
    );

    renderEditForm();

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Publish changes' }));

    expect(screen.getByText('Body is too long')).toBeInTheDocument();
    expect(screen.getByText('Select at least one topic')).toBeInTheDocument();

    await waitFor(() => {
      expect(scrollIntoView.mock.contexts[0]).toBe(screen.getByLabelText('Body'));
    });
  });

  it('shows a success banner after updating an event', async () => {
    mockUpdateAdminEvent().mockResolvedValue({
      id: 42,
      title: 'Existing Title',
      summary: 'Existing summary',
      description: 'Existing body',
      website: 'https://example.org/event',
      contactEmail: 'contact@example.org',
      publicLocationDescription: 'Existing guidance',
      addressLine1: '1 Existing St',
      addressLine2: null,
      eventType: 'MEETING',
      startTime: '2026-05-14T17:00:00.000Z',
      endTime: '2026-05-14T19:00:00.000Z',
      locationName: 'Existing Location',
      city: 'Boston',
      region: 'MA',
      country: 'USA',
      postalCode: '02108',
      status: 'PUBLISHED',
      updatedAt: '2026-05-14T20:00:00.000Z',
      publishedAt: '2026-05-14T20:00:00.000Z',
      topicSlugs: ['climate'],
    });

    renderEditForm();

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Publish changes' }));

    expect(updateAdminEvent).toHaveBeenCalledWith(
      42,
      expect.objectContaining({
        title: 'Existing Title',
        summary: 'Existing summary',
        description: 'Existing body',
        eventType: 'MEETING',
        locationName: 'Existing Location',
        status: 'PUBLISHED',
        topicSlugs: ['climate'],
      }),
    );
    expect(screen.getByText('Event saved')).toBeInTheDocument();
    expect(screen.getByText('Event updated and published successfully.')).toBeInTheDocument();
    expect(routerMock.replace).not.toHaveBeenCalled();
    expect(routerMock.refresh).toHaveBeenCalled();
  });

  it('shows API error details for non-validation failures and scrolls to the submit error', async () => {
    mockCreateAdminEvent().mockRejectedValue(
      new ApiError('Internal Server Error', 500, 'admin/events'),
    );

    renderCreateForm();

    const user = await fillValidEventFields();
    await user.click(screen.getByRole('button', { name: 'Create published' }));

    expect(screen.getByText('Save failed (500): Internal Server Error')).toHaveClass('adminError');
    await waitFor(() => {
      expect(scrollIntoView.mock.contexts[0]).toBe(
        screen.getByText('Save failed (500): Internal Server Error'),
      );
    });
  });
});
