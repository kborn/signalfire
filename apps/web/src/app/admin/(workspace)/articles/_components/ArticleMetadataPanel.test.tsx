import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import ArticleMetadataPanel from './ArticleMetadataPanel';

describe('ArticleMetadataPanel', () => {
  afterEach(() => {
    cleanup();
  });

  it('links the article id to the live page when published', () => {
    render(
      <ArticleMetadataPanel
        article={{
          id: 42,
          slug: 'climate-article',
          title: 'Climate Article',
          summary: 'Summary',
          content: 'Content',
          author: 'Author',
          status: 'PUBLISHED',
          updatedAt: '2026-03-21T12:00:00.000Z',
          publishedAt: '2026-03-21T12:00:00.000Z',
          topicSlugs: ['climate'],
        }}
      />,
    );

    expect(screen.getByRole('link', { name: '42' })).toHaveAttribute(
      'href',
      '/articles/climate-article',
    );
    expect(screen.getByText('PUBLISHED')).toBeInTheDocument();
    expect(screen.getByText('Published')).toBeInTheDocument();
  });

  it('renders the article id as plain text when the article is a draft', () => {
    render(
      <ArticleMetadataPanel
        article={{
          id: 42,
          slug: 'climate-article',
          title: 'Climate Article',
          summary: 'Summary',
          content: 'Content',
          author: 'Author',
          status: 'DRAFT',
          updatedAt: '2026-03-21T12:00:00.000Z',
          publishedAt: null,
          topicSlugs: ['climate'],
        }}
      />,
    );

    expect(screen.queryByRole('link', { name: '42' })).not.toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('--')).toBeInTheDocument();
  });
});
