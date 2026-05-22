import { ModerationSubmissionDetail, TopicListResponse } from '@signal-fire/api-contracts';

import ReviewDecisionPanel from './_components/ReviewDecisionPanel';
import SubmittedContentPanel from './_components/SubmittedContentPanel';
import SubmissionMetadataPanel from './_components/SubmissionMetadataPanel';
import SubmissionReviewHeader from './_components/SubmissionReviewHeader';
import SubmissionReviewBadgeBar from './_components/SubmissionReviewBadgeBar';

export default function SubmissionReviewPageContent({
  submission,
  topics,
}: {
  submission: ModerationSubmissionDetail;
  topics: TopicListResponse;
}) {
  return (
    <section className="page-section">
      <SubmissionReviewHeader />
      <SubmissionReviewBadgeBar
        submissionType={submission.submissionType}
        status={submission.status}
        submittedAt={submission.submittedAt}
      />

      <SubmissionMetadataPanel submission={submission} />
      <div className="adminReviewMain">
        <SubmittedContentPanel submission={submission} />
        <ReviewDecisionPanel submission={submission} topics={topics.items} />
      </div>
    </section>
  );
}
