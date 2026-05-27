import { useEffect, useState } from 'react';
import {
  type ArticleApprovalPayload,
  ModerationSubmissionDetail,
  TopicSummary,
} from '@signal-fire/api-contracts';

import type { ReviewFormErrors } from './review-form.types';
type ArticleModerationSubmission = Extract<
  ModerationSubmissionDetail,
  { submissionType: 'ARTICLE' }
>;

export default function ArticleNormalizationForm({
  submission,
  topics,
  success,
  errors,
  onChange,
}: {
  submission: ArticleModerationSubmission;
  topics: TopicSummary[];
  success: boolean;
  errors: ReviewFormErrors;
  onChange: (value: ArticleApprovalPayload) => void;
}) {
  const [content, setContent] = useState(submission.submittedContent.content);
  const [summary, setSummary] = useState(submission.submittedContent.summary);
  const [title, setTitle] = useState(submission.submittedContent.title);
  const [author, setAuthor] = useState(submission.submittedContent.author ?? 'Anonymous');
  const [topicSlugs, setTopicSlugs] = useState<string[]>(
    submission.submittedContent.topics.map((topic) => topic.slug),
  );

  useEffect(() => {
    onChange({
      title,
      summary,
      topicSlugs,
      author,
      content,
    });
  }, [title, summary, topicSlugs, author, content, onChange]);

  const handleToggle = (topic: string) => {
    setTopicSlugs((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic],
    );
  };

  return (
    <dl className="adminDefinitionList">
      <dt>
        <label htmlFor="normalized-title">Title</label>
      </dt>
      <dd>
        {errors.title ? (
          <p id="normalized-title-error" className="submissionError">
            {errors.title}
          </p>
        ) : null}
        <input
          id="normalized-title"
          className="adminTextEditor"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={success}
        />
      </dd>
      <dt>
        <label htmlFor="normalized-summary">Summary</label>
      </dt>
      <dd>
        {errors.summary ? (
          <p id="normalized-summary-error" className="submissionError">
            {errors.summary}
          </p>
        ) : null}
        <textarea
          id="normalized-summary"
          className="adminTextareaEditor"
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          disabled={success}
        />
      </dd>

      <dt>
        <label htmlFor="normalized-content">Content</label>
      </dt>
      <dd>
        {errors.content ? (
          <p id="normalized-content-error" className="submissionError">
            {errors.content}
          </p>
        ) : null}
        <textarea
          id="normalized-content"
          className="submissionTextarea adminLongTextEditor"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          disabled={success}
        />
      </dd>
      <dt>
        <label htmlFor="normalized-author">Author</label>
      </dt>
      <dd>
        {errors.author ? (
          <p id="normalized-author-error" className="submissionError">
            {errors.author}
          </p>
        ) : null}
        <input
          id="normalized-author"
          className="adminTextEditor"
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
          disabled={success}
        />
      </dd>
      <dt>Topics</dt>
      <dd>
        {errors.topicSlugs ? (
          <p id="normalized-topics-error" className="submissionError">
            {errors.topicSlugs}
          </p>
        ) : null}
        {topics.map((topic) => (
          <label className="submissionCheckboxOption" key={topic.slug}>
            <input
              type="checkbox"
              checked={topicSlugs.includes(topic.slug)}
              onChange={() => handleToggle(topic.slug)}
              disabled={success}
            />
            {topic.name}
          </label>
        ))}
      </dd>
    </dl>
  );
}
