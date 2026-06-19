import Link from 'next/link';

export default function AdminNotFoundPage() {
  return (
    <div className="adminStack">
      <div>
        <p className="section-label">Not found</p>
        <h1 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>This page does not exist.</h1>
        <p style={{ marginTop: '0.5rem', color: 'var(--color-text-muted)' }}>
          The record may have been deleted, or the URL may be incorrect.
        </p>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <Link
          href="/admin"
          className="primaryCTA"
          style={{ fontSize: '0.95rem', minHeight: '42px' }}
        >
          Admin Home
        </Link>
        <Link
          href="/admin/submissions"
          className="secondaryCTA"
          style={{ fontSize: '0.95rem', minHeight: '42px' }}
        >
          Submissions
        </Link>
      </div>
    </div>
  );
}
