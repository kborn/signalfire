import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SubmissionError } from '@/lib/api/error';
import { postEventSubmission } from '@/lib/api/submit';

import { EventSubmissionForm } from './event-submission';

vi.mock('@/lib/api/submit', () => ({
  postEventSubmission: vi.fn(),
}));

const scrollIntoView = vi.fn();

Object.defineProperty(Element.prototype, 'scrollIntoView', {
  configurable: true,
  value: scrollIntoView,
});

const topics = [
  {
    id: 1,
    slug: 'climate',
    name: 'Climate',
    description: 'Climate policy and environmental action.',
  },
  {
    id: 2,
    slug: 'democracy',
    name: 'Democracy',
    description: 'Voting rights and democratic institutions.',
  },
];

function mockPostEventSubmission() {
  return vi.mocked(postEventSubmission);
}

async function fillRequiredEventFields() {
  const user = userEvent.setup();

  await user.type(screen.getByLabelText('* Title'), '  Transit Rally  ');
  await user.type(screen.getByLabelText('* Summary'), '  Short event summary  ');
  await user.type(screen.getByLabelText('* Description'), '  Full event description  ');
  await user.selectOptions(screen.getByLabelText('* Event Type'), 'RALLY');
  await user.type(screen.getByLabelText('* Start date and time'), '2026-05-14T17:00');
  await user.type(screen.getByLabelText('* Location Name'), '  City Hall Plaza  ');
  await user.type(screen.getByLabelText('* City'), '  Philadelphia  ');
  await user.selectOptions(screen.getByLabelText('* Region'), 'PA');
  await user.type(screen.getByLabelText('* ZIP Code'), '  19107  ');
  await user.click(screen.getByLabelText('Climate'));

  return user;
}

describe('EventSubmissionForm', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('shows required field errors and does not call the API when required fields are empty', async () => {
    const user = userEvent.setup();

    render(<EventSubmissionForm topics={topics} />);

    await user.click(screen.getByRole('button', { name: 'Submit Event' }));

    expect(postEventSubmission).not.toHaveBeenCalled();
    expect(screen.getByText('Title is required')).toBeInTheDocument();
    expect(screen.getByText('Summary is required')).toBeInTheDocument();
    expect(screen.getByText('Description is required')).toBeInTheDocument();
    expect(screen.getByText('Event type is required')).toBeInTheDocument();
    expect(screen.getByText('Start date and time is required')).toBeInTheDocument();
    expect(screen.getByText('Location name is required')).toBeInTheDocument();
    expect(screen.getByText('Location address city is required')).toBeInTheDocument();
    expect(screen.getByText('Location address region is required')).toBeInTheDocument();
    expect(screen.getByText('Postal Code is required')).toBeInTheDocument();
    expect(screen.getByText('Select at least one related topic')).toBeInTheDocument();
    await waitFor(() => {
      expect(scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'center',
      });
    });
    expect(scrollIntoView.mock.contexts[0]).toBe(screen.getByText('Title is required'));
  });

  it('defaults country to US and keeps it disabled', () => {
    render(<EventSubmissionForm topics={topics} />);

    const countryInput = screen.getByLabelText('* Country');

    expect(countryInput).toHaveValue('US');
    expect(countryInput).toBeDisabled();
  });

  it('submits a normalized event payload and shows the success state', async () => {
    mockPostEventSubmission().mockResolvedValue({ id: 42 });

    render(<EventSubmissionForm topics={topics} />);

    const user = await fillRequiredEventFields();
    await user.type(screen.getByLabelText('End date and time (optional)'), '2026-05-14T19:00');
    await user.type(screen.getByLabelText('Location Description (optional)'), '  Liberty Plaza  ');
    await user.type(screen.getByLabelText('Address Line 1 (optional)'), '  1 Main St  ');
    await user.type(screen.getByLabelText('Address Line 2 (optional)'), '  Ste 1A  ');
    await user.type(screen.getByLabelText('Contact Email (optional)'), '  organizer@example.org  ');
    await user.type(screen.getByLabelText('Name (optional)'), '  Sam Submitter  ');
    await user.type(screen.getByLabelText('Email (optional)'), '  sam@example.org  ');
    await user.type(
      screen.getByLabelText('Website URL (optional)'),
      '  https://example.org/event  ',
    );

    await user.click(screen.getByRole('button', { name: 'Submit Event' }));

    expect(postEventSubmission).toHaveBeenCalledWith({
      submissionType: 'EVENT',
      submitterName: 'Sam Submitter',
      submitterEmail: 'sam@example.org',
      payload: {
        title: 'Transit Rally',
        summary: 'Short event summary',
        description: 'Full event description',
        eventType: 'RALLY',
        startTime: new Date('2026-05-14T17:00').toISOString(),
        endTime: new Date('2026-05-14T19:00').toISOString(),
        locationName: 'City Hall Plaza',
        publicLocationDescription: 'Liberty Plaza',
        locationAddressLine1: '1 Main St',
        locationAddressLine2: 'Ste 1A',
        locationAddressCity: 'Philadelphia',
        locationAddressRegion: 'PA',
        locationAddressCountry: 'US',
        locationAddressZip: '19107',
        contactEmail: 'organizer@example.org',
        topicSlugs: ['climate'],
        websiteUrl: 'https://example.org/event',
      },
    });
    expect(screen.getByText('Thanks for submitting')).toBeInTheDocument();
  });

  it('maps API validation errors to inline event field errors', async () => {
    mockPostEventSubmission().mockRejectedValue(
      new SubmissionError('Request failed for submissions', 400, 'submissions', [
        { type: 'field', field: 'payload.endTime', message: 'End datetime must be valid' },
        {
          type: 'field',
          field: 'payload.locationAddressLine2',
          message: 'Address line 2 is invalid',
        },
        {
          type: 'field',
          field: 'payload.locationAddressZip',
          message: 'Must be 32 characters or fewer',
        },
        { type: 'field', field: 'payload.contactEmail', message: 'Email must be valid' },
      ]),
    );

    render(<EventSubmissionForm topics={topics} />);

    const user = await fillRequiredEventFields();
    await user.type(screen.getByLabelText('End date and time (optional)'), '2026-05-14T19:00');
    await user.type(screen.getByLabelText('Contact Email (optional)'), 'organizer@example.org');

    await user.click(screen.getByRole('button', { name: 'Submit Event' }));

    expect(screen.getByText('End datetime must be valid')).toBeInTheDocument();
    expect(screen.getByText('Address line 2 is invalid')).toBeInTheDocument();
    expect(screen.getByText('Must be 32 characters or fewer')).toBeInTheDocument();
    expect(screen.getByText('Email must be valid')).toBeInTheDocument();
    await waitFor(() => {
      expect(scrollIntoView.mock.contexts[0]).toBe(screen.getByText('End datetime must be valid'));
    });
  });

  it('renders fieldless API validation errors as submit-level errors', async () => {
    mockPostEventSubmission().mockRejectedValue(
      new SubmissionError('Request failed for submissions', 400, 'submissions', [
        { type: 'form', message: 'Submission intake is temporarily unavailable.' },
      ]),
    );

    render(<EventSubmissionForm topics={topics} />);

    const user = await fillRequiredEventFields();

    await user.click(screen.getByRole('button', { name: 'Submit Event' }));

    expect(screen.getByText('Submission intake is temporarily unavailable.')).toHaveClass(
      'submissionGlobalError',
    );
  });

  it('shows inline client validation when end time is before start time', async () => {
    render(<EventSubmissionForm topics={topics} />);

    const user = await fillRequiredEventFields();
    await user.type(screen.getByLabelText('End date and time (optional)'), '2026-05-14T16:00');

    await user.click(screen.getByRole('button', { name: 'Submit Event' }));

    expect(postEventSubmission).not.toHaveBeenCalled();
    expect(
      screen.getByText('End date and time must be after the start date and time'),
    ).toBeInTheDocument();
  });

  it('shows the canonical global error for non-validation failures', async () => {
    mockPostEventSubmission().mockRejectedValue(new Error('Request failed for submissions'));

    render(<EventSubmissionForm topics={topics} />);

    const user = await fillRequiredEventFields();

    await user.click(screen.getByRole('button', { name: 'Submit Event' }));

    expect(
      screen.getByText('Something went wrong while sending your submission. Please try again.'),
    ).toHaveClass('submissionGlobalError');
    await waitFor(() => {
      expect(scrollIntoView.mock.contexts[0]).toBe(
        screen.getByText('Something went wrong while sending your submission. Please try again.'),
      );
    });
    expect(screen.getByLabelText('* Title')).toHaveValue('  Transit Rally  ');
  });

  it('validates optional event email fields on the client before submit', async () => {
    render(<EventSubmissionForm topics={topics} />);

    const user = await fillRequiredEventFields();
    await user.type(screen.getByLabelText('Contact Email (optional)'), 'not-an-email');

    await user.click(screen.getByRole('button', { name: 'Submit Event' }));

    expect(postEventSubmission).not.toHaveBeenCalled();
    expect(screen.getByText('Email must be valid')).toBeInTheDocument();
  });

  it('requires a postal code on the client before submit', async () => {
    render(<EventSubmissionForm topics={topics} />);

    const user = await fillRequiredEventFields();
    await user.clear(screen.getByLabelText('* ZIP Code'));

    await user.click(screen.getByRole('button', { name: 'Submit Event' }));

    expect(postEventSubmission).not.toHaveBeenCalled();
    expect(screen.getByText('Postal Code is required')).toBeInTheDocument();
  });
});
