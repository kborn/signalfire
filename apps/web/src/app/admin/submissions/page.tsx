import Link from 'next/link';
import type { SubmissionStatus, SubmissionType } from '@signal-fire/api-contracts';
import { getSubmissionsList } from '@/lib/api/admin.server';
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

function parseStatus(value?: string): SubmissionStatus {
  if (value === 'APPROVED' || value === 'REJECTED' || value === 'PENDING') {
    return value;
  }
  return 'PENDING';
}

function parseType(value?: string): SubmissionType | undefined {
  if (value === 'ARTICLE' || value === 'EVENT') {
    return value;
  }
  return undefined;
}

function getEmptyStateCopy(status: SubmissionStatus, type?: SubmissionType) {
  const typeLabel =
    type === 'ARTICLE'
      ? 'article submissions'
      : type === 'EVENT'
        ? 'event submissions'
        : 'submissions';

  if (type) {
    return {
      headline: `No ${typeLabel.toLowerCase()} match this ${status.toLowerCase()} view.`,
      description: 'Try a different status or clear the type filter to review all submissions.',
    };
  }

  if (status === 'APPROVED') {
    return {
      headline: 'No approved submissions yet.',
      description: 'Approved submissions will appear here after moderators publish them.',
    };
  }

  if (status === 'REJECTED') {
    return {
      headline: 'No rejected submissions yet.',
      description: 'Rejected submissions will appear here after moderators decline them.',
    };
  }

  return {
    headline: 'No pending submissions right now.',
    description: 'New community article and event submissions will appear here for review.',
  };
}

export default async function SubmissionListPage({ searchParams }: SubmissionListPageProps) {
  const { status, type } = await searchParams;
  const currentStatus = parseStatus(status);
  const currentType = parseType(type);
  const submissionList = await getSubmissionsList({
    status: currentStatus,
    submissionType: currentType,
  });
  const submissions = submissionList.items;
  const emptyState = getEmptyStateCopy(currentStatus, currentType);
  const tableHeaders = ['Title', 'Type', 'Status', 'Submitted', 'Submitter', 'Email'];
  const tableBody =
    submissions.length > 0 ? (
      submissions.map((submission) => (
        <tr key={submission.id}>
          <td>
            <Link href={`/admin/submissions/${submission.id}`} className="adminTableLink">
              {submission.title} <span aria-hidden="true">→</span>
            </Link>
            <p className="adminTableCellMeta">{submission.summary}</p>
          </td>
          <td>{submission.submissionType}</td>
          <td>{submission.status}</td>
          <td>{new Date(submission.submittedAt).toLocaleString()}</td>
          <td>{submission.submitterName ?? 'Anonymous'}</td>
          <td>{submission.submitterEmail ?? 'Not provided'}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={tableHeaders.length}>
          <div className="adminEmptyState">
            <p className="adminEmptyStateTitle">{emptyState.headline}</p>
            <p>{emptyState.description}</p>
          </div>
        </td>
      </tr>
    );
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
              {tableHeaders.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>{tableBody}</tbody>
        </table>
      </section>
    </section>
  );
}
