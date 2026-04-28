'use client';
import { TopicSummary } from '@signal-fire/api-contracts';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import { postEventSubmission } from '@/lib/api/submit';
import { SubmissionError } from '@/lib/api/error';
import { EVENT_TYPES, EventType } from '@signal-fire/api-contracts';
import {
  mapSubmissionApiFieldToUiField,
  SUBMISSION_FIELD_LIMITS,
  validateOptionalEmail,
  validateOptionalStringMax,
  validateRequiredString,
} from '@/lib/submission-form-validation';

const US_STATE_OPTIONS = [
  ['AL', 'Alabama'],
  ['AK', 'Alaska'],
  ['AZ', 'Arizona'],
  ['AR', 'Arkansas'],
  ['CA', 'California'],
  ['CO', 'Colorado'],
  ['CT', 'Connecticut'],
  ['DE', 'Delaware'],
  ['DC', 'District of Columbia'],
  ['FL', 'Florida'],
  ['GA', 'Georgia'],
  ['HI', 'Hawaii'],
  ['ID', 'Idaho'],
  ['IL', 'Illinois'],
  ['IN', 'Indiana'],
  ['IA', 'Iowa'],
  ['KS', 'Kansas'],
  ['KY', 'Kentucky'],
  ['LA', 'Louisiana'],
  ['ME', 'Maine'],
  ['MD', 'Maryland'],
  ['MA', 'Massachusetts'],
  ['MI', 'Michigan'],
  ['MN', 'Minnesota'],
  ['MS', 'Mississippi'],
  ['MO', 'Missouri'],
  ['MT', 'Montana'],
  ['NE', 'Nebraska'],
  ['NV', 'Nevada'],
  ['NH', 'New Hampshire'],
  ['NJ', 'New Jersey'],
  ['NM', 'New Mexico'],
  ['NY', 'New York'],
  ['NC', 'North Carolina'],
  ['ND', 'North Dakota'],
  ['OH', 'Ohio'],
  ['OK', 'Oklahoma'],
  ['OR', 'Oregon'],
  ['PA', 'Pennsylvania'],
  ['RI', 'Rhode Island'],
  ['SC', 'South Carolina'],
  ['SD', 'South Dakota'],
  ['TN', 'Tennessee'],
  ['TX', 'Texas'],
  ['UT', 'Utah'],
  ['VT', 'Vermont'],
  ['VA', 'Virginia'],
  ['AS', 'American Samoa'],
  ['GU', 'Guam'],
  ['MP', 'Northern Mariana Islands'],
  ['PR', 'Puerto Rico'],
  ['VI', 'U.S. Virgin Islands'],
  ['WA', 'Washington'],
  ['WV', 'West Virginia'],
  ['WI', 'Wisconsin'],
  ['WY', 'Wyoming'],
] as const;

function formatEventTypeLabel(value: string): string {
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

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
  locationName?: string;
  city?: string;
  region?: string;
  country?: string;
  postalCode?: string;
  topicSlugs?: string;
  endAt?: string;
  streetAddress?: string;
  contactEmail?: string;
  websiteUrl?: string;
  submitterName?: string;
  submitterEmail?: string;
};

export function EventSubmissionForm({ topics }: EventSubmissionFormProps) {
  // ------ form fields --------
  // required
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState('');
  const [startAt, setStartAt] = useState('');
  const [locationName, setLocationName] = useState('');
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const country = 'US';
  const [topicSlugs, setTopicSlugs] = useState<string[]>([]);

  // optional
  const [endAt, setEndAt] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [submitterName, setSubmitterName] = useState('');
  const [submitterEmail, setSubmitterEmail] = useState('');
  // ------------------------

  // ------ submission flow control -----
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<ArticleSubmissionFormErrors>({});
  // ------------------------------------

  const handleToggle = (topic: string) => {
    setTopicSlugs(
      (prev) =>
        prev.includes(topic)
          ? prev.filter((t) => t !== topic) // Remove if already checked
          : [...prev, topic], // Add if not checked
    );
  };

  function parseLocalDateTime(value: string): Date | null {
    if (!value) {
      return null;
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return date;
  }

  function mapApiFieldToUiField(field: string): string | null {
    const sharedField = mapSubmissionApiFieldToUiField(field);
    if (sharedField) {
      return sharedField;
    }

    switch (field) {
      case 'payload.title':
        return 'title';
      case 'payload.summary':
        return 'summary';
      case 'payload.description':
        return 'description';
      case 'payload.eventType':
        return 'eventType';
      case 'payload.startDatetime':
        return 'startAt';
      case 'payload.endDatetime':
        return 'endAt';
      case 'payload.locationName':
        return 'locationName';
      case 'payload.locationAddressStreet':
        return 'streetAddress';
      case 'payload.locationAddressCity':
        return 'city';
      case 'payload.locationAddressRegion':
        return 'region';
      case 'payload.locationAddressCountry':
        return 'country';
      case 'payload.locationAddressZip':
        return 'postalCode';
      case 'payload.contactEmail':
        return 'contactEmail';
      case 'payload.topicSlugs':
        return 'topicSlugs';
      case 'payload.websiteUrl':
        return 'websiteUrl';
      case 'submitterName':
        return 'submitterName';
      case 'submitterEmail':
        return 'submitterEmail';
      default:
        return null;
    }
  }

  const submit: FormSubmitHandler = async (event) => {
    event.preventDefault();
    setSubmitError(null);
    setErrors({});

    // required strings can not be null due to the type in the contract
    const normalizedTitle = title.trim();
    const normalizedSummary = summary.trim();
    const normalizedDescription = description.trim();
    const normalizedEventType = eventType.trim() as EventType;
    const normalizedStartAt = startAt.trim();
    const normalizedLocationName = locationName.trim();
    const normalizedCity = city.trim();
    const normalizedRegion = region.trim();
    const normalizedCountry = country.trim();

    // optional fields nulled so as not to send empty strings in payload
    const normalizedEndAt = endAt.trim() || null;
    const normalizedStreetAddress = streetAddress.trim() || null;
    const normalizedPostalCode = postalCode.trim() || null;
    const normalizedContactEmail = contactEmail.trim() || null;
    const normalizedWebsiteUrl = websiteUrl.trim() || null;
    const normalizedSubmitterName = submitterName.trim() || null;
    const normalizedSubmitterEmail = submitterEmail.trim() || null;

    const startDate = parseLocalDateTime(normalizedStartAt);
    const endDate = normalizedEndAt ? parseLocalDateTime(normalizedEndAt) : null;

    const errors: ArticleSubmissionFormErrors = {};
    const titleError = validateRequiredString(
      normalizedTitle,
      'Title',
      SUBMISSION_FIELD_LIMITS.title,
    );
    if (titleError) {
      errors.title = titleError;
    }

    const summaryError = validateRequiredString(
      normalizedSummary,
      'Summary',
      SUBMISSION_FIELD_LIMITS.summary,
    );
    if (summaryError) {
      errors.summary = summaryError;
    }

    const descriptionError = validateRequiredString(
      normalizedDescription,
      'Description',
      SUBMISSION_FIELD_LIMITS.description,
    );
    if (descriptionError) {
      errors.description = descriptionError;
    }

    if (!eventType) {
      errors.eventType = 'Event type is required';
    }

    const locationNameError = validateRequiredString(
      normalizedLocationName,
      'Location name',
      SUBMISSION_FIELD_LIMITS.locationName,
    );
    if (locationNameError) {
      errors.locationName = locationNameError;
    }

    const cityError = validateRequiredString(
      normalizedCity,
      'Location address city',
      SUBMISSION_FIELD_LIMITS.locationAddressCity,
    );
    if (cityError) {
      errors.city = cityError;
    }

    const regionError = validateRequiredString(
      normalizedRegion,
      'Location address region',
      SUBMISSION_FIELD_LIMITS.locationAddressRegion,
    );
    if (regionError) {
      errors.region = regionError;
    }

    const countryError = validateRequiredString(
      normalizedCountry,
      'Location address country',
      SUBMISSION_FIELD_LIMITS.locationAddressCountry,
    );
    if (countryError) {
      errors.country = countryError;
    }

    if (topicSlugs.length === 0) {
      errors.topicSlugs = 'Select at least one related topic';
    }
    if (!normalizedStartAt) {
      errors.startAt = 'Start date and time is required';
    } else if (!startDate) {
      errors.startAt = 'Enter a valid start date and time';
    }
    if (normalizedEndAt && !endDate) {
      errors.endAt = 'Enter a valid end date and time';
    }
    if (startDate && endDate && endDate < startDate) {
      errors.endAt = 'End date and time must be after the start date and time';
    }

    const streetAddressError = validateOptionalStringMax(
      normalizedStreetAddress,
      SUBMISSION_FIELD_LIMITS.locationAddressStreet,
    );
    if (streetAddressError) {
      errors.streetAddress = streetAddressError;
    }

    const postalCodeError = validateOptionalStringMax(
      normalizedPostalCode,
      SUBMISSION_FIELD_LIMITS.locationAddressZip,
    );
    if (postalCodeError) {
      errors.postalCode = postalCodeError;
    }

    const contactEmailError = validateOptionalEmail(
      normalizedContactEmail,
      SUBMISSION_FIELD_LIMITS.contactEmail,
    );
    if (contactEmailError) {
      errors.contactEmail = contactEmailError;
    }

    const websiteUrlError = validateOptionalStringMax(
      normalizedWebsiteUrl,
      SUBMISSION_FIELD_LIMITS.websiteUrl,
    );
    if (websiteUrlError) {
      errors.websiteUrl = websiteUrlError;
    }

    const submitterNameError = validateOptionalStringMax(
      normalizedSubmitterName,
      SUBMISSION_FIELD_LIMITS.submitterName,
    );
    if (submitterNameError) {
      errors.submitterName = submitterNameError;
    }

    const submitterEmailError = validateOptionalEmail(
      normalizedSubmitterEmail,
      SUBMISSION_FIELD_LIMITS.submitterEmail,
    );
    if (submitterEmailError) {
      errors.submitterEmail = submitterEmailError;
    }

    setErrors(errors);
    if (Object.keys(errors).length == 0) {
      setIsSubmitting(true);
      try {
        await postEventSubmission({
          submissionType: 'EVENT',
          submitterName: normalizedSubmitterName,
          submitterEmail: normalizedSubmitterEmail,
          payload: {
            title: normalizedTitle,
            summary: normalizedSummary,
            description: normalizedDescription,
            eventType: normalizedEventType,
            startDatetime: startDate!.toISOString(),
            endDatetime: endDate ? endDate.toISOString() : null,
            locationName: normalizedLocationName,
            locationAddressStreet: normalizedStreetAddress,
            locationAddressCity: normalizedCity,
            locationAddressRegion: normalizedRegion,
            locationAddressCountry: normalizedCountry,
            locationAddressZip: normalizedPostalCode,
            contactEmail: normalizedContactEmail,
            topicSlugs: topicSlugs,
            websiteUrl: normalizedWebsiteUrl,
          },
        });
        setIsSuccess(true);
      } catch (error) {
        if (error instanceof SubmissionError) {
          if (error.errors) {
            const newEntries = error.errors.reduce((acc, e) => {
              const uiField = mapApiFieldToUiField(e.field);
              if (!uiField) {
                return acc;
              }
              return {
                ...acc,
                [uiField]: e.message,
              };
            }, {});

            if (Object.keys(newEntries).length > 0) {
              setErrors((prev) => ({ ...prev, ...newEntries }));
            } else {
              setSubmitError(
                'Something went wrong while sending your submission. Please try again.',
              );
            }
          } else {
            setSubmitError('Something went wrong while sending your submission. Please try again.');
          }
        } else {
          setSubmitError('Something went wrong while sending your submission. Please try again.');
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  if (isSuccess) {
    return (
      <div className={'submissionSuccess'}>
        <p className="section-label">Submission received</p>
        <h1 className="pageTitle">Thanks for submitting</h1>
        <p className="page-intro">
          Thanks — your submission has been received and is now pending review.
        </p>
        <p className="metaText">
          If you included an email address, we may contact you if we need clarification.
        </p>
      </div>
    );
  } else {
    return (
      <form className={'submissionForm'} onSubmit={submit} noValidate>
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
                  {EVENT_TYPES.map((eventType) => (
                    <option value={eventType} key={eventType}>
                      {formatEventTypeLabel(eventType)}
                    </option>
                  ))}
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
              {errors.locationName ? (
                <p className="submissionError">{errors.locationName}</p>
              ) : null}
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
                <select
                  className="submissionControl"
                  value={region}
                  onChange={(event) => setRegion(event.target.value)}
                >
                  <option value="">Select a state</option>
                  {US_STATE_OPTIONS.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              {errors.region ? <p className="submissionError">{errors.region}</p> : null}
            </section>

            <section className="submissionField">
              <label className="submissionLabel">
                <span>* Country</span>
                <input className={'submissionControl'} value={country} disabled readOnly />
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

            <section className="submissionField">
              <label className="submissionLabel">
                <span>ZIP Code (optional)</span>
                <input
                  className={'submissionControl'}
                  value={postalCode}
                  placeholder="19107"
                  onChange={(event) => setPostalCode(event.target.value)}
                />
              </label>
              {errors.postalCode ? <p className="submissionError">{errors.postalCode}</p> : null}
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
            <h2>Website</h2>
            <section className="submissionField">
              <label className="submissionLabel" htmlFor="event-website-url">
                Website URL (optional)
              </label>
              <p className="submissionHelper">Public event, organizer, or RSVP URL</p>
              <input
                id="event-website-url"
                className="submissionControl"
                type="text"
                placeholder="https://example.org/event"
                value={websiteUrl}
                onChange={(event) => setWebsiteUrl(event.target.value)}
              />
              {errors.websiteUrl ? <p className="submissionError">{errors.websiteUrl}</p> : null}
            </section>
          </section>

          <section className="submissionSection">
            <h2>Contact Information</h2>
            <section className="submissionField">
              <label className="submissionLabel" htmlFor="event-contact-email">
                Contact Email (optional)
              </label>
              <span className="submissionHelper">
                Used publicly only if the event needs a contact address
              </span>
              <input
                id="event-contact-email"
                className={'submissionControl'}
                value={contactEmail}
                placeholder="organizer@example.com"
                type={'email'}
                onChange={(event) => setContactEmail(event.target.value)}
              />
              {errors.contactEmail ? (
                <p className="submissionError">{errors.contactEmail}</p>
              ) : null}
            </section>

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

        {submitError ? <p className="submissionGlobalError">{submitError}</p> : null}
        <div className="submissionActions">
          <button className="primaryCTA" type="submit" disabled={isSubmitting}>
            Submit Event
          </button>
        </div>
      </form>
    );
  }
}
