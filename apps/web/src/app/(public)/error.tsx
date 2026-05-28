'use client';

type PublicErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function PublicError(props: PublicErrorProps) {
  void props;

  function tryAgain() {
    window.location.reload();
  }

  function goHome() {
    window.location.assign('/');
  }

  return (
    <section className="page-section publicError" role="alert">
      <p className="section-label">Content unavailable</p>
      <h1 className="pageTitle">We could not load this page.</h1>
      <p className="page-intro">
        The content for this page is temporarily unavailable. Try again in a moment.
      </p>
      <div className="publicErrorActions">
        <button type="button" className="primaryCTA" onClick={tryAgain}>
          Try again
        </button>
        <button type="button" className="secondaryCTA" onClick={goHome}>
          Go home
        </button>
      </div>
    </section>
  );
}
