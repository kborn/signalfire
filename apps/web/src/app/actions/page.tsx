import { getActionsList } from '@/lib/api/actions';
import { ActionSummary } from '@/components/action-summary';
export const dynamic = 'force-dynamic';

function getNoResultsResponse() {
  return (
    <section className="page-section">
      <h1 className="pageTitle">Actions</h1>
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
      <h1 className="pageTitle">Actions</h1>
      <p className="page-intro">Find ways to take meaningful action</p>
      <section className="collectionList">
        {actions.items.map((action) => (
          <ActionSummary key={action.id} action={action} />
        ))}
      </section>
    </section>
  );
}
