import Link from 'next/link';

export const dynamic = 'force-dynamic';

type SubmissionListPageProps = {
  searchParams: Promise<{
    status?: string;
    type?: string;
  }>;
};

function buildSubmissionsHref({ status, type }: { status: string; type?: string }) {
  const params = new URLSearchParams();

  params.set('status', status);

  if (type) {
    params.set('type', type);
  }

  const query = params.toString();
  return query ? `/admin/submissions?${query}` : '/admin/submissions';
}

export default async function SubmissionListPage({ searchParams }: SubmissionListPageProps) {
  const { status, type } = await searchParams;
  const currentStatus = status ?? 'PENDING';
  const currentType = type;

  return (
    <section className="page-section">
      <h1 className="pageTitle">Submissions</h1>
      <p className="adminDek">Review community-submitted articles and events.</p>
      <div className="submissionFilterActionLabel">Submissions Status Filter</div>
      <nav className="adminSegmentedControl" aria-label="Submission status">
        <Link
          href={buildSubmissionsHref({ status: 'PENDING', type: currentType })}
          aria-current={currentStatus === 'PENDING' ? 'page' : undefined}
        >
          Pending
        </Link>
        <Link
          href={buildSubmissionsHref({ status: 'APPROVED', type: currentType })}
          aria-current={currentStatus === 'APPROVED' ? 'page' : undefined}
        >
          Approved
        </Link>
        <Link
          href={buildSubmissionsHref({ status: 'REJECTED', type: currentType })}
          aria-current={currentStatus === 'REJECTED' ? 'page' : undefined}
        >
          Rejected
        </Link>
      </nav>
      <div className="submissionFilterActionLabel">Submissions Type Filter</div>
      <div className="adminFilterGroup" aria-label="Submission type">
        <Link
          href={buildSubmissionsHref({ status: currentStatus })}
          aria-current={currentType == null ? 'page' : undefined}
        >
          All
        </Link>
        <Link
          href={buildSubmissionsHref({ status: currentStatus, type: 'ARTICLE' })}
          aria-current={currentType === 'ARTICLE' ? 'page' : undefined}
        >
          Article
        </Link>
        <Link
          href={buildSubmissionsHref({ status: currentStatus, type: 'EVENT' })}
          aria-current={currentType === 'EVENT' ? 'page' : undefined}
        >
          Event
        </Link>
      </div>
      <section className="adminPanel" aria-labelledby="queue-records-heading">
        <div className="adminPanelHeader">
          <h3 id="queue-records-heading">Submission records</h3>
        </div>

        <table className="adminTable">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Status</th>
              <th>Submitted</th>
              <th>Submitter</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Link href="/admin/submissions/1" className="adminTableLink">
                  Sample submission <span aria-hidden="true">→</span>
                </Link>
                <p className="adminTableCellMeta">
                  A short summary of the submitted content will appear here.
                </p>
              </td>
              <td>Article</td>
              <td>Pending</td>
              <td>Not connected</td>
              <td>Anonymous</td>
              <td>Not provided</td>
            </tr>
          </tbody>
        </table>
      </section>
    </section>
  );
}
