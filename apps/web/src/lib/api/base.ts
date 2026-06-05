import { ApiError, SubmissionError } from '@/lib/api/error';
import {
  ModerationReviewRequest,
  SubmissionRequest,
  type ValidationError,
} from '@signal-fire/api-contracts';

function getApiBase() {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBase) {
    throw new Error('No API base URL configured!');
  }
  return apiBase;
}

type QueryParams = Record<string, string | undefined>;

async function readJsonBody(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

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

function isValidationError(item: unknown): item is ValidationError {
  if (!item || typeof item !== 'object' || !('type' in item) || !('message' in item)) {
    return false;
  }

  if (typeof item.message !== 'string') {
    return false;
  }

  if (item.type === 'form') {
    return !('field' in item);
  }

  return item.type === 'field' && 'field' in item && typeof item.field === 'string';
}

function hasValidationErrors(body: unknown): body is { errors: ValidationError[] } {
  if (!body || typeof body !== 'object' || !('errors' in body)) {
    return false;
  }

  const errors = (body as { errors: unknown }).errors;

  return Array.isArray(errors) && errors.every((item) => isValidationError(item));
}

function getValidationErrors(body: unknown): ValidationError[] | null {
  return hasValidationErrors(body) ? body.errors : null;
}

export async function postSubmission<T>(req: SubmissionRequest): Promise<T> {
  return sendJsonRequest<T>('submissions', 'POST', req, 'submissions');
}

export async function postSubmissionReview<ModerationReviewSuccess>(
  req: ModerationReviewRequest,
  id: number,
): Promise<ModerationReviewSuccess> {
  return sendJsonRequest<ModerationReviewSuccess>(
    `admin/submissions/${id}/review`,
    'POST',
    req,
    'submissions',
  );
}

async function sendJsonRequest<T>(
  endpoint: string,
  method: 'POST' | 'PATCH',
  payload: unknown,
  errorEndpoint: string = endpoint,
): Promise<T> {
  const url = `${getApiBase()}/${endpoint}`;

  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const body = await readJsonBody(response);

  if (!response.ok) {
    const validationErrors = getValidationErrors(body);
    if (validationErrors) {
      throw new SubmissionError(
        `Request failed for ${errorEndpoint}`,
        response.status,
        errorEndpoint,
        validationErrors,
      );
    }

    throw new ApiError(`Request failed for ${errorEndpoint}`, response.status, errorEndpoint);
  }

  return body as T;
}

export async function postJson<T>(endpoint: string, payload: unknown): Promise<T> {
  return sendJsonRequest<T>(endpoint, 'POST', payload);
}

export async function patchJson<T>(endpoint: string, payload: unknown): Promise<T> {
  return sendJsonRequest<T>(endpoint, 'PATCH', payload);
}
