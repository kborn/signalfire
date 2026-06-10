import { Fragment } from 'react';
import Link from 'next/link';
import { getAdminActionsList } from '@/lib/api/admin.server';
import type { EntityStatus } from '@signal-fire/api-contracts';
import { withAdminAuthRedirect } from '@/lib/admin/auth-redirect';

export const dynamic = 'force-dynamic';

type ActionListPageProps = {
  searchParams: Promise<{
    status?: string;
  }>;
};

function parseStatus(value?: string): EntityStatus {
  return value === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT';
}

function buildActionsHref(status: EntityStatus) {
  const params = new URLSearchParams();
  params.set('status', status);
  return `/admin/actions?${params.toString()}`;
}

export default async function ActionListPage({ searchParams }: ActionListPageProps) {
  const { status } = await searchParams;
  const currentStatus = parseStatus(status);
  const actionList = await withAdminAuthRedirect(buildActionsHref(currentStatus), async () => {
    return getAdminActionsList({ status: currentStatus });
  });

  return (
    <section className="page-section actionEditorPage">
      <header className="adminHeader">
        <div>
          <h1 className="pageTitle">Actions</h1>
          <p className="adminDek">Create and maintain curated public actions.</p>
        </div>

        <div className="ctaRow">
          <Link href="/admin/actions/new" className="primaryCTA">
            New Action
          </Link>
        </div>
      </header>

      <div className="adminFilterActionLabel">Action status filter</div>
      <nav className="adminSegmentedControl" aria-label="Action status">
        <Link
          href={buildActionsHref('DRAFT')}
          aria-current={currentStatus === 'DRAFT' ? 'page' : undefined}
        >
          Draft
        </Link>
        <Link
          href={buildActionsHref('PUBLISHED')}
          aria-current={currentStatus === 'PUBLISHED' ? 'page' : undefined}
        >
          Published
        </Link>
      </nav>

      <section className="adminPanel" aria-labelledby="admin-actions-heading">
        <div className="adminPanelHeader">
          <h2 id="admin-actions-heading">Action records</h2>
        </div>

        <table className="adminTable adminRecordTable adminRecordTableActions">
          <colgroup>
            <col className="adminRecordTablePrimaryCol" />
            <col className="adminRecordTableTypeCol" />
            <col className="adminRecordTableStatusCol" />
            <col className="adminRecordTableTopicsCol" />
            <col className="adminRecordTableDateCol" />
          </colgroup>
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Status</th>
              <th>Topics</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {actionList.items.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="adminEmptyState">
                    <p className="adminEmptyStateTitle">No actions yet.</p>
                    <p>Create an action to populate this list.</p>
                  </div>
                </td>
              </tr>
            ) : (
              actionList.items.map((action) => (
                <Fragment key={action.id}>
                  <tr>
                    <td>
                      <Link
                        href={`actions/${action.slug}`}
                        className="adminTableRecordLink"
                        aria-label={`Open action ${action.title}`}
                      >
                        <span className="adminTableRecordTitle">
                          {action.title} <span aria-hidden="true">→</span>
                        </span>
                      </Link>
                    </td>
                    <td>{action.actionType}</td>
                    <td>{action.status}</td>
                    <td>{action.topicSlugs.join(', ')}</td>
                    <td>{new Date(action.updatedAt).toLocaleString()}</td>
                  </tr>
                  <tr className="adminTableSummaryRow">
                    <td className="adminTableSummaryCell" colSpan={5}>
                      <p className="adminTableCellMeta">{action.summary}</p>
                    </td>
                  </tr>
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </section>
    </section>
  );
}
