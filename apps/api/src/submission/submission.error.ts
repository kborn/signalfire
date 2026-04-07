export class UnknownSubmissionTopicsError extends Error {
  constructor(readonly slugs: string[]) {
    super(`Unknown topic slugs: ${slugs.join(', ')}`);
    this.name = 'UnknownSubmissionTopicsError';
  }
}
