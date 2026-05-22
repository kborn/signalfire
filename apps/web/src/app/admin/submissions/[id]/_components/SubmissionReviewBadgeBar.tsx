import { SubmissionStatus, SubmissionType } from '@signal-fire/api-contracts';

export default function SubmissionReviewBadgeBar({
  submissionType,
  status,
  submittedAt,
}: {
  submissionType: SubmissionType;
  status: SubmissionStatus;
  submittedAt: string;
}) {
  return (
    <section className="adminToolbar" aria-label="Submission status summary">
      <span className="adminBadge">Type: {submissionType}</span>
      <span className="adminBadge">Status: {status}</span>
      <span className="adminBadge">Submitted: {new Date(submittedAt).toLocaleDateString()}</span>
    </section>
  );
}
