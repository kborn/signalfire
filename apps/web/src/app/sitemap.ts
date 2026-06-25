import type { MetadataRoute } from 'next';
import { getTopicsList } from '@/lib/api/topics';
import { getArticlesList } from '@/lib/api/articles';
import { getActionsList } from '@/lib/api/actions';

const BASE_URL = 'https://demo.findmyfight.com';

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: BASE_URL, priority: 1.0, changeFrequency: 'weekly' },
  { url: `${BASE_URL}/about`, priority: 0.6, changeFrequency: 'monthly' },
  { url: `${BASE_URL}/issues`, priority: 0.9, changeFrequency: 'weekly' },
  { url: `${BASE_URL}/articles`, priority: 0.8, changeFrequency: 'daily' },
  { url: `${BASE_URL}/actions`, priority: 0.8, changeFrequency: 'daily' },
  { url: `${BASE_URL}/events`, priority: 0.7, changeFrequency: 'daily' },
  { url: `${BASE_URL}/search`, priority: 0.5, changeFrequency: 'monthly' },
  { url: `${BASE_URL}/submit`, priority: 0.5, changeFrequency: 'monthly' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [topicsResult, articlesResult, actionsResult] = await Promise.allSettled([
    getTopicsList(),
    getArticlesList({ pageSize: '50' }),
    getActionsList({ pageSize: '50' }),
  ]);

  const topicUrls: MetadataRoute.Sitemap =
    topicsResult.status === 'fulfilled'
      ? topicsResult.value.items.map((t) => ({
          url: `${BASE_URL}/issues/${t.slug}`,
          priority: 0.8,
          changeFrequency: 'weekly' as const,
        }))
      : [];

  const articleUrls: MetadataRoute.Sitemap =
    articlesResult.status === 'fulfilled'
      ? articlesResult.value.items.map((a) => ({
          url: `${BASE_URL}/articles/${a.slug}`,
          priority: 0.7,
          changeFrequency: 'monthly' as const,
          lastModified: a.publishedAt ? new Date(a.publishedAt) : undefined,
        }))
      : [];

  const actionUrls: MetadataRoute.Sitemap =
    actionsResult.status === 'fulfilled'
      ? actionsResult.value.items.map((a) => ({
          url: `${BASE_URL}/actions/${a.slug}`,
          priority: 0.7,
          changeFrequency: 'monthly' as const,
        }))
      : [];

  return [...STATIC_ROUTES, ...topicUrls, ...articleUrls, ...actionUrls];
}
