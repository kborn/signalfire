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
        Something blocked us from loading this page. Try again and it should come back.
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
