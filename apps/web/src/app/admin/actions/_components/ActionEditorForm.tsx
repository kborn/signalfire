'use client';

import { FormEvent, useMemo, useState } from 'react';
import {
  type ActionType,
  type AdminActionDetailResponse,
  type EntityStatus,
  type TopicSummary,
} from '@signal-fire/api-contracts';
import { formatActionTypeLabel } from '@/lib/common/utils';
import { ApiError, SubmissionError } from '@/lib/api/error';
import { createAdminAction, updateAdminAction } from '@/lib/api/admin';
import { useRouter } from 'next/navigation';

const ACTION_TYPES: ActionType[] = ['GUIDE', 'LINK', 'CONTACT', 'DONATE', 'VOLUNTEER'];
const STATUS_OPTIONS: EntityStatus[] = ['DRAFT', 'PUBLISHED'];

type ActionEditorInitialValues = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  actionType: ActionType;
  status: EntityStatus;
  topicSlugs: string[];
};

type ActionEditorFormProps = {
  mode: 'create' | 'edit';
  initialValues: ActionEditorInitialValues;
  topics: TopicSummary[];
};

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

export default function ActionEditorForm({ mode, initialValues, topics }: ActionEditorFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialValues.title);
  const [summary, setSummary] = useState(initialValues.summary);
  const [description, setDescription] = useState(initialValues.description);
  const [actionType, setActionType] = useState<ActionType>(initialValues.actionType);
  const [status, setStatus] = useState<EntityStatus>(initialValues.status);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(initialValues.topicSlugs);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const selectedTopicSet = useMemo(() => new Set(selectedTopics), [selectedTopics]);

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

    if (selectedTopics.length === 0) {
      setSaveError('Select at least one topic before saving.');
      return;
    }

    const payload = {
      title,
      summary,
      description,
      actionType,
      status,
      topicSlugs: selectedTopics,
    };

    setIsSaving(true);
    try {
      let result: AdminActionDetailResponse;
      if (mode === 'create') {
        result = await createAdminAction(payload);
      } else {
        result = await updateAdminAction(initialValues.slug, payload);
      }

      router.replace(`/admin/actions/${result.slug}`);
      router.refresh();
    } catch (error) {
      setSaveError(parseApiError(error));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="submissionForm actionEditorForm" onSubmit={handleSubmit}>
      <section className="adminPanel">
        <div className="adminPanelHeader">
          <h2>{mode === 'create' ? 'Create action' : 'Edit action'}</h2>
        </div>

        <div className="actionEditorLayout">
          <div className="actionEditorMain">
            <label className="submissionLabel">
              Title
              <input
                className="submissionControl"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
              />
            </label>

            <label className="submissionLabel">
              Summary
              <textarea
                className="submissionTextarea actionEditorTextareaSummary"
                value={summary}
                rows={7}
                onChange={(event) => setSummary(event.target.value)}
                required
              />
            </label>

            <label className="submissionLabel">
              Description
              <textarea
                className="submissionTextarea actionEditorTextareaDescription"
                value={description}
                rows={18}
                onChange={(event) => setDescription(event.target.value)}
                required
              />
            </label>
          </div>

          <aside className="actionEditorSidebar" aria-label="Action settings">
            <label className="submissionLabel">
              Action type
              <select
                className="submissionControl"
                value={actionType}
                onChange={(event) => setActionType(event.target.value as ActionType)}
                required
              >
                {ACTION_TYPES.map((item) => (
                  <option key={item} value={item}>
                    {formatActionTypeLabel(item)}
                  </option>
                ))}
              </select>
            </label>

            <label className="submissionLabel">
              Status
              <select
                className="submissionControl"
                value={status}
                onChange={(event) => setStatus(event.target.value as EntityStatus)}
                required
              >
                {STATUS_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item === 'DRAFT' ? 'Draft' : 'Published'}
                  </option>
                ))}
              </select>
            </label>

            <fieldset className="submissionCheckboxGroup">
              <legend className="submissionLabel">Topics</legend>
              {topics.length === 0 ? (
                <p>No topics are available to assign.</p>
              ) : (
                <div className="adminTopicGrid">
                  {topics.map((topic) => (
                    <label key={topic.slug} className="submissionCheckboxOption">
                      <input
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
          </aside>
        </div>

        <div className="actionEditorFooter">
          {saveError ? <p className="adminError">{saveError}</p> : null}
          <button className="primaryCTA" type="submit" disabled={isSaving}>
            {mode === 'create' ? 'Save action' : 'Save changes'}
          </button>
        </div>
      </section>
    </form>
  );
}
