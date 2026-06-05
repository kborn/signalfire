import Link from 'next/link';
import { type AdminActionDetailResponse } from '@signal-fire/api-contracts';

function formatDateTime(value: string | null | undefined) {
  return value ? new Date(value).toLocaleString() : '--';
}

export default function ActionMetadataPanel({ action }: { action: AdminActionDetailResponse }) {
  const livePageHref = action.status === 'PUBLISHED' ? `/actions/${action.slug}` : null;

  return (
    <section className="adminPanel adminMetadataPanel" aria-label="Action metadata">
      <dl className="adminMetadataBar">
        <div className="adminMetadataItem">
          <dt>ID</dt>
          <dd>
            {livePageHref ? (
              <Link href={livePageHref} className="adminMetadataLink">
                {action.id}
              </Link>
            ) : (
              action.id
            )}
          </dd>
        </div>

        <div className="adminMetadataItem">
          <dt>Status</dt>
          <dd>
            <span className="adminBadge">{action.status}</span>
          </dd>
        </div>

        <div className="adminMetadataItem">
          <dt>Updated</dt>
          <dd>
            <time className="adminMetadataTime" dateTime={action.updatedAt}>
              {formatDateTime(action.updatedAt)}
            </time>
          </dd>
        </div>

        <div className="adminMetadataItem">
          <dt>Published</dt>
          <dd>
            {action.publishedAt ? (
              <time className="adminMetadataTime" dateTime={action.publishedAt}>
                {formatDateTime(action.publishedAt)}
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
