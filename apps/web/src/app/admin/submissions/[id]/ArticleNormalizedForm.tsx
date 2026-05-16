'use client';

import { useState } from 'react';

import type { ModerationSubmissionDetail } from '@signal-fire/api-contracts';

type ArticleModerationSubmission = Extract<
  ModerationSubmissionDetail,
  { submissionType: 'ARTICLE' }
>;

export default function ArticleNormalizationForm({
  submission,
}: {
  submission: ArticleModerationSubmission;
}) {
  const [content, setContent] = useState(submission.submittedContent.content);
  const [summary, setSummary] = useState(submission.submittedContent.summary);
  const [title, setTitle] = useState(submission.submittedContent.title);
  const [author, setAuthor] = useState(submission.submittedContent.author ?? '');

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
        />
      </dd>
      <dt>Topics</dt>
      <dd>
        <ul className="adminInlineList">
          {submission.submittedContent.topics.map((topic) => (
            <li key={topic.id}>{topic.name}</li>
          ))}
        </ul>
      </dd>
    </dl>
  );
}
