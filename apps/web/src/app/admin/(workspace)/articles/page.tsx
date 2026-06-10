import { Fragment } from 'react';
import type { EntityStatus } from '@signal-fire/api-contracts';
import Link from 'next/link';
import { withAdminAuthRedirect } from '@/lib/admin/auth-redirect';
import { getAdminArticlesList } from '@/lib/api/admin.server';
import { formatAdminDateTime } from '@/lib/common/time';
import { normalizeDisplaySummary } from '@/lib/common/utils';

export const dynamic = 'force-dynamic';

type ArticleListPageProps = {
  searchParams: Promise<{
    status?: string;
  }>;
};

function parseStatus(value?: string): EntityStatus {
  return value === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT';
}

function buildArticlesHref(status: EntityStatus) {
  const params = new URLSearchParams();
  params.set('status', status);
  return `/admin/articles?${params.toString()}`;
}

export default async function ArticlesListPage({ searchParams }: ArticleListPageProps) {
  const { status } = await searchParams;
  const currentStatus = parseStatus(status);
  const articleList = await withAdminAuthRedirect(buildArticlesHref(currentStatus), async () => {
    return await getAdminArticlesList({ status: currentStatus });
  });

  return (
    <section className="page-section articleEditorPage">
      <header className="adminHeader">
        <div>
          <h1 className="pageTitle">Articles</h1>
          <p className="adminDek">Create and maintain curated public articles.</p>
        </div>

        <div className="ctaRow">
          <Link href="/admin/articles/new" className="primaryCTA">
            New Article
          </Link>
        </div>
      </header>

      <div className="adminFilterArticleLabel">Article status filter</div>
      <nav className="adminSegmentedControl" aria-label="Article status">
        <Link
          href={buildArticlesHref('DRAFT')}
          aria-current={currentStatus === 'DRAFT' ? 'page' : undefined}
        >
          Draft
        </Link>
        <Link
          href={buildArticlesHref('PUBLISHED')}
          aria-current={currentStatus === 'PUBLISHED' ? 'page' : undefined}
        >
          Published
        </Link>
      </nav>

      <section className="adminPanel" aria-labelledby="admin-articles-heading">
        <div className="adminPanelHeader">
          <h2 id="admin-articles-heading">Article records</h2>
        </div>

        <table className="adminTable adminRecordTable adminRecordTableArticles">
          <colgroup>
            <col className="adminRecordTablePrimaryCol" />
            <col className="adminRecordTableStatusCol" />
            <col className="adminRecordTableTopicsCol" />
            <col className="adminRecordTableDateCol" />
          </colgroup>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Topics</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {articleList.items.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  <div className="adminEmptyState">
                    <p className="adminEmptyStateTitle">No articles yet.</p>
                    <p>Create an article to populate this list.</p>
                  </div>
                </td>
              </tr>
            ) : (
              articleList.items.map((article) => (
                <Fragment key={article.id}>
                  <tr>
                    <td>
                      <Link
                        href={`articles/${article.slug}`}
                        className="adminTableRecordLink"
                        aria-label={`Open article ${article.title}`}
                      >
                        <span className="adminTableRecordTitle">
                          {article.title} <span aria-hidden="true">→</span>
                        </span>
                      </Link>
                    </td>
                    <td>{article.status}</td>
                    <td>{article.topicSlugs.join(', ')}</td>
                    <td>{formatAdminDateTime(article.updatedAt)}</td>
                  </tr>
                  <tr className="adminTableSummaryRow">
                    <td className="adminTableSummaryCell" colSpan={4}>
                      <p className="adminTableCellMeta">
                        {normalizeDisplaySummary(article.summary)}
                      </p>
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
