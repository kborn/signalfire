import {
  EntityStatus,
  ModerationSubmissionDetail,
  SubmissionType,
} from '@signal-fire/api-contracts';
import Link from 'next/link';

export default function ReviewOutcomePanel({
  submission,
}: {
  submission: ModerationSubmissionDetail;
}) {
  function getHref(recordType: SubmissionType, publishStatus: EntityStatus) {
    if (publishStatus === 'PUBLISHED') {
      if (recordType === 'EVENT') {
        return `/events/${submission.createdRecord?.id}`;
      }
      return `/articles/${submission.createdRecord?.slug}`;
    }
    if (recordType === 'EVENT') {
      return `/admin/events/${submission.createdRecord?.id}`;
    }
    return `/admin/articles/${submission.createdRecord?.slug}`;
  }

  return (
    <section className="adminPanel" aria-labelledby="review-outcome-heading">
      <div className="adminPanelHeader">
        <h2 id="review-outcome-heading">Review outcome</h2>
      </div>

      <dl className="adminDefinitionList">
        <dt>Decision</dt>
        <dd>{submission.status === 'APPROVED' ? 'Approved' : 'Rejected'}</dd>

        <dt>Reviewed</dt>
        <dd>{submission.reviewedAt ? new Date(submission.reviewedAt).toLocaleString() : '--'}</dd>

        <dt>Review notes</dt>
        <dd>{submission.reviewNotes || '--'}</dd>
      </dl>
      {submission.status === 'APPROVED' && submission.createdRecord && (
        <div className="adminCreatedRecord">
          <p className="adminCreatedRecordLabel">
            Created {submission.createdRecord.recordType === 'ARTICLE' ? 'article' : 'event'}
          </p>

          <p className="adminCreatedRecordTitle">{submission.createdRecord.title}</p>

          <dl className="adminCreatedRecordDetails">
            <dt>
              {submission.createdRecord.recordType === 'ARTICLE'
                ? 'Article status'
                : 'Event status'}
            </dt>
            <dd>
              {submission.createdRecord.publishStatus === 'PUBLISHED' ? 'Published' : 'Draft'}
            </dd>
          </dl>

          <Link
            className="adminCreatedRecordLink"
            href={getHref(
              submission.createdRecord.recordType,
              submission.createdRecord.publishStatus,
            )}
          >
            {submission.createdRecord.publishStatus === 'PUBLISHED'
              ? 'View live page'
              : 'Open in admin'}
          </Link>
        </div>
      )}
    </section>
  );
}
