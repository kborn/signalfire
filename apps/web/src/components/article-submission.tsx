'use client';
import { TopicSummary } from '@signal-fire/api-contracts';
import { useState } from 'react';
import { postArticleSubmission } from '@/lib/api/submit';
import { SubmissionError } from '@/lib/api/error';

type ArticleSubmissionFormProps = {
  topics: TopicSummary[];
};

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
    return resourceLinks.length > 1 || resourceLinks[0].trim() != '';
  }

  function removeResourceLink(index: number) {
    setResourceLinks((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
  }

  function mapApiFieldToUiField(field: string): string | null {
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

  async function submit(event: React.FormEvent<HTMLFormElement>) {
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
    if (!normalizedTitle) {
      errors.title = 'Title can not be null';
    }
    if (!normalizedSummary) {
      errors.summary = 'Summary can not be null';
    }
    if (!normalizedContent) {
      errors.content = 'Content can not be null';
    }
    if (topicSlugs.length === 0) {
      errors.topicSlugs = 'Select at least one related topic';
    }
    setErrors(errors);

    if (Object.keys(errors).length == 0) {
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
            resourceLinks: normalizedResourceLinks.length == 0 ? null : normalizedResourceLinks,
          },
        });
        setIsSuccess(true);
      } catch (error) {
        if (error instanceof SubmissionError) {
          if (error.errors) {
            const newEntries = error.errors.reduce((acc, e) => {
              const uiField = mapApiFieldToUiField(e.field);
              if (!uiField) {
                return acc;
              }
              return {
                ...acc,
                [uiField]: e.message,
              };
            }, {});

            if (Object.keys(newEntries).length > 0) {
              setErrors((prev) => ({ ...prev, ...newEntries }));
            } else {
              setSubmitError(
                'Something went wrong while sending your submission. Please try again.',
              );
            }
          } else {
            setSubmitError('Something went wrong while sending your submission. Please try again.');
          }
        } else {
          setSubmitError('Something went wrong while sending your submission. Please try again.');
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  }

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
      </div>
    );
  } else {
    return (
      <form className={'submissionForm'} onSubmit={submit}>
        <section className="page-section">
          <h1 className="pageTitle">Submit an Article</h1>
          <p className="page-intro">
            Share an article that helps others understand an issue or take action
          </p>
          <p className="metaText">Submissions are reviewed before publication.</p>
          <p className="metaText">Fields marked with * are required.</p>
          <section className="submissionSection">
            <h2>Basic Information</h2>
            <section className="submissionField">
              <label className="submissionLabel">
                <span>* Title</span>
                <input
                  className={'submissionControl'}
                  value={title}
                  placeholder="Title"
                  onChange={(event) => setTitle(event.target.value)}
                />
              </label>
              {errors.title ? <p className="submissionError">{errors.title}</p> : null}
            </section>

            <section className="submissionField">
              <label className="submissionLabel">
                <span>* Summary</span>
                <textarea
                  className="submissionTextarea"
                  value={summary}
                  placeholder="A brief overview of the article"
                  rows={4}
                  onChange={(event) => setSummary(event.target.value)}
                />
              </label>
              {errors.summary ? <p className="submissionError">{errors.summary}</p> : null}
            </section>

            <section className="submissionField">
              <div className="submissionLabel">* Topics</div>
              <p className="submissionHelper">Select at least one topic</p>
              <div className="submissionCheckboxGroup" aria-label="Topics">
                {topics.map((topic) => (
                  <label className="submissionCheckboxOption" key={topic.name}>
                    <input
                      type="checkbox"
                      checked={topicSlugs.includes(topic.slug)}
                      onChange={() => handleToggle(topic.slug)}
                    />
                    {topic.name}
                  </label>
                ))}
              </div>
              {errors.topicSlugs ? <p className="submissionError">{errors.topicSlugs}</p> : null}
            </section>
          </section>

          <section className="submissionSection">
            <h2>Article Content</h2>
            <section className="submissionField">
              <label className="submissionLabel">
                <span>* Content</span>
                <textarea
                  className="submissionTextarea"
                  value={content}
                  placeholder="Paste or write the full article content"
                  rows={12}
                  onChange={(event) => setContent(event.target.value)}
                />
              </label>
              {errors.content ? <p className="submissionError">{errors.content}</p> : null}
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
                      type="url"
                      placeholder="https://example.org/source"
                      value={link}
                      onChange={(event) => handleResourceLinkChange(index, event.target.value)}
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
                <p className="submissionError">{errors.resourceLinks}</p>
              ) : null}
            </section>
          </section>

          <section className="submissionSection">
            <h2>Contact Information</h2>
            <section className="submissionField">
              <label className="submissionLabel">
                <span>Author (optional)</span>
                <input
                  className={'submissionControl'}
                  value={author}
                  placeholder="Author"
                  onChange={(event) => setAuthor(event.target.value)}
                />
              </label>
              {errors.author ? <p className="submissionError">{errors.author}</p> : null}
            </section>

            <section className="submissionField">
              <label className="submissionLabel">
                <span>Submitter Name (optional)</span>
                <input
                  className={'submissionControl'}
                  value={submitterName}
                  placeholder="Your name"
                  onChange={(event) => setSubmitterName(event.target.value)}
                />
              </label>

              {errors.submitterName ? (
                <p className="submissionError">{errors.submitterName}</p>
              ) : null}
            </section>

            <section className="submissionField">
              <label className="submissionLabel" htmlFor="article-submitter-email">
                Submitter Email (optional)
              </label>
              <span className="submissionHelper">
                Used only if we need to follow up about your submission
              </span>
              <input
                id="article-submitter-email"
                className={'submissionControl'}
                value={submitterEmail}
                placeholder="name@example.com"
                type={'email'}
                onChange={(event) => setSubmitterEmail(event.target.value)}
              />
              {errors.submitterEmail ? (
                <p className="submissionError">{errors.submitterEmail}</p>
              ) : null}
            </section>
          </section>
        </section>

        {submitError ? <p className="submissionGlobalError">{submitError}</p> : null}
        <div className="submissionActions">
          <button className="primaryCTA" type="submit" disabled={isSubmitting}>
            Submit Article
          </button>
        </div>
      </form>
    );
  }
}
