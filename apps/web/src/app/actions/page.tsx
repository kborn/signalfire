import { getActionsList } from '@/lib/api/actions';
import Link from 'next/link';
export const dynamic = 'force-dynamic';

function getNoResultsResponse() {
  return (
    <section className="page-section">
      <h1>Actions</h1>
      <p>No actions available yet.</p>
    </section>
  );
}

export default async function ActionListPage() {
  const actions = await getActionsList();
  if (actions.items.length === 0) {
    return getNoResultsResponse();
  }
  return (
    <section className="page-section">
      <h1>Actions</h1>
      <p>Find ways to take meaningful action</p>
      {actions.items.map((action) => (
        <div key={action.id}>
          <h2>
            <Link href={`actions/${action.slug}`}>{action.title}</Link>
          </h2>
          <p>{action.summary}</p>
        </div>
      ))}
    </section>
  );
}
