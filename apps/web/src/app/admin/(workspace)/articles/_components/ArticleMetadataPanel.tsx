import Link from 'next/link';
import { type AdminArticleDetailResponse } from '@signal-fire/api-contracts';

function formatDateTime(value: string | null | undefined) {
  return value ? new Date(value).toLocaleString() : '--';
}

export default function ArticleMetadataPanel({ article }: { article: AdminArticleDetailResponse }) {
  const livePageHref = article.status === 'PUBLISHED' ? `/articles/${article.slug}` : null;

  return (
    <section className="adminPanel adminMetadataPanel" aria-label="Article metadata">
      <dl className="adminMetadataBar">
        <div className="adminMetadataItem">
          <dt>ID</dt>
          <dd>
            {livePageHref ? (
              <Link href={livePageHref} className="adminMetadataLink">
                {article.id}
              </Link>
            ) : (
              article.id
            )}
          </dd>
        </div>

        <div className="adminMetadataItem">
          <dt>Status</dt>
          <dd>
            <span className="adminBadge">{article.status}</span>
          </dd>
        </div>

        <div className="adminMetadataItem">
          <dt>Updated</dt>
          <dd>
            <time className="adminMetadataTime" dateTime={article.updatedAt}>
              {formatDateTime(article.updatedAt)}
            </time>
          </dd>
        </div>

        <div className="adminMetadataItem">
          <dt>Published</dt>
          <dd>
            {article.publishedAt ? (
              <time className="adminMetadataTime" dateTime={article.publishedAt}>
                {formatDateTime(article.publishedAt)}
              </time>
            ) : (
              '--'
            )}
          </dd>
        </div>
      </dl>
    </section>
  );
}
