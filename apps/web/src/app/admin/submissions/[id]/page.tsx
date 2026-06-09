import Link from 'next/link';
import { getSubmissionsDetails } from '@/lib/api/admin.server';
import { withAdminAuthRedirect } from '@/lib/admin/auth-redirect';

import { getTopicsList } from '@/lib/api/topics';
import SubmissionReviewPageContent from './SubmissionReviewPageContent';

export const dynamic = 'force-dynamic';

export default async function SubmissionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [submission, topics] = await withAdminAuthRedirect(async () => {
    return await Promise.all([getSubmissionsDetails(Number(id)), getTopicsList()]);
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
