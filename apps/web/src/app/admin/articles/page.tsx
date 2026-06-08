import type { EntityStatus } from '@signal-fire/api-contracts';
import Link from 'next/link';
import { getAdminArticlesList } from '@/lib/api/admin.server';

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
  const articleList = await getAdminArticlesList({ status: currentStatus });
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

        <table className="adminTable">
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
                <tr key={article.id}>
                  <td colSpan={4}>
                    <Link
                      href={`/admin/articles/${article.slug}`}
                      className="adminTableRecordLink adminTableRowLink"
                      aria-label={`Open article ${article.title}`}
                    >
                      <span className="adminTableRowPrimary">
                        <span className="adminTableRecordTitle">
                          {article.title} <span aria-hidden="true">→</span>
                        </span>
                        <span className="adminTableCellMeta">{article.summary}</span>
                      </span>
                      <span className="adminTableRowCell">{article.status}</span>
                      <span className="adminTableRowCell">{article.topicSlugs.join(', ')}</span>
                      <span className="adminTableRowCell">
                        {new Date(article.updatedAt).toLocaleString()}
                      </span>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </section>
  );
}
