'use client';
import type { TopicSummary } from '@signal-fire/api-contracts';
import { useState } from 'react';
import { postArticleSubmission } from '@/lib/api/submit';

type ArticleSubmissionFormProps = {
  topics: TopicSummary[];
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

  const handleToggle = (topic) => {
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

  function submit() {
    postArticleSubmission({
      submissionType: 'ARTICLE',
      author: author,
      submitterName: submitterName,
      submitterEmail: submitterEmail,
      payload: {
        title: title,
        summary: summary,
        content: content,
        topicSlugs: topicSlugs,
        resourceLinks: resourceLinks.filter((link) => link !== ''),
      },
    });
  }

  return (
    <section className="page-section">
      <h1 className="pageTitle">Submit an Article</h1>
      <p className="page-intro">
        Share an article that helps others understand an issue or take action
      </p>
      <input value={title} placeholder="Title" onChange={(event) => setTitle(event.target.value)} />
      <textarea
        value={summary}
        placeholder="Briefly describe what this article is about"
        rows={4}
        onChange={(event) => setSummary(event.target.value)}
      />
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
      <textarea
        value={content}
        placeholder="Briefly describe what this article is about"
        rows={12}
        onChange={(event) => setContent(event.target.value)}
      />
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
      <input
        value={author}
        placeholder="Author"
        onChange={(event) => setAuthor(event.target.value)}
      />
      <input
        value={author}
        placeholder="Name"
        onChange={(event) => setSubmitterName(event.target.value)}
      />
      <input
        value={submitterEmail}
        placeholder="Email"
        onChange={(event) => setSubmitterEmail(event.target.value)}
      />
      <button type="button" onClick={() => submit()}>
        Submit
      </button>
    </section>
  );
}
