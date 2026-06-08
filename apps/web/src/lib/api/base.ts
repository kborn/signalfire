import { buildUrl, getApiBase, type QueryParams } from '@/lib/api/base.shared';
import { ApiError, SubmissionError } from '@/lib/api/error';
import { type ValidationError } from '@signal-fire/api-contracts';

async function readJsonBody(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function makeRequest<T>(endpoint: string, queryParams?: QueryParams): Promise<T> {
  return makeBrowserRequest<T>(endpoint, queryParams);
}

export async function makeAuthenticatedRequest<T>(
  endpoint: string,
  queryParams?: QueryParams,
): Promise<T> {
  return makeBrowserRequest<T>(endpoint, queryParams, true);
}

export async function postJson<T>(endpoint: string, payload: unknown): Promise<T> {
  return sendJsonRequest<T>(endpoint, 'POST', payload);
}

async function makeBrowserRequest<T>(
  endpoint: string,
  queryParams?: QueryParams,
  includeCredentials: boolean = false,
): Promise<T> {
  const url = buildUrl(endpoint, queryParams);
  const response = await fetch(url, includeCredentials ? { credentials: 'include' } : undefined);
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

async function sendJsonRequest<T>(
  endpoint: string,
  method: 'POST' | 'PATCH',
  payload: unknown,
  errorEndpoint: string = endpoint,
  includeCredentials: boolean = false,
): Promise<T> {
  const url = `${getApiBase()}/${endpoint}`;
  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(includeCredentials ? { credentials: 'include' as const } : {}),
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

export async function postAuthenticatedJson<T>(endpoint: string, payload: unknown): Promise<T> {
  return sendJsonRequest<T>(endpoint, 'POST', payload, endpoint, true);
}

export async function patchAuthenticatedJson<T>(endpoint: string, payload: unknown): Promise<T> {
  return sendJsonRequest<T>(endpoint, 'PATCH', payload, endpoint, true);
}
