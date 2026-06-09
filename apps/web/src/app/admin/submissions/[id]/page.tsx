import Link from 'next/link';
import { getSubmissionsDetails } from '@/lib/api/admin.server';
import { withAdminAuthRedirect } from '@/lib/admin/auth-redirect';
import { parsePositiveIntOrNotFound, withNotFoundOn404 } from '@/lib/admin/not-found';

import { getTopicsList } from '@/lib/api/topics';
import SubmissionReviewPageContent from './SubmissionReviewPageContent';

export const dynamic = 'force-dynamic';

async function fetchSubmissionDetails(id: string) {
  const submissionId = parsePositiveIntOrNotFound(id);
  return await withNotFoundOn404(async () => getSubmissionsDetails(submissionId));
}

export default async function SubmissionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [submission, topics] = await withAdminAuthRedirect(async () => {
    return await Promise.all([fetchSubmissionDetails(id), getTopicsList()]);
  });

  return (
    <section className="page-section">
      <Link href="/admin/submissions" className="adminTableLink">
        Back to submissions
      </Link>
      <SubmissionReviewPageContent submission={submission} topics={topics} />
    </section>
  );
}
