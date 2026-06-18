import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { postJson } from './base';

describe('api base helpers', () => {
  const originalApiBase = process.env.NEXT_PUBLIC_API_BASE_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:3001';
    vi.restoreAllMocks();
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_API_BASE_URL = originalApiBase;
  });

  it('uses the shared URL builder for JSON requests', async () => {
    const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    await expect(postJson('submissions', { hello: 'world' })).resolves.toEqual({ ok: true });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3001/submissions',
      expect.objectContaining({
        method: 'POST',
      }),
    );
  });

  it('tolerates empty success response bodies', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(null, {
        status: 200,
      }),
    );

    await expect(postJson('admin/auth/logout', {})).resolves.toBeNull();
  });
});
