'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  type ActionType,
  type AdminActionDetailResponse,
  type EntityStatus,
  type TopicSummary,
} from '@signal-fire/api-contracts';
import { formatActionTypeLabel } from '@/lib/common/utils';
import { ApiError, SubmissionError } from '@/lib/api/error';
import { createAdminAction, updateAdminAction } from '@/lib/api/admin';
import {
  mapSubmissionApiErrors,
  SUBMISSION_FIELD_LIMITS,
  validateRequiredString,
} from '@/lib/submission-form-validation';
import { useRouter } from 'next/navigation';
import { withAdminAuthClientRedirect } from '@/lib/admin/auth-redirect.client';

const ACTION_TYPES: ActionType[] = ['GUIDE', 'LINK', 'CONTACT', 'DONATE', 'VOLUNTEER'];

type ActionEditorInitialValues = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  actionType: ActionType;
  topicSlugs: string[];
};

type ActionEditorFormProps = {
  mode: 'create' | 'edit';
  initialValues: ActionEditorInitialValues;
  topics: TopicSummary[];
};

type ActionEditorFormErrors = {
  title?: string;
  summary?: string;
  description?: string;
  actionType?: string;
  topicSlugs?: string;
};

const actionEditorErrorFieldOrder: Array<keyof ActionEditorFormErrors> = [
  'title',
  'summary',
  'description',
  'actionType',
  'topicSlugs',
];

function getScrollBehavior(): ScrollBehavior {
  if (typeof window.matchMedia !== 'function') {
    return 'smooth';
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}

function focusAndScrollTo(id: string) {
  const element = document.getElementById(id);
  if (!(element instanceof HTMLElement)) {
    return;
  }

  element.focus({ preventScroll: true });
  element.scrollIntoView({
    behavior: getScrollBehavior(),
    block: 'center',
  });
}

function mapAdminApiFieldToUiField(field: string): keyof ActionEditorFormErrors | null {
  const normalizedField = field.startsWith('payload.') ? field.slice('payload.'.length) : field;

  if (normalizedField.startsWith('topicSlugs[')) {
    return 'topicSlugs';
  }

  switch (normalizedField) {
    case 'title':
    case 'summary':
    case 'description':
    case 'actionType':
    case 'topicSlugs':
      return normalizedField;
    default:
      return null;
  }
}

function getActionControlId(field: keyof ActionEditorFormErrors, topics: TopicSummary[]): string {
  if (field === 'topicSlugs') {
    return topics[0] ? `action-topic-${topics[0].slug}` : 'action-topic-group';
  }

  return `action-${field}`;
}

function getActionFieldA11y(
  field: keyof ActionEditorFormErrors,
  errors: ActionEditorFormErrors,
  helperId?: string,
) {
  const describedBy = [helperId, errors[field] ? `action-${field}-error` : null]
    .filter(Boolean)
    .join(' ');

  return {
    'aria-describedby': describedBy || undefined,
    'aria-invalid': errors[field] ? true : undefined,
  };
}

function parseApiError(error: unknown): string {
  if (error instanceof SubmissionError && error.errors?.length) {
    return error.errors[0].message;
  }

  if (error instanceof ApiError) {
    return `Save failed (${error.status}): ${error.message}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Save failed due to an unexpected error.';
}

function getSubmitStatus(event: FormEvent<HTMLFormElement>): EntityStatus {
  const submitter = event.nativeEvent instanceof SubmitEvent ? event.nativeEvent.submitter : null;
  const action = submitter?.getAttribute('value');

  return action === 'publish' ? 'PUBLISHED' : 'DRAFT';
}

export default function ActionEditorForm({ mode, initialValues, topics }: ActionEditorFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialValues.title);
  const [summary, setSummary] = useState(initialValues.summary);
  const [description, setDescription] = useState(initialValues.description);
  const [actionType, setActionType] = useState<ActionType>(initialValues.actionType);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(initialValues.topicSlugs);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [errors, setErrors] = useState<ActionEditorFormErrors>({});

  const selectedTopicSet = useMemo(() => new Set(selectedTopics), [selectedTopics]);

  useEffect(() => {
    const firstErrorField = actionEditorErrorFieldOrder.find((field) => errors[field]);
    if (firstErrorField) {
      focusAndScrollTo(getActionControlId(firstErrorField, topics));
      return;
    }

    if (saveError) {
      focusAndScrollTo('action-submit-error');
    }
  }, [errors, saveError, topics]);

  function toggleTopic(topicSlug: string) {
    setSelectedTopics((current) =>
      current.includes(topicSlug)
        ? current.filter((item) => item !== topicSlug)
        : [...current, topicSlug],
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaveError(null);
    setSaveSuccess(null);
    setErrors({});

    const nextStatus = getSubmitStatus(event);

    const normalizedTitle = title.trim();
    const normalizedSummary = summary.trim();
    const normalizedDescription = description.trim();

    const nextErrors: ActionEditorFormErrors = {};
    const titleError = validateRequiredString(
      normalizedTitle,
      'Title',
      SUBMISSION_FIELD_LIMITS.title,
    );
    if (titleError) {
      nextErrors.title = titleError;
    }

    const summaryError = validateRequiredString(
      normalizedSummary,
      'Summary',
      SUBMISSION_FIELD_LIMITS.summary,
    );
    if (summaryError) {
      nextErrors.summary = summaryError;
    }

    const descriptionError = validateRequiredString(
      normalizedDescription,
      'Description',
      SUBMISSION_FIELD_LIMITS.description,
    );
    if (descriptionError) {
      nextErrors.description = descriptionError;
    }

    if (!actionType) {
      nextErrors.actionType = 'Action type is required';
    }

    if (selectedTopics.length === 0) {
      nextErrors.topicSlugs = 'Select at least one topic';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const payload = {
      title: normalizedTitle,
      summary: normalizedSummary,
      description: normalizedDescription,
      actionType,
      status: nextStatus,
      topicSlugs: selectedTopics,
    };

    setIsSaving(true);
    try {
      let result: AdminActionDetailResponse;
      if (mode === 'create') {
        result = await withAdminAuthClientRedirect(router, async () => createAdminAction(payload));
      } else {
        result = await withAdminAuthClientRedirect(router, async () =>
          updateAdminAction(initialValues.slug, payload),
        );
      }

      window.scrollTo({ top: 0, behavior: getScrollBehavior() });
      if (mode === 'create') {
        router.replace(`/admin/actions/${result.slug}`, { scroll: true });
        router.refresh();
      } else {
        setSaveSuccess(
          result.status === 'PUBLISHED'
            ? 'Action updated and published successfully.'
            : 'Action updated and saved as draft.',
        );
        router.refresh();
      }
    } catch (error) {
      if (error instanceof SubmissionError) {
        const { fieldErrors, formError } = mapSubmissionApiErrors(
          error.errors,
          mapAdminApiFieldToUiField,
        );

        if (Object.keys(fieldErrors).length > 0) {
          setErrors(fieldErrors as ActionEditorFormErrors);
        }

        if (formError) {
          setSaveError(formError);
        } else if (Object.keys(fieldErrors).length === 0) {
          setSaveError(parseApiError(error));
        }
      } else {
        setSaveError(parseApiError(error));
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="submissionForm actionEditorForm" onSubmit={handleSubmit} noValidate>
      <section className="adminPanel">
        <div className="adminPanelHeader">
          <h2>{mode === 'create' ? 'Create action' : 'Edit action'}</h2>
        </div>

        {saveSuccess ? (
          <div className="adminReviewBanner actionEditorSuccessBanner" role="status">
            <p className="adminReviewBannerTitle">Action saved</p>
            <p className="adminReviewBannerText">{saveSuccess}</p>
          </div>
        ) : null}

        <div className="actionEditorLayout">
          <div className="actionEditorTopRow">
            <div className="actionEditorMainColumn">
              <section className="submissionField actionEditorTitleField">
                <label className="submissionLabel" htmlFor="action-title">
                  Title
                </label>
                <input
                  id="action-title"
                  className="submissionControl"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  {...getActionFieldA11y('title', errors)}
                  required
                />
                {errors.title ? (
                  <p id="action-title-error" className="submissionError">
                    {errors.title}
                  </p>
                ) : null}
              </section>

              <section className="submissionField actionEditorSummaryField">
                <label className="submissionLabel" htmlFor="action-summary">
                  Summary
                </label>
                <textarea
                  id="action-summary"
                  className="submissionTextarea actionEditorTextareaSummary"
                  value={summary}
                  rows={7}
                  onChange={(event) => setSummary(event.target.value)}
                  {...getActionFieldA11y('summary', errors)}
                  required
                />
                {errors.summary ? (
                  <p id="action-summary-error" className="submissionError">
                    {errors.summary}
                  </p>
                ) : null}
              </section>
            </div>

            <aside className="actionEditorSidebar" aria-label="Action settings">
              <section className="submissionField">
                <label className="submissionLabel" htmlFor="action-type">
                  Action type
                </label>
                <select
                  id="action-type"
                  className="submissionControl"
                  value={actionType}
                  onChange={(event) => setActionType(event.target.value as ActionType)}
                  {...getActionFieldA11y('actionType', errors)}
                  required
                >
                  {ACTION_TYPES.map((item) => (
                    <option key={item} value={item}>
                      {formatActionTypeLabel(item)}
                    </option>
                  ))}
                </select>
                {errors.actionType ? (
                  <p id="action-actionType-error" className="submissionError">
                    {errors.actionType}
                  </p>
                ) : null}
              </section>

              <fieldset
                id="action-topic-group"
                className="submissionCheckboxGroup"
                tabIndex={-1}
                {...getActionFieldA11y('topicSlugs', errors)}
              >
                <legend className="submissionLabel">Topics</legend>
                {topics.length === 0 ? (
                  <p>No topics are available to assign.</p>
                ) : (
                  <div className="adminTopicGrid">
                    {topics.map((topic) => (
                      <label key={topic.slug} className="submissionCheckboxOption">
                        <input
                          id={`action-topic-${topic.slug}`}
                          type="checkbox"
                          checked={selectedTopicSet.has(topic.slug)}
                          onChange={() => toggleTopic(topic.slug)}
                        />
                        <span>{topic.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </fieldset>
              {errors.topicSlugs ? (
                <p id="action-topicSlugs-error" className="submissionError">
                  {errors.topicSlugs}
                </p>
              ) : null}
            </aside>
          </div>

          <section className="submissionField actionEditorDescriptionField">
            <label className="submissionLabel" htmlFor="action-description">
              Description
            </label>
            <textarea
              id="action-description"
              className="submissionTextarea actionEditorTextareaDescription"
              value={description}
              rows={18}
              onChange={(event) => setDescription(event.target.value)}
              {...getActionFieldA11y('description', errors)}
              required
            />
            {errors.description ? (
              <p id="action-description-error" className="submissionError">
                {errors.description}
              </p>
            ) : null}
          </section>
        </div>

        <div className="actionEditorFooter">
          {saveError ? (
            <p id="action-submit-error" className="adminError" tabIndex={-1}>
              {saveError}
            </p>
          ) : null}
          <div className="actionEditorFooterActions">
            <button
              className="primaryCTA"
              type="submit"
              name="status"
              value="publish"
              disabled={isSaving}
            >
              {mode === 'create' ? 'Create published' : 'Publish changes'}
            </button>
            <button
              className="primaryCTA"
              type="submit"
              name="status"
              value="draft"
              disabled={isSaving}
            >
              {mode === 'create' ? 'Create draft' : 'Save draft'}
            </button>
          </div>
        </div>
      </section>
    </form>
  );
}
