import { ModerationSubmissionDetail } from '@signal-fire/api-contracts';

export default function SubmissionReviewBadgeBar({
  submission,
}: {
  submission: ModerationSubmissionDetail;
}) {
  return (
    <section className="adminToolbar" aria-label="Submission status summary">
      <span className="adminBadge">Type: {submission.submissionType}</span>
      <span className="adminBadge">Status: {submission.status}</span>
      <span className="adminBadge">
        Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
      </span>
    </section>
  );
}
