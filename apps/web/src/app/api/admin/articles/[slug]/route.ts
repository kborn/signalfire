import { NextRequest } from 'next/server';
import type { AdminArticleDetailResponse } from '@signal-fire/api-contracts';
import { proxyAdminJson, respondWithUpstreamJson } from '@/app/api/admin/_lib/proxy';
import { revalidateArticlePages } from '@/app/api/admin/_lib/revalidation';

export async function PATCH(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const { data, upstream } = await proxyAdminJson(request, `admin/articles/${slug}`, 'PATCH');

  if (upstream.ok) {
    const article = data as AdminArticleDetailResponse;
    revalidateArticlePages(article.slug, article.topicSlugs);
  }

  return respondWithUpstreamJson(upstream, data);
}
