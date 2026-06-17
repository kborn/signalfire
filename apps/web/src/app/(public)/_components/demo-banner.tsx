'use client';

import { useSyncExternalStore } from 'react';

const DISMISS_KEY = 'fyf-demo-banner-dismissed';

function subscribe(onStoreChange: () => void) {
  window.addEventListener('storage', onStoreChange);
  return () => {
    window.removeEventListener('storage', onStoreChange);
  };
}

function getSnapshot() {
  return window.sessionStorage.getItem(DISMISS_KEY) === '1';
}

function getServerSnapshot() {
  return false;
}

export default function DemoBanner() {
  const dismissed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (dismissed) {
    return null;
  }

  return (
    <section className="demoBanner" aria-label="Demo notice">
      <div className="demoBannerBody">
        <p className="demoBannerEyebrow">Demo Site</p>
        <p className="demoBannerCopy">This is a demo site with sample content.</p>
      </div>
      <div className="demoBannerActions">
        <button
          type="button"
          className="demoBannerDismiss"
          onClick={() => {
            window.sessionStorage.setItem(DISMISS_KEY, '1');
            window.dispatchEvent(new StorageEvent('storage', { key: DISMISS_KEY, newValue: '1' }));
          }}
        >
          Dismiss
        </button>
      </div>
    </section>
  );
}
