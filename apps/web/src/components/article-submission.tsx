'use client';
import { TopicSummary } from '@signal-fire/api-contracts';
import type { ComponentProps } from 'react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { postArticleSubmission } from '@/lib/api/submit';
import { SubmissionError } from '@/lib/api/error';
import { SubmissionGuidance } from '@/components/submission-guidance';
import {
  mapSubmissionApiFieldToUiField,
  mapSubmissionApiErrors,
  SUBMISSION_FIELD_LIMITS,
  validateOptionalEmail,
  validateOptionalStringMax,
  validateRequiredString,
  validateResourceLinks,
} from '@/lib/submission-form-validation';

type ArticleSubmissionFormProps = {
  topics: TopicSummary[];
};

type FormSubmitHandler = NonNullable<ComponentProps<'form'>['onSubmit']>;

type ArticleSubmissionFormErrors = {
  title?: string;
  summary?: string;
  content?: string;
  topicSlugs?: string;
  resourceLinks?: string;
  author?: string;
  submitterName?: string;
  submitterEmail?: string;
};

const articleErrorFieldOrder: Array<keyof ArticleSubmissionFormErrors> = [
  'title',
  'summary',
  'topicSlugs',
  'content',
  'resourceLinks',
  'author',
  'submitterName',
  'submitterEmail',
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

export function ArticleSubmissionForm({ topics }: ArticleSubmissionFormProps) {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [topicSlugs, setTopicSlugs] = useState<string[]>([]);
  const [resourceLinks, setResourceLinks] = useState(['']);
  const [author, setAuthor] = useState('');
  const [submitterName, setSubmitterName] = useState('');
  const [submitterEmail, setSubmitterEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<ArticleSubmissionFormErrors>({});

  const getArticleControlId = useCallback(
    (field: keyof ArticleSubmissionFormErrors): string => {
      if (field === 'topicSlugs') {
        return topics[0] ? `article-topic-${topics[0].slug}` : 'article-topic-group';
      }

      if (field === 'resourceLinks') {
        return 'article-resource-link-0';
      }

      return `article-${field}`;
    },
    [topics],
  );

  useEffect(() => {
    const firstErrorField = articleErrorFieldOrder.find((field) => errors[field]);
    if (firstErrorField) {
      focusAndScrollTo(getArticleControlId(firstErrorField));
      return;
    }
    if (submitError) {
      focusAndScrollTo('article-submit-error');
    }
  }, [errors, getArticleControlId, submitError]);

  function getFieldA11y(field: keyof ArticleSubmissionFormErrors, helperId?: string) {
    const describedBy = [helperId, errors[field] ? `article-${field}-error` : null]
      .filter(Boolean)
      .join(' ');

    return {
      'aria-describedby': describedBy || undefined,
      'aria-invalid': errors[field] ? true : undefined,
    };
  }

  const handleToggle = (topic: string) => {
    setTopicSlugs(
      (prev) =>
        prev.includes(topic)
          ? prev.filter((t) => t !== topic) // Remove if already checked
          : [...prev, topic], // Add if not checked
    );
  };

  const handleResourceLinkChange = (index: number, value: string) => {
    setResourceLinks((prev) =>
      prev.map((link, currentIndex) => (currentIndex === index ? value : link)),
    );
  };

  function addResourceLink() {
    setResourceLinks((prev) => [...prev, '']);
  }

  function hasResourceLink() {
    return resourceLinks.length > 1 || resourceLinks[0].trim() !== '';
  }

  function removeResourceLink(index: number) {
    setResourceLinks((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
  }

  function mapApiFieldToUiField(field: string): keyof ArticleSubmissionFormErrors | null {
    const sharedField = mapSubmissionApiFieldToUiField(field);
    if (sharedField) {
      return sharedField as keyof ArticleSubmissionFormErrors;
    }

    switch (field) {
      case 'payload.title':
        return 'title';
      case 'payload.summary':
        return 'summary';
      case 'payload.content':
        return 'content';
      case 'payload.topicSlugs':
        return 'topicSlugs';
      case 'payload.resourceLinks':
        return 'resourceLinks';
      case 'submitterName':
        return 'submitterName';
      case 'submitterEmail':
        return 'submitterEmail';
      case 'author':
        return 'author';
      default:
        return null;
    }
  }

  const submit: FormSubmitHandler = async (event) => {
    event.preventDefault();
    setSubmitError(null);
    setErrors({});

    // required strings can not be null due to the type in the contract
    const normalizedTitle = title.trim();
    const normalizedSummary = summary.trim();
    const normalizedContent = content.trim();
    // optional fields nulled so as not to send empty strings in payload
    const normalizedAuthor = author.trim() || null;
    const normalizedSubmitterName = submitterName.trim() || null;
    const normalizedSubmitterEmail = submitterEmail.trim() || null;
    const normalizedResourceLinks = resourceLinks
      .map((link) => link.trim())
      .filter((link) => link.length > 0);

    const errors: ArticleSubmissionFormErrors = {};
    const titleError = validateRequiredString(
      normalizedTitle,
      'Title',
      SUBMISSION_FIELD_LIMITS.title,
    );
    if (titleError) {
      errors.title = titleError;
    }

    const summaryError = validateRequiredString(
      normalizedSummary,
      'Summary',
      SUBMISSION_FIELD_LIMITS.summary,
    );
    if (summaryError) {
      errors.summary = summaryError;
    }

    const contentError = validateRequiredString(
      normalizedContent,
      'Content',
      SUBMISSION_FIELD_LIMITS.content,
    );
    if (contentError) {
      errors.content = contentError;
    }

    if (topicSlugs.length === 0) {
      errors.topicSlugs = 'Select at least one related topic';
    }

    const resourceLinksError = validateResourceLinks(normalizedResourceLinks);
    if (resourceLinksError) {
      errors.resourceLinks = resourceLinksError;
    }

    const authorError = validateOptionalStringMax(normalizedAuthor, SUBMISSION_FIELD_LIMITS.author);
    if (authorError) {
      errors.author = authorError;
    }

    const submitterNameError = validateOptionalStringMax(
      normalizedSubmitterName,
      SUBMISSION_FIELD_LIMITS.submitterName,
    );
    if (submitterNameError) {
      errors.submitterName = submitterNameError;
    }

    const submitterEmailError = validateOptionalEmail(
      normalizedSubmitterEmail,
      SUBMISSION_FIELD_LIMITS.submitterEmail,
    );
    if (submitterEmailError) {
      errors.submitterEmail = submitterEmailError;
    }

    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      try {
        await postArticleSubmission({
          submissionType: 'ARTICLE',
          author: normalizedAuthor,
          submitterName: normalizedSubmitterName,
          submitterEmail: normalizedSubmitterEmail,
          payload: {
            title: normalizedTitle,
            summary: normalizedSummary,
            content: normalizedContent,
            topicSlugs: topicSlugs,
            resourceLinks: normalizedResourceLinks.length === 0 ? null : normalizedResourceLinks,
          },
        });
        setIsSuccess(true);
      } catch (error) {
        if (error instanceof SubmissionError) {
          const { fieldErrors, formError } = mapSubmissionApiErrors(
            error.errors,
            mapApiFieldToUiField,
          );

          if (Object.keys(fieldErrors).length > 0) {
            setErrors((prev) => ({ ...prev, ...fieldErrors }));
          }

          if (formError) {
            setSubmitError(formError);
          } else if (Object.keys(fieldErrors).length === 0) {
            setSubmitError('Something went wrong while sending your submission. Please try again.');
          }
        } else {
          setSubmitError('Something went wrong while sending your submission. Please try again.');
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (isSuccess) {
    return (
      <div className={'submissionSuccess'}>
        <p className="section-label">Submission received</p>
        <h1 className="pageTitle">Thanks for submitting</h1>
        <p className="page-intro">
          Thanks — your submission has been received and is now pending review.
        </p>
        <p className="metaText">
          If you included an email address, we may contact you if we need clarification.
        </p>
        <div className="ctaRow submissionSuccessActions">
          <Link href="/topics" className="primaryCTA">
            Explore Issues
          </Link>
          <Link href="/articles" className="secondaryCTA">
            Browse Articles
          </Link>
        </div>
      </div>
    );
  } else {
    return (
      <form className={'submissionForm'} onSubmit={submit} noValidate>
        <section className="page-section">
          <h1 className="pageTitle">Submit an Article</h1>
          <p className="page-intro">
            Share an article that helps others understand an issue or take action
          </p>
          <p className="metaText">Submissions are reviewed before publication.</p>
          <p className="metaText">Fields marked with * are required.</p>
          <SubmissionGuidance />
          <section className="submissionSection">
            <h2>Basic Information</h2>
            <section className="submissionField">
              <label className="submissionLabel" htmlFor="article-title">
                <span>* Title</span>
                <input
                  id="article-title"
                  className={'submissionControl'}
                  value={title}
                  placeholder="Title"
                  onChange={(event) => setTitle(event.target.value)}
                  {...getFieldA11y('title')}
                />
              </label>
              {errors.title ? (
                <p id="article-title-error" className="submissionError">
                  {errors.title}
                </p>
              ) : null}
            </section>

            <section className="submissionField">
              <label className="submissionLabel" htmlFor="article-summary">
                <span>* Summary</span>
                <textarea
                  id="article-summary"
                  className="submissionTextarea"
                  value={summary}
                  placeholder="A brief overview of the article"
                  rows={4}
                  onChange={(event) => setSummary(event.target.value)}
                  {...getFieldA11y('summary')}
                />
              </label>
              {errors.summary ? (
                <p id="article-summary-error" className="submissionError">
                  {errors.summary}
                </p>
              ) : null}
            </section>

            <section className="submissionField">
              <div id="article-topic-group" className="submissionLabel">
                * Topics
              </div>
              <p id="article-topic-helper" className="submissionHelper">
                Select at least one topic
              </p>
              <div
                className="submissionCheckboxGroup"
                role="group"
                aria-labelledby="article-topic-group"
                {...getFieldA11y('topicSlugs', 'article-topic-helper')}
              >
                {topics.map((topic) => (
                  <label
                    className="submissionCheckboxOption"
                    htmlFor={`article-topic-${topic.slug}`}
                    key={topic.id}
                  >
                    <input
                      id={`article-topic-${topic.slug}`}
                      type="checkbox"
                      checked={topicSlugs.includes(topic.slug)}
                      onChange={() => handleToggle(topic.slug)}
                    />
                    {topic.name}
                  </label>
                ))}
              </div>
              {errors.topicSlugs ? (
                <p id="article-topicSlugs-error" className="submissionError">
                  {errors.topicSlugs}
                </p>
              ) : null}
            </section>
          </section>

          <section className="submissionSection">
            <h2>Article Content</h2>
            <section className="submissionField">
              <label className="submissionLabel" htmlFor="article-content">
                <span>* Content</span>
                <textarea
                  id="article-content"
                  className="submissionTextarea"
                  value={content}
                  placeholder="Paste or write the full article content"
                  rows={12}
                  onChange={(event) => setContent(event.target.value)}
                  {...getFieldA11y('content')}
                />
              </label>
              {errors.content ? (
                <p id="article-content-error" className="submissionError">
                  {errors.content}
                </p>
              ) : null}
            </section>
          </section>

          <section className="submissionSection">
            <h2>Supporting Links (optional)</h2>
            <section className="submissionField">
              <div className="submissionLabel">Supporting links (optional)</div>
              <p className="submissionHelper">
                Add links that help verify claims or provide context
              </p>
              <div className="submissionRepeatableList">
                {resourceLinks.map((link, index) => (
                  <div className="submissionRepeatableRow" key={index}>
                    <label className="submissionLabel" htmlFor={`article-resource-link-${index}`}>
                      Resource link {index + 1}
                    </label>
                    <input
                      id={`article-resource-link-${index}`}
                      className="submissionControl"
                      type="text"
                      placeholder="https://example.org/source"
                      value={link}
                      onChange={(event) => handleResourceLinkChange(index, event.target.value)}
                      {...getFieldA11y('resourceLinks')}
                    />
                    {hasResourceLink() ? (
                      <button
                        className="submissionSecondaryAction"
                        type="button"
                        onClick={() => removeResourceLink(index)}
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
                ))}
                <button
                  className="submissionSecondaryAction"
                  type="button"
                  onClick={() => addResourceLink()}
                >
                  Add Another Resource
                </button>
              </div>
              {errors.resourceLinks ? (
                <p id="article-resourceLinks-error" className="submissionError">
                  {errors.resourceLinks}
                </p>
              ) : null}
            </section>
          </section>

          <section className="submissionSection">
            <h2>Contact Information</h2>
            <section className="submissionField">
              <label className="submissionLabel" htmlFor="article-author">
                <span>Author (optional)</span>
                <input
                  id="article-author"
                  className={'submissionControl'}
                  value={author}
                  placeholder="Author"
                  onChange={(event) => setAuthor(event.target.value)}
                  {...getFieldA11y('author')}
                />
              </label>
              {errors.author ? (
                <p id="article-author-error" className="submissionError">
                  {errors.author}
                </p>
              ) : null}
            </section>

            <section className="submissionField">
              <label className="submissionLabel" htmlFor="article-submitterName">
                <span>Submitter Name (optional)</span>
                <input
                  id="article-submitterName"
                  className={'submissionControl'}
                  value={submitterName}
                  placeholder="Your name"
                  onChange={(event) => setSubmitterName(event.target.value)}
                  {...getFieldA11y('submitterName')}
                />
              </label>

              {errors.submitterName ? (
                <p id="article-submitterName-error" className="submissionError">
                  {errors.submitterName}
                </p>
              ) : null}
            </section>

            <section className="submissionField">
              <label className="submissionLabel" htmlFor="article-submitterEmail">
                Submitter Email (optional)
              </label>
              <span id="article-submitter-email-helper" className="submissionHelper">
                Used only if we need to follow up about your submission
              </span>
              <input
                id="article-submitterEmail"
                className={'submissionControl'}
                value={submitterEmail}
                placeholder="name@example.com"
                type={'email'}
                onChange={(event) => setSubmitterEmail(event.target.value)}
                {...getFieldA11y('submitterEmail', 'article-submitter-email-helper')}
              />
              {errors.submitterEmail ? (
                <p id="article-submitterEmail-error" className="submissionError">
                  {errors.submitterEmail}
                </p>
              ) : null}
            </section>
          </section>
        </section>

        {submitError ? (
          <p id="article-submit-error" className="submissionGlobalError" tabIndex={-1}>
            {submitError}
          </p>
        ) : null}
        <div className="submissionActions">
          <button className="primaryCTA" type="submit" disabled={isSubmitting}>
            Submit Article
          </button>
        </div>
      </form>
    );
  }
}
