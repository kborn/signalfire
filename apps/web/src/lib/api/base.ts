import { ApiError, SubmissionError } from '@/lib/api/error';
import {
  ModerationReviewRequest,
  ModerationReviewResponse,
  SubmissionRequest,
} from '@signal-fire/api-contracts';

function getApiBase() {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBase) {
    throw new Error('No API base URL configured!');
  }
  return apiBase;
}

type QueryParams = Record<string, string | undefined>;

export async function makeRequest<T>(endpoint: string, queryParams?: QueryParams): Promise<T> {
  const params = new URLSearchParams();

  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined) {
        params.set(key, value);
      }
    });
  }

  const query = params.toString();
  const url = query ? `${getApiBase()}/${endpoint}?${query}` : `${getApiBase()}/${endpoint}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new ApiError(`Request failed for ${endpoint}`, response.status, endpoint);
  }
  return response.json() as Promise<T>;
}

function hasValidationErrors(
  body: unknown,
): body is { errors: { field: string; message: string }[] } {
  if (!body || typeof body !== 'object' || !('errors' in body)) {
    return false;
  }

  const errors = (body as { errors: unknown }).errors;

  return (
    Array.isArray(errors) &&
    errors.every(
      (item) =>
        item &&
        typeof item === 'object' &&
        'field' in item &&
        'message' in item &&
        typeof item.field === 'string' &&
        typeof item.message === 'string',
    )
  );
}

export async function postSubmission<T>(req: SubmissionRequest): Promise<T> {
  const url = `${getApiBase()}/submissions`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });

  let body: unknown;

  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    if (hasValidationErrors(body)) {
      throw new SubmissionError(
        `Request failed for submissions`,
        response.status,
        'submissions',
        (body as { errors: { field: string; message: string }[] }).errors,
      );
    } else {
      throw new ApiError(`Request failed for submissions`, response.status, 'submissions');
    }
  }
  return body as T;
}

export async function postSubmissionReview<ModerationReviewResponse>(
  req: ModerationReviewRequest,
  id,
): Promise<ModerationReviewResponse> {
  const url = `${getApiBase()}/admin/submissions/${id}/review`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });

  let body: unknown;

  try {
    body = await response.json();
    console.log(body);
  } catch {
    console.log('failed');
    body = null;
  }

  console.log(response.status);

  if (!response.ok) {
    if (hasValidationErrors(body)) {
      throw new SubmissionError(
        `Request failed for submissions`,
        response.status,
        'submissions',
        (body as { errors: { field: string; message: string }[] }).errors,
      );
    } else {
      throw new ApiError(`Request failed for submissions`, response.status, 'submissions');
    }
  }
  return body as ModerationReviewResponse;
}
