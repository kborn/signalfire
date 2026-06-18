import { Injectable } from '@nestjs/common';

const DEFAULT_WINDOW_MS = 15 * 60 * 1000;
const DEFAULT_MAX_ATTEMPTS = 5;

type RateLimitRecord = {
  count: number;
  windowStartMs: number;
};

export type SubmissionRateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

@Injectable()
export class SubmissionRateLimitService {
  private readonly attempts = new Map<string, RateLimitRecord>();

  constructor(
    private readonly windowMs: number = DEFAULT_WINDOW_MS,
    private readonly maxAttempts: number = DEFAULT_MAX_ATTEMPTS,
  ) {}

  consume(subject: string, nowMs: number = Date.now()): SubmissionRateLimitResult {
    this.pruneExpired(nowMs);

    const existing = this.attempts.get(subject);
    if (!existing || nowMs - existing.windowStartMs >= this.windowMs) {
      this.attempts.set(subject, { count: 1, windowStartMs: nowMs });
      return { allowed: true, retryAfterSeconds: 0 };
    }

    if (existing.count >= this.maxAttempts) {
      const retryAfterMs = Math.max(existing.windowStartMs + this.windowMs - nowMs, 0);

      return {
        allowed: false,
        retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
      };
    }

    existing.count += 1;
    return { allowed: true, retryAfterSeconds: 0 };
  }

  private pruneExpired(nowMs: number) {
    for (const [subject, record] of this.attempts.entries()) {
      if (nowMs - record.windowStartMs >= this.windowMs) {
        this.attempts.delete(subject);
      }
    }
  }
}
