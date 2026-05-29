import Link from 'next/link';
import { getSubmissionsList } from '@/lib/api/admin';
import type { SubmissionStatus } from '@signal-fire/api-contracts';

export const dynamic = 'force-dynamic';

async function getSubmissionCount(status: SubmissionStatus): Promise<number> {
  const result = await getSubmissionsList({ status });
  return result.items.length;
}

export default async function AdminPage() {
  const [pendingCount, approvedCount, rejectedCount] = await Promise.all([
    getSubmissionCount('PENDING'),
    getSubmissionCount('APPROVED'),
    getSubmissionCount('REJECTED'),
  ]);

  return (
    <section className="page-section">
      <h1 className="pageTitle">Admin</h1>
      <p className="adminDek">Review submissions and manage published content.</p>
      <section className="adminSection" aria-labelledby="moderation-heading">
        <h2 id="moderation-heading">Moderation</h2>

        <div className="adminGrid">
          <section className="adminPanel" aria-labelledby="pending-review-heading">
            <div className="adminPanelHeader">
              <h3 id="pending-review-heading">Pending review</h3>
            </div>

            <p className="adminStat">{pendingCount}</p>
            <p>Submissions awaiting review are the primary moderation queue.</p>

            <Link href="/admin/submissions?status=PENDING" className="secondaryCTA">
              Review pending submissions
            </Link>
          </section>
          <section className="adminPanel" aria-labelledby="approved-heading">
            <div className="adminPanelHeader">
              <h3 id="approved-heading">Approved</h3>
            </div>

            <p className="adminStat">{approvedCount}</p>
            <p>Reviewed submissions remain available for traceability and moderation history.</p>

            <Link href="/admin/submissions?status=APPROVED" className="secondaryCTA">
              View approved submissions
            </Link>
          </section>

          <section className="adminPanel" aria-labelledby="rejected-heading">
            <div className="adminPanelHeader">
              <h3 id="rejected-heading">Rejected</h3>
            </div>

            <p className="adminStat">{rejectedCount}</p>
            <p>Reviewed submissions remain available for traceability and moderation history.</p>

            <Link href="/admin/submissions?status=REJECTED" className="secondaryCTA">
              View rejected submissions
            </Link>
          </section>
        </div>
      </section>
      <section className="adminPanel" aria-labelledby="content-management-heading">
        <div className="adminPanelHeader">
          <h2 id="content-management-heading">Content management</h2>
        </div>

        <table className="adminTable">
          <thead>
            <tr>
              <th>Area</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Link href="/admin/actions" className="adminTableLink">
                  Actions <span aria-hidden="true">→</span>
                </Link>
              </td>
              <td>Curated civic actions users can take.</td>
            </tr>
            <tr>
              <td>
                <Link href="/admin/articles" className="adminTableLink">
                  Articles <span aria-hidden="true">→</span>
                </Link>
              </td>
              <td>Published explainers and editorial content.</td>
            </tr>
            <tr>
              <td>
                <Link href="/admin/events" className="adminTableLink">
                  Events <span aria-hidden="true">→</span>
                </Link>
              </td>
              <td>Real-world participation opportunities.</td>
            </tr>
          </tbody>
        </table>
      </section>
    </section>
  );
}
