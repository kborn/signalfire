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

    const normalizedTitle = title.trim();
    const normalizedSummary = summary.trim();
    const normalizedContent = content.trim();
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

            setErrors((prev) => ({ ...prev, ...newEntries }));
          }
        } else if (error instanceof Error) {
          setSubmitError(error.message);
        } else {
          setSubmitError('Something went wrong while sending your submission. Please try again.');
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  }

  if (isSuccess) {
    return <div>Thank you for submitting</div>;
  } else {
    return (
      <form onSubmit={submit}>
        <section className="page-section">
          <h1 className="pageTitle">Submit an Article</h1>
          <p className="page-intro">
            Share an article that helps others understand an issue or take action
          </p>

          <div> Title </div>
          <input
            value={title}
            placeholder="Title"
            onChange={(event) => setTitle(event.target.value)}
          />
          {errors.title ? <p className="submissionError">{errors.title}</p> : null}

          <div> Summary </div>
          <textarea
            value={summary}
            placeholder="Briefly describe what this article is about"
            rows={4}
            onChange={(event) => setSummary(event.target.value)}
          />
          {errors.summary ? <p className="submissionError">{errors.summary}</p> : null}

          <div>Select at least one topic</div>
          <div>
            {topics.map((topic) => (
              <label key={topic.name}>
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

          <div> Content </div>
          <textarea
            value={content}
            placeholder="Briefly describe what this article is about"
            rows={12}
            onChange={(event) => setContent(event.target.value)}
          />
          {errors.content ? <p className="submissionError">{errors.content}</p> : null}

          <div> Resource Links </div>
          <div>
            {resourceLinks.map((link, index) => (
              <div key={index}>
                <input
                  type="url"
                  value={link}
                  onChange={(event) => handleResourceLinkChange(index, event.target.value)}
                />
                <button type="button" onClick={() => removeResourceLink(index)}>
                  Remove
                </button>
                <button type="button" onClick={() => addResourceLink()}>
                  Add Another Resource
                </button>
              </div>
            ))}
          </div>
          {errors.resourceLinks ? <p className="submissionError">{errors.resourceLinks}</p> : null}

          <div> Author </div>
          <input
            value={author}
            placeholder="Author"
            onChange={(event) => setAuthor(event.target.value)}
          />
          {errors.author ? <p className="submissionError">{errors.author}</p> : null}

          <div> Submitter Name </div>
          <input
            value={submitterName}
            placeholder="Name"
            onChange={(event) => setSubmitterName(event.target.value)}
          />
          {errors.submitterName ? <p className="submissionError">{errors.submitterName}</p> : null}

          <div> Submitter Email </div>
          <input
            value={submitterEmail}
            placeholder="Email"
            onChange={(event) => setSubmitterEmail(event.target.value)}
          />
          {errors.submitterEmail ? (
            <p className="submissionError">{errors.submitterEmail}</p>
          ) : null}
        </section>

        {submitError ? <p className="submissionError">{submitError}</p> : null}
        <button type="submit" disabled={isSubmitting}>
          Submit Article
        </button>
      </form>
    );
  }
}
