import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

vi.mock('next/server', async () => {
  const actual = await vi.importActual<typeof import('next/server')>('next/server');

  return {
    ...actual,
    connection: vi.fn().mockResolvedValue(undefined),
  };
});
