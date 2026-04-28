const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const SUBMISSION_FIELD_LIMITS = {
  title: 200,
  summary: 300,
  content: 50000,
  description: 50000,
  locationName: 200,
  locationAddressStreet: 300,
  locationAddressCity: 120,
  locationAddressRegion: 120,
  locationAddressCountry: 120,
  locationAddressZip: 32,
  author: 120,
  submitterName: 120,
  submitterEmail: 320,
  contactEmail: 320,
  resourceLink: 2000,
} as const;

export function validateRequiredString(
  value: string,
  fieldLabel: string,
  max: number,
): string | undefined {
  if (!value) {
    return `${fieldLabel} is required`;
  }

  if (value.length > max) {
    return `${fieldLabel} must be ${max} characters or fewer`;
  }

  return undefined;
}

export function validateOptionalStringMax(value: string | null, max: number): string | undefined {
  if (value === null) {
    return undefined;
  }

  if (value.length > max) {
    return `Must be ${max} characters or fewer`;
  }

  return undefined;
}

export function validateOptionalEmail(value: string | null, max: number): string | undefined {
  if (value === null) {
    return undefined;
  }

  if (!EMAIL_REGEX.test(value)) {
    return 'Email must be valid';
  }

  if (value.length > max) {
    return `Email must be ${max} characters or fewer`;
  }

  return undefined;
}

export function validateResourceLinks(links: string[]): string | undefined {
  for (const link of links) {
    const lengthError = validateRequiredString(
      link,
      'Resource link',
      SUBMISSION_FIELD_LIMITS.resourceLink,
    );

    if (lengthError) {
      return lengthError;
    }
  }

  return undefined;
}

export function mapSubmissionApiFieldToUiField(field: string): string | null {
  if (field.startsWith('payload.resourceLinks[')) {
    return 'resourceLinks';
  }

  if (field.startsWith('payload.topicSlugs[')) {
    return 'topicSlugs';
  }

  return null;
}
