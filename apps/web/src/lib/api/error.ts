import type { ValidationError } from '@signal-fire/api-contracts';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public endpoint: string,
  ) {
    super(message);
  }
}

export class SubmissionError extends ApiError {
  constructor(
    message: string,
    public status: number,
    public endpoint: string,
    public errors: ValidationError[] | null,
  ) {
    super(message, status, endpoint);
  }
}
