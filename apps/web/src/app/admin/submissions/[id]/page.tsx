import Link from 'next/link';
import { getSubmissionsDetails } from '@/lib/api/admin';
import { TopicListResponse } from '@signal-fire/api-contracts';

import { getTopicsList } from '@/lib/api/topics';
import SubmissionReviewPageContent from './SubmissionReviewPageContent';

export const dynamic = 'force-dynamic';

export default async function SubmissionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const submission = await getSubmissionsDetails(Number(id));
  const topics: TopicListResponse = await getTopicsList();

  return (
    <section className="page-section">
      <Link href="/admin/submissions" className="adminTableLink">
        Back to submissions
      </Link>
      <SubmissionReviewPageContent submission={submission} topics={topics} />
    </section>
  );
}
