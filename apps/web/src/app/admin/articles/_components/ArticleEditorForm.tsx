'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  type AdminArticleDetailResponse,
  type EntityStatus,
  type TopicSummary,
} from '@signal-fire/api-contracts';
import { ApiError, SubmissionError } from '@/lib/api/error';
import { createAdminArticle, updateAdminArticle } from '@/lib/api/admin';
import {
  mapSubmissionApiErrors,
  SUBMISSION_FIELD_LIMITS,
  validateRequiredString,
} from '@/lib/submission-form-validation';
import { useRouter } from 'next/navigation';

type ArticleEditorInitialValues = {
  slug: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  topicSlugs: string[];
};

type ArticleEditorFormProps = {
  mode: 'create' | 'edit';
  initialValues: ArticleEditorInitialValues;
  topics: TopicSummary[];
};

type ArticleEditorFormErrors = {
  title?: string;
  summary?: string;
  content?: string;
  author?: string;
  articleType?: string;
  topicSlugs?: string;
};

const articleEditorErrorFieldOrder: Array<keyof ArticleEditorFormErrors> = [
  'title',
  'summary',
  'content',
  'articleType',
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

function mapAdminApiFieldToUiField(field: string): keyof ArticleEditorFormErrors | null {
  const normalizedField = field.startsWith('payload.') ? field.slice('payload.'.length) : field;

  if (normalizedField.startsWith('topicSlugs[')) {
    return 'topicSlugs';
  }

  switch (normalizedField) {
    case 'title':
    case 'summary':
    case 'content':
    case 'articleType':
    case 'topicSlugs':
      return normalizedField;
    default:
      return null;
  }
}

function getArticleControlId(field: keyof ArticleEditorFormErrors, topics: TopicSummary[]): string {
  if (field === 'topicSlugs') {
    return topics[0] ? `article-topic-${topics[0].slug}` : 'article-topic-group';
  }

  return `article-${field}`;
}

function getArticleFieldA11y(
  field: keyof ArticleEditorFormErrors,
  errors: ArticleEditorFormErrors,
  helperId?: string,
) {
  const describedBy = [helperId, errors[field] ? `article-${field}-error` : null]
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
  const article = submitter?.getAttribute('value');

  return article === 'publish' ? 'PUBLISHED' : 'DRAFT';
}

export default function ArticleEditorForm({ mode, initialValues, topics }: ArticleEditorFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialValues.title);
  const [summary, setSummary] = useState(initialValues.summary);
  const [content, setContent] = useState(initialValues.content);
  const [author, setAuthor] = useState(initialValues.author);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(initialValues.topicSlugs);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [errors, setErrors] = useState<ArticleEditorFormErrors>({});

  const selectedTopicSet = useMemo(() => new Set(selectedTopics), [selectedTopics]);

  useEffect(() => {
    const firstErrorField = articleEditorErrorFieldOrder.find((field) => errors[field]);
    if (firstErrorField) {
      focusAndScrollTo(getArticleControlId(firstErrorField, topics));
      return;
    }

    if (saveError) {
      focusAndScrollTo('article-submit-error');
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
    const normalizedContent = content.trim();
    const normalizedAuthor = author.trim();

    const nextErrors: ArticleEditorFormErrors = {};
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

    const contentError = validateRequiredString(
      normalizedContent,
      'Content',
      SUBMISSION_FIELD_LIMITS.content,
    );
    if (contentError) {
      nextErrors.content = contentError;
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
      content: normalizedContent,
      author: normalizedAuthor,
      status: nextStatus,
      topicSlugs: selectedTopics,
    };

    setIsSaving(true);
    try {
      let result: AdminArticleDetailResponse;
      if (mode === 'create') {
        result = await createAdminArticle(payload);
      } else {
        result = await updateAdminArticle(initialValues.slug, payload);
      }

      window.scrollTo({ top: 0, behavior: getScrollBehavior() });
      if (mode === 'create') {
        router.replace(`/admin/articles/${result.slug}`, { scroll: true });
        router.refresh();
      } else {
        setSaveSuccess(
          result.status === 'PUBLISHED'
            ? 'Article updated and published successfully.'
            : 'Article updated and saved as draft.',
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
          setErrors(fieldErrors as ArticleEditorFormErrors);
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
    <form className="submissionForm articleEditorForm" onSubmit={handleSubmit} noValidate>
      <section className="adminPanel">
        <div className="adminPanelHeader">
          <h2>{mode === 'create' ? 'Create article' : 'Edit article'}</h2>
        </div>

        {saveSuccess ? (
          <div className="adminReviewBanner articleEditorSuccessBanner" role="status">
            <p className="adminReviewBannerTitle">Article saved</p>
            <p className="adminReviewBannerText">{saveSuccess}</p>
          </div>
        ) : null}

        <div className="articleEditorLayout">
          <section className="submissionField articleEditorTitleField">
            <label className="submissionLabel" htmlFor="article-title">
              Title
            </label>
            <input
              id="article-title"
              className="submissionControl"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              {...getArticleFieldA11y('title', errors)}
              required
            />
            {errors.title ? (
              <p id="article-title-error" className="submissionError">
                {errors.title}
              </p>
            ) : null}
          </section>

          <div className="articleEditorTopRow">
            <section className="submissionField articleEditorSummaryField">
              <label className="submissionLabel" htmlFor="article-summary">
                Summary
              </label>
              <textarea
                id="article-summary"
                className="submissionTextarea articleEditorTextareaSummary"
                value={summary}
                rows={7}
                onChange={(event) => setSummary(event.target.value)}
                {...getArticleFieldA11y('summary', errors)}
                required
              />
              {errors.summary ? (
                <p id="article-summary-error" className="submissionError">
                  {errors.summary}
                </p>
              ) : null}
            </section>
          </div>

          <section className="submissionField articleEditorContentField">
            <label className="submissionLabel" htmlFor="article-content">
              Content
            </label>
            <textarea
              id="article-content"
              className="submissionTextarea articleEditorTextareaContent"
              value={content}
              rows={18}
              onChange={(event) => setContent(event.target.value)}
              {...getArticleFieldA11y('content', errors)}
              required
            />
            {errors.content ? (
              <p id="article-content-error" className="submissionError">
                {errors.content}
              </p>
            ) : null}
          </section>

          <aside className="articleEditorSidebar" aria-label="Article settings">
            <fieldset
              id="article-topic-group"
              className="submissionCheckboxGroup"
              tabIndex={-1}
              {...getArticleFieldA11y('topicSlugs', errors)}
            >
              <legend className="submissionLabel">Topics</legend>
              {topics.length === 0 ? (
                <p>No topics are available to assign.</p>
              ) : (
                <div className="adminTopicGrid">
                  {topics.map((topic) => (
                    <label key={topic.slug} className="submissionCheckboxOption">
                      <input
                        id={`article-topic-${topic.slug}`}
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
              <p id="article-topicSlugs-error" className="submissionError">
                {errors.topicSlugs}
              </p>
            ) : null}
          </aside>

          <section className="submissionField articleEditorAuthorField">
            <label className="submissionLabel" htmlFor="article-author">
              Author
            </label>
            <input
              id="article-author"
              className="submissionTextarea articleEditorTextareaAuthor"
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              {...getArticleFieldA11y('author', errors)}
              required
            />
            {errors.content ? (
              <p id="article-author-error" className="submissionError">
                {errors.content}
              </p>
            ) : null}
          </section>
        </div>

        <div className="articleEditorFooter">
          {saveError ? (
            <p id="article-submit-error" className="adminError" tabIndex={-1}>
              {saveError}
            </p>
          ) : null}
          <div className="articleEditorFooterArticles">
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
