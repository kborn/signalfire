import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SubmissionError } from '@/lib/api/error';
import { createAdminAction, updateAdminAction } from '@/lib/api/admin';

import ActionEditorForm from './ActionEditorForm';

const routerMock = vi.hoisted(() => ({
  replace: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => routerMock,
}));

vi.mock('@/lib/api/admin', () => ({
  createAdminAction: vi.fn(),
  updateAdminAction: vi.fn(),
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
    description: 'Climate policy and environmental action.',
  },
  {
    id: 2,
    slug: 'democracy',
    name: 'Democracy',
    description: 'Voting rights and democratic institutions.',
  },
];

function mockCreateAdminAction() {
  return vi.mocked(createAdminAction);
}

function mockUpdateAdminAction() {
  return vi.mocked(updateAdminAction);
}

function renderCreateForm() {
  return render(
    <ActionEditorForm
      mode="create"
      topics={topics}
      initialValues={{
        slug: '',
        title: '',
        summary: '',
        description: '',
        actionType: 'GUIDE',
        status: 'DRAFT',
        topicSlugs: [],
      }}
    />,
  );
}

function renderEditForm() {
  return render(
    <ActionEditorForm
      mode="edit"
      topics={topics}
      initialValues={{
        slug: 'community-action',
        title: 'Existing Title',
        summary: 'Existing summary',
        description: 'Existing description',
        actionType: 'CONTACT',
        status: 'DRAFT',
        topicSlugs: ['climate'],
      }}
    />,
  );
}

async function fillValidActionFields() {
  const user = userEvent.setup();

  await user.type(screen.getByLabelText('Title'), '  Climate Action  ');
  await user.type(screen.getByLabelText('Summary'), '  Short action summary  ');
  await user.type(screen.getByLabelText('Description'), '  Full action description  ');
  await user.selectOptions(screen.getByLabelText('Action type'), 'CONTACT');
  await user.selectOptions(screen.getByLabelText('Status'), 'PUBLISHED');
  await user.click(screen.getByLabelText('Climate'));

  return user;
}

describe('ActionEditorForm', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('shows local validation errors and scrolls to the first invalid field', async () => {
    const user = userEvent.setup();

    renderCreateForm();

    await user.click(screen.getByRole('button', { name: 'Save action' }));

    expect(createAdminAction).not.toHaveBeenCalled();
    expect(screen.getByText('Title is required')).toBeInTheDocument();
    expect(screen.getByText('Summary is required')).toBeInTheDocument();
    expect(screen.getByText('Description is required')).toBeInTheDocument();
    expect(screen.getByText('Select at least one topic')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText('Title')).toHaveAttribute(
      'aria-describedby',
      'action-title-error',
    );

    await waitFor(() => {
      expect(scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'center',
      });
    });
    expect(scrollIntoView.mock.contexts[0]).toBe(screen.getByLabelText('Title'));
  });

  it('submits a normalized payload, scrolls to the top, and navigates to the saved action', async () => {
    mockCreateAdminAction().mockResolvedValue({
      id: 42,
      slug: 'climate-action',
      title: 'Climate Action',
      summary: 'Short action summary',
      description: 'Full action description',
      actionType: 'CONTACT',
      status: 'PUBLISHED',
      updatedAt: '2026-01-01T12:00:00.000Z',
      publishedAt: '2026-01-01T12:00:00.000Z',
      topicSlugs: ['climate'],
    });

    renderCreateForm();

    const user = await fillValidActionFields();
    await user.click(screen.getByRole('button', { name: 'Save action' }));

    expect(createAdminAction).toHaveBeenCalledWith({
      title: 'Climate Action',
      summary: 'Short action summary',
      description: 'Full action description',
      actionType: 'CONTACT',
      status: 'PUBLISHED',
      topicSlugs: ['climate'],
    });
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    expect(routerMock.replace).toHaveBeenCalledWith('/admin/actions/climate-action', {
      scroll: true,
    });
    expect(routerMock.refresh).toHaveBeenCalled();
  });

  it('maps API validation errors to inline field errors and scrolls to the first invalid field', async () => {
    mockUpdateAdminAction().mockRejectedValue(
      new SubmissionError('Request failed for actions', 400, 'actions', [
        { type: 'field', field: 'description', message: 'Description is too long' },
        { type: 'field', field: 'topicSlugs[0]', message: 'Select at least one topic' },
      ]),
    );

    renderEditForm();

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(screen.getByText('Description is too long')).toBeInTheDocument();
    expect(screen.getByText('Select at least one topic')).toBeInTheDocument();

    await waitFor(() => {
      expect(scrollIntoView.mock.contexts[0]).toBe(screen.getByLabelText('Description'));
    });
  });
});
