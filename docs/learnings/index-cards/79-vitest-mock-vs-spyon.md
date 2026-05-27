# Vitest `vi.mock` vs `vi.spyOn`

Both tools replace behavior during a test, but they start at different
boundaries.

Use `vi.mock` for an imported module dependency:

```tsx
import { postSubmissionReviewReq } from '@/lib/api/admin';

vi.mock('@/lib/api/admin', () => ({
  postSubmissionReviewReq: vi.fn(),
}));

vi.mocked(postSubmissionReviewReq).mockResolvedValue({
  submissionId: 3,
  status: 'APPROVED',
  reviewedAt: '2026-05-25T09:00:00.000Z',
});
```

This keeps a component test from sending a real request and lets the test
control the API response.

Use `vi.spyOn` for one method on an existing object:

```tsx
vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
```

This replaces JSDOM's unimplemented scroll behavior while recording whether
the component called it:

```tsx
expect(window.scrollTo).toHaveBeenCalledWith({
  top: 0,
  left: 0,
  behavior: 'smooth',
});
```

Restore spies after each test:

```tsx
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
```

Rule of thumb:

- imported dependency, such as an API client function: `vi.mock(...)`
- method already attached to an object, such as `window.scrollTo` or
  `console.error`: `vi.spyOn(...)`
