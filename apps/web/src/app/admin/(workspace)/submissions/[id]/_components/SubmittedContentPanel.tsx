import { ModerationSubmissionDetail } from '@signal-fire/api-contracts';
import { formatEventTime } from '@/lib/common/time';

type ArticleModerationSubmission = Extract<
  ModerationSubmissionDetail,
  { submissionType: 'ARTICLE' }
>;

type EventModerationSubmission = Extract<ModerationSubmissionDetail, { submissionType: 'EVENT' }>;

function ArticleSubmittedContent({ submission }: { submission: ArticleModerationSubmission }) {
  return (
    <dl className="adminDefinitionList">
      <dt>Title</dt>
      <dd>{submission.submittedContent.title}</dd>
      <dt>Summary</dt>
      <dd>{submission.submittedContent.summary}</dd>
      <dt>Content</dt>
      <dd>
        <div className="adminLongTextPreview">{submission.submittedContent.content}</div>
      </dd>
      <dt>Author</dt>
      <dd>{submission.submittedContent.author ?? '--'}</dd>
      <dt>Topics</dt>
      <dd>
        <ul className="adminInlineList">
          {submission.submittedContent.topics.map((topic) => (
            <li key={topic.id}>{topic.name}</li>
          ))}
        </ul>
      </dd>
      <dt>Resource Links</dt>
      <dd>
        <ul className="adminInlineList">
          {submission.submittedContent.resourceLinks.map((link) => (
            <li key={link}>
              <a href={link}>{link}</a>
            </li>
          ))}
        </ul>
      </dd>
    </dl>
  );
}

function EventSubmittedContent({ submission }: { submission: EventModerationSubmission }) {
  const eventLocation = {
    city: submission.submittedContent.city,
    region: submission.submittedContent.region,
    country: submission.submittedContent.country,
  };
  const startTimeLabel = formatEventTime(
    submission.submittedContent.startTime,
    null,
    eventLocation,
  );
  const endTimeLabel = submission.submittedContent.endTime
    ? formatEventTime(submission.submittedContent.endTime, null, eventLocation)
    : '--';

  return (
    <dl className="adminDefinitionList">
      <dt>Title</dt>
      <dd>{submission.submittedContent.title}</dd>
      <dt>Summary</dt>
      <dd>{submission.submittedContent.summary}</dd>
      <dt>Description</dt>
      <dd>{submission.submittedContent.description}</dd>
      <dt>Event Type</dt>
      <dd>{submission.submittedContent.eventType}</dd>
      <dt>Start date and time</dt>
      <dd>{startTimeLabel}</dd>
      <dt>End date and time</dt>
      <dd>{endTimeLabel}</dd>
      <dt>Location Name</dt>
      <dd>{submission.submittedContent.locationName}</dd>
      <dt>Location Description</dt>
      <dd>{submission.submittedContent.publicLocationDescription ?? '--'}</dd>
      <dt>Address Line 1</dt>
      <dd>{submission.submittedContent.addressLine1 ?? '--'}</dd>
      <dt>Address Line 2</dt>
      <dd>{submission.submittedContent.addressLine2 ?? '--'}</dd>
      <dt>City</dt>
      <dd>{submission.submittedContent.city}</dd>
      <dt>State</dt>
      <dd>{submission.submittedContent.region}</dd>
      <dt>Country</dt>
      <dd>{submission.submittedContent.country}</dd>
      <dt>ZIP Code</dt>
      <dd>{submission.submittedContent.postalCode ?? '--'}</dd>
      <dt>Website URL</dt>
      <dd>{submission.submittedContent.website ?? '--'}</dd>
      <dt>Contact Email</dt>
      <dd>{submission.submittedContent.contactEmail ?? '--'}</dd>
      <dt>Topics</dt>
      <dd>
        <ul className="adminInlineList">
          {submission.submittedContent.topics.map((topic) => (
            <li key={topic.id}>{topic.name}</li>
          ))}
        </ul>
      </dd>
    </dl>
  );
}

export default function SubmittedContentPanel({
  submission,
}: {
  submission: ModerationSubmissionDetail;
}) {
  return (
    <section className="adminPanel" aria-labelledby="submitted-content-heading">
      <div className="adminPanelHeader">
        <h2 id="submitted-content-heading">Submitted content</h2>
      </div>
      {submission.submissionType === 'ARTICLE' ? (
        <ArticleSubmittedContent submission={submission} />
      ) : (
        <EventSubmittedContent submission={submission} />
      )}
    </section>
  );
}
