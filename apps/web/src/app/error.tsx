'use client';

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <section className="page-section">
      <h1>Something went wrong</h1>
      <p>{error.message || 'An unexpected error occurred while loading this page.'}</p>
      <button type="button" onClick={reset}>
        Try again
      </button>
    </section>
  );
}
