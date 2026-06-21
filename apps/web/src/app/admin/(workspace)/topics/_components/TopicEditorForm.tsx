'use client';

import { FormEvent, useState } from 'react';
import { type AdminTopicDetailResponse } from '@signal-fire/api-contracts';
import { ApiError, SubmissionError } from '@/lib/api/error';
import { createAdminTopic, updateAdminTopic, deleteAdminTopic } from '@/lib/api/admin';
import { useRouter } from 'next/navigation';
import { withAdminAuthClientRedirect } from '@/lib/admin/auth-redirect.client';

type TopicEditorFormProps = {
  mode: 'create' | 'edit';
  initialValues: { slug: string; name: string; description: string };
  linkedContent?: { articles: number; actions: number; events: number };
};

type FormErrors = { name?: string; description?: string };

export default function TopicEditorForm({
  mode,
  initialValues,
  linkedContent,
}: TopicEditorFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialValues.name);
  const [description, setDescription] = useState(initialValues.description);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const totalLinked =
    (linkedContent?.articles ?? 0) + (linkedContent?.actions ?? 0) + (linkedContent?.events ?? 0);

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!name.trim()) next.name = 'Name is required';
    else if (name.trim().length > 120) next.name = 'Name must be 120 characters or fewer';
    if (!description.trim()) next.description = 'Description is required';
    else if (description.trim().length > 500)
      next.description = 'Description must be 500 characters or fewer';
    return next;
  }

  function parseError(error: unknown): string {
    if (error instanceof SubmissionError && error.errors?.length) {
      return error.errors[0].message;
    }
    if (error instanceof ApiError) return `Save failed (${error.status}): ${error.message}`;
    if (error instanceof Error) return error.message;
    return 'Save failed due to an unexpected error.';
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaveError(null);
    setSaveSuccess(null);
    const next = validate();
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    setErrors({});
    setIsSaving(true);

    try {
      const payload = { name: name.trim(), description: description.trim() };
      let result: AdminTopicDetailResponse;
      if (mode === 'create') {
        result = await withAdminAuthClientRedirect(router, () => createAdminTopic(payload));
        router.replace(`/admin/topics/${result.slug}`);
        router.refresh();
      } else {
        result = await withAdminAuthClientRedirect(router, () =>
          updateAdminTopic(initialValues.slug, payload),
        );
        setSaveSuccess(`"${result.name}" saved.`);
        router.refresh();
      }
    } catch (error) {
      if (error instanceof SubmissionError) {
        const fieldErrors: FormErrors = {};
        for (const e of error.errors ?? []) {
          if ('field' in e && (e.field === 'name' || e.field === 'description')) {
            fieldErrors[e.field] = e.message;
          }
        }
        if (Object.keys(fieldErrors).length > 0) {
          setErrors(fieldErrors);
        } else {
          setSaveError(parseError(error));
        }
      } else {
        setSaveError(parseError(error));
      }
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (
      !confirm(
        `Delete "${name}"? This cannot be undone. The issue must have no linked articles, actions, or events.`,
      )
    )
      return;
    setIsDeleting(true);
    setSaveError(null);
    try {
      await withAdminAuthClientRedirect(router, () => deleteAdminTopic(initialValues.slug));
      router.replace('/admin/topics');
      router.refresh();
    } catch (error) {
      setSaveError(parseError(error));
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <form className="submissionForm articleEditorForm" onSubmit={handleSubmit} noValidate>
      <section className="adminPanel">
        <div className="adminPanelHeader">
          <h2>{mode === 'create' ? 'Create issue' : 'Edit issue'}</h2>
          {mode === 'edit' && (
            <p className="adminDek">
              Slug: <code>{initialValues.slug}</code> — immutable after creation.
            </p>
          )}
        </div>

        {saveSuccess && (
          <div className="adminReviewBanner actionEditorSuccessBanner" role="status">
            <p className="adminReviewBannerText">{saveSuccess}</p>
          </div>
        )}

        <section className="submissionField">
          <label className="submissionLabel" htmlFor="topic-name">
            Name
          </label>
          <input
            id="topic-name"
            className="submissionControl"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? 'topic-name-error' : undefined}
            required
          />
          {errors.name && (
            <p id="topic-name-error" className="submissionError">
              {errors.name}
            </p>
          )}
        </section>

        <section className="submissionField">
          <label className="submissionLabel" htmlFor="topic-description">
            Description
          </label>
          <textarea
            id="topic-description"
            className="submissionTextarea"
            value={description}
            rows={4}
            onChange={(e) => setDescription(e.target.value)}
            aria-invalid={errors.description ? true : undefined}
            aria-describedby={errors.description ? 'topic-description-error' : undefined}
            required
          />
          {errors.description && (
            <p id="topic-description-error" className="submissionError">
              {errors.description}
            </p>
          )}
        </section>

        <div className="actionEditorFooter">
          {saveError && (
            <p className="adminError" role="alert">
              {saveError}
            </p>
          )}
          <div className="actionEditorFooterActions">
            {mode === 'edit' && (
              <button
                type="button"
                className="primaryCTA"
                style={{
                  background:
                    isDeleting || totalLinked > 0
                      ? 'var(--color-border-subtle)'
                      : 'var(--color-status-error)',
                }}
                onClick={handleDelete}
                disabled={isDeleting || totalLinked > 0}
              >
                {isDeleting ? 'Deleting…' : 'Delete Issue'}
              </button>
            )}
            <button type="submit" className="primaryCTA" disabled={isSaving}>
              {isSaving ? 'Saving…' : mode === 'create' ? 'Create Issue' : 'Save Changes'}
            </button>
          </div>
        </div>
      </section>
    </form>
  );
}
