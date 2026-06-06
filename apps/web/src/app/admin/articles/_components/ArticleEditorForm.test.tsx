import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ApiError, SubmissionError } from '@/lib/api/error';
import { createAdminArticle, updateAdminArticle } from '@/lib/api/admin';

import ArticleEditorForm from './ArticleEditorForm';

const routerMock = vi.hoisted(() => ({
  replace: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => routerMock,
}));

vi.mock('@/lib/api/admin', () => ({
  createAdminArticle: vi.fn(),
  updateAdminArticle: vi.fn(),
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
    description: 'Climate policy and environmental article.',
  },
  {
    id: 2,
    slug: 'democracy',
    name: 'Democracy',
    description: 'Voting rights and democratic institutions.',
  },
];

function mockCreateAdminArticle() {
  return vi.mocked(createAdminArticle);
}

function mockUpdateAdminArticle() {
  return vi.mocked(updateAdminArticle);
}

function renderCreateForm() {
  return render(
    <ArticleEditorForm
      mode="create"
      topics={topics}
      initialValues={{
        slug: '',
        title: '',
        summary: '',
        content: '',
        author: '',
        topicSlugs: [],
      }}
    />,
  );
}

function renderEditForm() {
  return render(
    <ArticleEditorForm
      mode="edit"
      topics={topics}
      initialValues={{
        slug: 'community-article',
        title: 'Existing Title',
        summary: 'Existing summary',
        content: 'Existing content',
        author: 'Existing author',
        topicSlugs: ['climate'],
      }}
    />,
  );
}

async function fillValidArticleFields() {
  const user = userEvent.setup();

  await user.type(screen.getByLabelText('Title'), '  Climate Article  ');
  await user.type(screen.getByLabelText('Summary'), '  Short article summary  ');
  await user.type(screen.getByLabelText('Description'), '  Full article description  ');
  await user.selectOptions(screen.getByLabelText('Article type'), 'CONTACT');
  await user.click(screen.getByLabelText('Climate'));

  return user;
}

describe('ArticleEditorForm', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('shows local validation errors and scrolls to the first invalid field', async () => {
    const user = userEvent.setup();

    renderCreateForm();

    await user.click(screen.getByRole('button', { name: 'Create published' }));

    expect(createAdminArticle).not.toHaveBeenCalled();
    expect(screen.getByText('Title is required')).toBeInTheDocument();
    expect(screen.getByText('Summary is required')).toBeInTheDocument();
    expect(screen.getByText('Description is required')).toBeInTheDocument();
    expect(screen.getByText('Select at least one topic')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText('Title')).toHaveAttribute(
      'aria-describedby',
      'article-title-error',
    );

    await waitFor(() => {
      expect(scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'center',
      });
    });
    expect(scrollIntoView.mock.contexts[0]).toBe(screen.getByLabelText('Title'));
  });

  it('submits a normalized payload, scrolls to the top, and navigates to the saved article', async () => {
    mockCreateAdminArticle().mockResolvedValue({
      id: 42,
      slug: 'climate-article',
      title: 'Climate Article',
      summary: 'Short article summary',
      content: 'Full article content',
      author: 'John Smith',
      status: 'PUBLISHED',
      updatedAt: '2026-01-01T12:00:00.000Z',
      publishedAt: '2026-01-01T12:00:00.000Z',
      topicSlugs: ['climate'],
    });

    renderCreateForm();

    const user = await fillValidArticleFields();
    await user.click(screen.getByRole('button', { name: 'Create published' }));

    expect(createAdminArticle).toHaveBeenCalledWith({
      title: 'Climate Article',
      summary: 'Short article summary',
      description: 'Full article description',
      articleType: 'CONTACT',
      status: 'PUBLISHED',
      topicSlugs: ['climate'],
    });
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    expect(routerMock.replace).toHaveBeenCalledWith('/admin/articles/climate-article', {
      scroll: true,
    });
    expect(routerMock.refresh).toHaveBeenCalled();
  });

  it('maps API validation errors to inline field errors and scrolls to the first invalid field', async () => {
    mockUpdateAdminArticle().mockRejectedValue(
      new SubmissionError('Request failed for articles', 400, 'articles', [
        { type: 'field', field: 'description', message: 'Description is too long' },
        { type: 'field', field: 'topicSlugs[0]', message: 'Select at least one topic' },
      ]),
    );

    renderEditForm();

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Publish changes' }));

    expect(screen.getByText('Description is too long')).toBeInTheDocument();
    expect(screen.getByText('Select at least one topic')).toBeInTheDocument();

    await waitFor(() => {
      expect(scrollIntoView.mock.contexts[0]).toBe(screen.getByLabelText('Description'));
    });
  });

  it('shows a success banner after updating an article', async () => {
    mockUpdateAdminArticle().mockResolvedValue({
      id: 42,
      slug: 'community-article',
      title: 'Existing Title',
      summary: 'Existing summary',
      content: 'Existing description',
      author: 'John Smith',
      status: 'PUBLISHED',
      updatedAt: '2026-01-02T12:00:00.000Z',
      publishedAt: '2026-01-02T12:00:00.000Z',
      topicSlugs: ['climate'],
    });

    renderEditForm();

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Publish changes' }));

    expect(updateAdminArticle).toHaveBeenCalledWith('community-article', {
      title: 'Existing Title',
      summary: 'Existing summary',
      description: 'Existing description',
      articleType: 'CONTACT',
      status: 'PUBLISHED',
      topicSlugs: ['climate'],
    });
    expect(screen.getByText('Article saved')).toBeInTheDocument();
    expect(screen.getByText('Article updated and published successfully.')).toBeInTheDocument();
    expect(routerMock.replace).not.toHaveBeenCalled();
    expect(routerMock.refresh).toHaveBeenCalled();
  });

  it('shows API error details for non-validation failures and scrolls to the submit error', async () => {
    mockCreateAdminArticle().mockRejectedValue(
      new ApiError('Internal Server Error', 500, 'admin/articles'),
    );

    renderCreateForm();

    const user = await fillValidArticleFields();
    await user.click(screen.getByRole('button', { name: 'Create published' }));

    expect(screen.getByText('Save failed (500): Internal Server Error')).toHaveClass('adminError');
    await waitFor(() => {
      expect(scrollIntoView.mock.contexts[0]).toBe(
        screen.getByText('Save failed (500): Internal Server Error'),
      );
    });
  });
});
