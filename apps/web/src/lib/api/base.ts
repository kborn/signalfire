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
  return makePublicBrowserRequest<T>(endpoint, queryParams);
}

export async function makeAuthenticatedRequest<T>(
  endpoint: string,
  queryParams?: QueryParams,
): Promise<T> {
  return makeAuthenticatedBrowserRequest<T>(endpoint, queryParams);
}

export async function postJson<T>(endpoint: string, payload: unknown): Promise<T> {
  return sendPublicJsonRequest<T>(endpoint, 'POST', payload);
}

export async function postAuthenticatedJson<T>(endpoint: string, payload: unknown): Promise<T> {
  return sendAuthenticatedJsonRequest<T>(endpoint, 'POST', payload);
}

export async function patchAuthenticatedJson<T>(endpoint: string, payload: unknown): Promise<T> {
  return sendAuthenticatedJsonRequest<T>(endpoint, 'PATCH', payload);
}

async function makePublicBrowserRequest<T>(
  endpoint: string,
  queryParams?: QueryParams,
): Promise<T> {
  const response = await fetch(buildUrl(endpoint, queryParams));
  return parseJsonResponse<T>(response, endpoint);
}

async function makeAuthenticatedBrowserRequest<T>(
  endpoint: string,
  queryParams?: QueryParams,
): Promise<T> {
  const response = await fetch(buildUrl(endpoint, queryParams), {
    credentials: 'include',
  });
  return parseJsonResponse<T>(response, endpoint);
}

async function parseJsonResponse<T>(response: Response, endpoint: string): Promise<T> {
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

async function sendPublicJsonRequest<T>(
  endpoint: string,
  method: 'POST' | 'PATCH',
  payload: unknown,
  errorEndpoint: string = endpoint,
): Promise<T> {
  return sendJsonRequest<T>(endpoint, method, payload, errorEndpoint, false);
}

async function sendAuthenticatedJsonRequest<T>(
  endpoint: string,
  method: 'POST' | 'PATCH',
  payload: unknown,
  errorEndpoint: string = endpoint,
): Promise<T> {
  return sendJsonRequest<T>(endpoint, method, payload, errorEndpoint, true);
}

async function sendJsonRequest<T>(
  endpoint: string,
  method: 'POST' | 'PATCH',
  payload: unknown,
  errorEndpoint: string,
  authenticated: boolean,
): Promise<T> {
  const response = await fetch(`${getApiBase()}/${endpoint}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(authenticated ? { credentials: 'include' as const } : {}),
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
