import Link from 'next/link';
import { getAdminTopicsList } from '@/lib/api/admin.server';
import { withAdminAuthRedirect } from '@/lib/admin/auth-redirect';

export const dynamic = 'force-dynamic';

export default async function AdminTopicsPage() {
  const topics = await withAdminAuthRedirect('/admin/topics', () => getAdminTopicsList());

  return (
    <section className="page-section">
      <header className="adminHeader">
        <div>
          <h1 className="pageTitle">Issues</h1>
          <p className="adminDek">
            Manage the issue categories that organize articles, actions, and events.
          </p>
        </div>
        <div className="adminHeaderActions">
          <Link href="/admin/topics/new" className="primaryCTA">
            New Issue
          </Link>
        </div>
      </header>

      <div className="adminPanel">
        <table className="adminTable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Articles</th>
              <th>Actions</th>
              <th>Events</th>
            </tr>
          </thead>
          <tbody>
            {topics.items.length === 0 ? (
              <tr>
                <td colSpan={5}>No issues found.</td>
              </tr>
            ) : (
              topics.items.map((topic) => (
                <tr key={topic.slug}>
                  <td>
                    <Link href={`/admin/topics/${topic.slug}`} className="adminTableLink">
                      {topic.name}
                    </Link>
                  </td>
                  <td className="adminTableCellMeta">{topic.slug}</td>
                  <td>{topic.articleCount}</td>
                  <td>{topic.actionCount}</td>
                  <td>{topic.eventCount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
