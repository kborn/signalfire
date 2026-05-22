import { useEffect, useState } from 'react';
import {
  type ArticleApprovalPayload,
  ModerationSubmissionDetail,
  TopicSummary,
} from '@signal-fire/api-contracts';

type ArticleModerationSubmission = Extract<
  ModerationSubmissionDetail,
  { submissionType: 'ARTICLE' }
>;

export default function ArticleNormalizationForm({
  submission,
  topics,
  success,
  onChange,
}: {
  submission: ArticleModerationSubmission;
  topics: TopicSummary[];
  success: boolean;
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
    onChange({ title, summary, topicSlugs, author, content });
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
