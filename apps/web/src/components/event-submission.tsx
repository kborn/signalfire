'use client';
import { TopicSummary } from '@signal-fire/api-contracts';
import type { ComponentProps } from 'react';
import { useState } from 'react';

type EventSubmissionFormProps = {
  topics: TopicSummary[];
};

type FormSubmitHandler = NonNullable<ComponentProps<'form'>['onSubmit']>;

type ArticleSubmissionFormErrors = {
  title?: string;
  summary?: string;
  description?: string;
  eventType?: string;
  startAt?: string;
  endAt?: string;
  locationName?: string;
  city?: string;
  region?: string;
  country?: string;
  streetAddress?: string;
  topicSlugs?: string;
  resourceLinks?: string;
  submitterName?: string;
  submitterEmail?: string;
};

export function EventSubmissionForm({ topics }: EventSubmissionFormProps) {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState('');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [locationName, setLocationName] = useState('');
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [country, setCountry] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [topicSlugs, setTopicSlugs] = useState<string[]>([]);
  const [resourceLinks, setResourceLinks] = useState(['']);
  const [submitterName, setSubmitterName] = useState('');
  const [submitterEmail, setSubmitterEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<ArticleSubmissionFormErrors>({});

  const handleToggle = (topic: string) => {
    setTopicSlugs(
      (prev) =>
        prev.includes(topic)
          ? prev.filter((t) => t !== topic) // Remove if already checked
          : [...prev, topic], // Add if not checked
    );
  };

  const handleResourceLinkChange = (index: number, value: string) => {
    setResourceLinks((prev) =>
      prev.map((link, currentIndex) => (currentIndex === index ? value : link)),
    );
  };

  function addResourceLink() {
    setResourceLinks((prev) => [...prev, '']);
  }

  function hasResourceLink() {
    return resourceLinks.length > 1 || resourceLinks[0].trim() != '';
  }

  function removeResourceLink(index: number) {
    setResourceLinks((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
  }

  const submit: FormSubmitHandler = async (event) => {
    event.preventDefault();
  };

  return (
    <form className={'submissionForm'} onSubmit={submit}>
      <section className="page-section">
        <h1 className="pageTitle">Submit an Event</h1>
        <p className="page-intro">Share an event others can attend and participate in</p>
        <p className="metaText">Submissions are reviewed before publication.</p>
        <p className="metaText">Fields marked with * are required.</p>
        <section className="submissionSection">
          <h2>Basic Information</h2>
          <section className="submissionField">
            <label className="submissionLabel">
              <span>* Title</span>
              <input
                className={'submissionControl'}
                value={title}
                placeholder="Title"
                onChange={(event) => setTitle(event.target.value)}
              />
            </label>
            {errors.title ? <p className="submissionError">{errors.title}</p> : null}
          </section>

          <section className="submissionField">
            <label className="submissionLabel">
              <span>* Summary</span>
              <textarea
                className="submissionTextarea"
                value={summary}
                placeholder="Briefly describe the event"
                rows={4}
                onChange={(event) => setSummary(event.target.value)}
              />
            </label>
            {errors.summary ? <p className="submissionError">{errors.summary}</p> : null}
          </section>

          <section className="submissionField">
            <label className="submissionLabel">
              <span>* Description</span>
              <textarea
                className="submissionTextarea"
                value={description}
                placeholder="Provide additional details about the event"
                rows={12}
                onChange={(event) => setDescription(event.target.value)}
              />
            </label>
            {errors.description ? <p className="submissionError">{errors.description}</p> : null}
          </section>

          <section className="submissionField">
            <label className="submissionLabel">
              <span>* Event Type</span>
              <select
                className="submissionControl"
                value={eventType}
                onChange={(event) => setEventType(event.target.value)}
              >
                <option value="">Select an event type</option>
                <option value="TOWN_HALL">Town Hall</option>
                <option value="PROTEST">Protest</option>
                <option value="RALLY">Rally</option>
                <option value="VOLUNTEER">Volunteer</option>
                <option value="WORKSHOP">Workshop</option>
                <option value="MEETING">Meeting</option>
              </select>
            </label>
            {errors.eventType ? <p className="submissionError">{errors.eventType}</p> : null}
          </section>
        </section>

        <section className="submissionSection">
          <h2>Date and Time</h2>

          <div className="submissionFieldRow">
            <section className="submissionField">
              <label className="submissionLabel">
                <span>* Start date and time</span>
                <input
                  type="datetime-local"
                  className="submissionControl"
                  value={startAt}
                  onChange={(event) => setStartAt(event.target.value)}
                />
              </label>
              {errors.startAt ? <p className="submissionError">{errors.startAt}</p> : null}
            </section>

            <section className="submissionField">
              <label className="submissionLabel">
                <span>End date and time (optional)</span>
                <input
                  className="submissionControl"
                  value={endAt}
                  type="datetime-local"
                  onChange={(event) => setEndAt(event.target.value)}
                />
              </label>
              {errors.endAt ? <p className="submissionError">{errors.endAt}</p> : null}
            </section>
          </div>
        </section>

        <section className="submissionSection">
          <h2>Location</h2>
          <section className="submissionField">
            <label className="submissionLabel">
              <span>* Location Name</span>
              <input
                className={'submissionControl'}
                value={locationName}
                placeholder="Community Center"
                onChange={(event) => setLocationName(event.target.value)}
              />
            </label>
            {errors.locationName ? <p className="submissionError">{errors.locationName}</p> : null}
          </section>

          <section className="submissionField">
            <label className="submissionLabel">
              <span>* City</span>
              <input
                className={'submissionControl'}
                value={city}
                placeholder="Philadelphia"
                onChange={(event) => setCity(event.target.value)}
              />
            </label>
            {errors.city ? <p className="submissionError">{errors.city}</p> : null}
          </section>

          <section className="submissionField">
            <label className="submissionLabel">
              <span>* Region</span>
              <input
                className={'submissionControl'}
                value={region}
                placeholder="PA"
                onChange={(event) => setRegion(event.target.value)}
              />
            </label>
            {errors.region ? <p className="submissionError">{errors.region}</p> : null}
          </section>

          <section className="submissionField">
            <label className="submissionLabel">
              <span>* Country</span>
              <input
                className={'submissionControl'}
                value={country}
                placeholder="US"
                onChange={(event) => setCountry(event.target.value)}
              />
            </label>
            {errors.country ? <p className="submissionError">{errors.country}</p> : null}
          </section>

          <section className="submissionField">
            <label className="submissionLabel">
              <span>Street Address (optional)</span>
              <input
                className={'submissionControl'}
                value={streetAddress}
                placeholder="123 Main St"
                onChange={(event) => setStreetAddress(event.target.value)}
              />
            </label>
            {errors.streetAddress ? (
              <p className="submissionError">{errors.streetAddress}</p>
            ) : null}
          </section>
        </section>

        <section className="submissionSection">
          <h2>Topics</h2>
          <section className="submissionField">
            <div className="submissionLabel">* Topics</div>
            <p className="submissionHelper">Select at least one topic</p>
            <div className="submissionCheckboxGroup" aria-label="Topics">
              {topics.map((topic) => (
                <label className="submissionCheckboxOption" key={topic.name}>
                  <input
                    type="checkbox"
                    checked={topicSlugs.includes(topic.slug)}
                    onChange={() => handleToggle(topic.slug)}
                  />
                  {topic.name}
                </label>
              ))}
            </div>
            {errors.topicSlugs ? <p className="submissionError">{errors.topicSlugs}</p> : null}
          </section>
        </section>

        <section className="submissionSection">
          <h2>Supporting Links</h2>
          <section className="submissionField">
            <div className="submissionLabel">Supporting links (optional)</div>
            <p className="submissionHelper">Add links that help verify claims or provide context</p>
            <div className="submissionRepeatableList">
              {resourceLinks.map((link, index) => (
                <div className="submissionRepeatableRow" key={index}>
                  <label className="submissionLabel" htmlFor={`article-resource-link-${index}`}>
                    Resource link {index + 1}
                  </label>
                  <input
                    id={`article-resource-link-${index}`}
                    className="submissionControl"
                    type="url"
                    placeholder="https://example.org/source"
                    value={link}
                    onChange={(event) => handleResourceLinkChange(index, event.target.value)}
                  />
                  {hasResourceLink() ? (
                    <button
                      className="submissionSecondaryAction"
                      type="button"
                      onClick={() => removeResourceLink(index)}
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
              ))}
              <button
                className="submissionSecondaryAction"
                type="button"
                onClick={() => addResourceLink()}
              >
                Add Another Resource
              </button>
            </div>
            {errors.resourceLinks ? (
              <p className="submissionError">{errors.resourceLinks}</p>
            ) : null}
          </section>
        </section>

        <section className="submissionSection">
          <h2>Contact Information</h2>
          <section className="submissionField">
            <label className="submissionLabel">
              <span>Name (optional)</span>
              <input
                className={'submissionControl'}
                value={submitterName}
                placeholder="Your name"
                onChange={(event) => setSubmitterName(event.target.value)}
              />
            </label>

            {errors.submitterName ? (
              <p className="submissionError">{errors.submitterName}</p>
            ) : null}
          </section>

          <section className="submissionField">
            <label className="submissionLabel" htmlFor="event-submitter-email">
              Email (optional)
            </label>
            <span className="submissionHelper">
              Used only if we need to follow up about your submission
            </span>
            <input
              id="event-submitter-email"
              className={'submissionControl'}
              value={submitterEmail}
              placeholder="name@example.com"
              type={'email'}
              onChange={(event) => setSubmitterEmail(event.target.value)}
            />
            {errors.submitterEmail ? (
              <p className="submissionError">{errors.submitterEmail}</p>
            ) : null}
          </section>
        </section>
      </section>
    </form>
  );
}
