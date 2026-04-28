import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SubmissionError } from '@/lib/api/error';
import { postArticleSubmission } from '@/lib/api/submit';

import { ArticleSubmissionForm } from './article-submission';

vi.mock('@/lib/api/submit', () => ({
  postArticleSubmission: vi.fn(),
}));

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

function mockPostArticleSubmission() {
  return vi.mocked(postArticleSubmission);
}

async function fillRequiredArticleFields() {
  const user = userEvent.setup();

  await user.type(screen.getByLabelText('* Title'), '  Climate Basics  ');
  await user.type(screen.getByLabelText('* Summary'), '  Short summary  ');
  await user.click(screen.getByLabelText('Climate'));
  await user.type(screen.getByLabelText('* Content'), '  Full article content  ');

  return user;
}

describe('ArticleSubmissionForm', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('shows required field errors and does not call the API when required fields are empty', async () => {
    const user = userEvent.setup();

    render(<ArticleSubmissionForm topics={topics} />);

    await user.click(screen.getByRole('button', { name: 'Submit Article' }));

    expect(postArticleSubmission).not.toHaveBeenCalled();
    expect(screen.getByText('Title can not be null')).toBeInTheDocument();
    expect(screen.getByText('Summary can not be null')).toBeInTheDocument();
    expect(screen.getByText('Content can not be null')).toBeInTheDocument();
    expect(screen.getByText('Select at least one related topic')).toBeInTheDocument();
  });

  it('submits a normalized article payload and shows the success state', async () => {
    mockPostArticleSubmission().mockResolvedValue({ id: 42 });

    render(<ArticleSubmissionForm topics={topics} />);

    const user = await fillRequiredArticleFields();
    await user.type(screen.getByLabelText('Author (optional)'), '  Jane Author  ');
    await user.type(screen.getByLabelText('Submitter Name (optional)'), '  Sam Submitter  ');
    await user.type(screen.getByLabelText('Submitter Email (optional)'), '  sam@example.org  ');
    await user.type(screen.getByLabelText('Resource link 1'), '  https://example.org/source  ');

    await user.click(screen.getByRole('button', { name: 'Submit Article' }));

    expect(postArticleSubmission).toHaveBeenCalledWith({
      submissionType: 'ARTICLE',
      author: 'Jane Author',
      submitterName: 'Sam Submitter',
      submitterEmail: 'sam@example.org',
      payload: {
        title: 'Climate Basics',
        summary: 'Short summary',
        content: 'Full article content',
        topicSlugs: ['climate'],
        resourceLinks: ['https://example.org/source'],
      },
    });
    expect(screen.getByText('Thanks for submitting')).toBeInTheDocument();
    expect(
      screen.getByText('Thanks — your submission has been received and is now pending review.'),
    ).toBeInTheDocument();
  });

  it('maps API validation errors to inline field errors', async () => {
    mockPostArticleSubmission().mockRejectedValue(
      new SubmissionError('Request failed for submissions', 400, 'submissions', [
        { field: 'payload.title', message: 'Title is too short' },
        { field: 'submitterEmail', message: 'Email must be valid' },
      ]),
    );

    render(<ArticleSubmissionForm topics={topics} />);

    const user = await fillRequiredArticleFields();

    await user.click(screen.getByRole('button', { name: 'Submit Article' }));

    expect(screen.getByText('Title is too short')).toBeInTheDocument();
    expect(screen.getByText('Email must be valid')).toBeInTheDocument();
  });

  it('shows the canonical global error for non-validation failures', async () => {
    mockPostArticleSubmission().mockRejectedValue(new Error('Request failed for submissions'));

    render(<ArticleSubmissionForm topics={topics} />);

    const user = await fillRequiredArticleFields();

    await user.click(screen.getByRole('button', { name: 'Submit Article' }));

    expect(
      screen.getByText('Something went wrong while sending your submission. Please try again.'),
    ).toHaveClass('submissionGlobalError');
    expect(screen.getByLabelText('* Title')).toHaveValue('  Climate Basics  ');
  });

  it('supports repeatable resource links and filters blank links from the payload', async () => {
    mockPostArticleSubmission().mockResolvedValue({ id: 42 });

    render(<ArticleSubmissionForm topics={topics} />);

    const user = await fillRequiredArticleFields();
    await user.type(screen.getByLabelText('Resource link 1'), '  https://example.org/one  ');
    await user.click(screen.getByRole('button', { name: 'Add Another Resource' }));
    await user.type(screen.getByLabelText('Resource link 2'), '     ');

    await user.click(screen.getByRole('button', { name: 'Submit Article' }));

    expect(postArticleSubmission).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({
          resourceLinks: ['https://example.org/one'],
        }),
      }),
    );
  });

  it('removes resource link rows before submit', async () => {
    mockPostArticleSubmission().mockResolvedValue({ id: 42 });

    render(<ArticleSubmissionForm topics={topics} />);

    const user = await fillRequiredArticleFields();
    await user.type(screen.getByLabelText('Resource link 1'), 'https://example.org/removed');
    await user.click(screen.getByRole('button', { name: 'Add Another Resource' }));
    await user.type(screen.getByLabelText('Resource link 2'), 'https://example.org/kept');
    await user.click(screen.getAllByRole('button', { name: 'Remove' })[0]);

    await user.click(screen.getByRole('button', { name: 'Submit Article' }));

    expect(postArticleSubmission).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({
          resourceLinks: ['https://example.org/kept'],
        }),
      }),
    );
  });
});
