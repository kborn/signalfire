import { SubmissionRateLimitService } from './submission-rate-limit.service';

function buildService(windowMs: number, maxAttempts: number) {
  const service = new SubmissionRateLimitService();

  Object.defineProperties(service, {
    windowMs: {
      value: windowMs,
    },
    maxAttempts: {
      value: maxAttempts,
    },
  });

  return service;
}

describe('SubmissionRateLimitService', () => {
  it('allows attempts within the configured window until the limit is reached', () => {
    const service = buildService(60_000, 3);

    expect(service.consume('203.0.113.10', 1_000)).toEqual({ allowed: true, retryAfterSeconds: 0 });
    expect(service.consume('203.0.113.10', 2_000)).toEqual({ allowed: true, retryAfterSeconds: 0 });
    expect(service.consume('203.0.113.10', 3_000)).toEqual({ allowed: true, retryAfterSeconds: 0 });

    expect(service.consume('203.0.113.10', 4_000)).toEqual({
      allowed: false,
      retryAfterSeconds: 57,
    });
  });

  it('resets the window after the configured duration elapses', () => {
    const service = buildService(60_000, 2);

    expect(service.consume('198.51.100.4', 1_000)).toEqual({ allowed: true, retryAfterSeconds: 0 });
    expect(service.consume('198.51.100.4', 2_000)).toEqual({ allowed: true, retryAfterSeconds: 0 });
    expect(service.consume('198.51.100.4', 3_000)).toEqual({
      allowed: false,
      retryAfterSeconds: 58,
    });

    expect(service.consume('198.51.100.4', 61_001)).toEqual({
      allowed: true,
      retryAfterSeconds: 0,
    });
  });

  it('tracks different request subjects independently', () => {
    const service = buildService(60_000, 1);

    expect(service.consume('192.0.2.1', 1_000)).toEqual({ allowed: true, retryAfterSeconds: 0 });
    expect(service.consume('192.0.2.2', 1_500)).toEqual({ allowed: true, retryAfterSeconds: 0 });
    expect(service.consume('192.0.2.1', 2_000)).toEqual({ allowed: false, retryAfterSeconds: 59 });
  });
});
