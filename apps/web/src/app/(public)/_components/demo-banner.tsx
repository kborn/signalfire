'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

const DISMISS_KEY = 'fyf-demo-banner-dismissed';
const DISMISS_ANIMATION_MS = 320;

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
  const dismissTimerRef = useRef<number | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    return () => {
      if (dismissTimerRef.current != null) {
        window.clearTimeout(dismissTimerRef.current);
      }
    };
  }, []);

  if (dismissed) {
    return null;
  }

  return (
    <section
      className={`demoBanner${isClosing ? ' demoBannerClosing' : ''}`}
      aria-label="Demo notice"
    >
      <div className="demoBannerBody">
        <p className="demoBannerEyebrow">Demo Site</p>
        <p className="demoBannerCopy">
          This is a demo site with sample data. Use the Admin link to explore the moderation and
          content management workflow.
        </p>
      </div>
      <div className="demoBannerActions">
        <Link href="/demo" className="demoBannerAdminLink">
          Admin →
        </Link>
        <button
          type="button"
          className="demoBannerDismiss"
          onClick={() => {
            if (isClosing) {
              return;
            }

            setIsClosing(true);
            dismissTimerRef.current = window.setTimeout(() => {
              window.sessionStorage.setItem(DISMISS_KEY, '1');
              window.dispatchEvent(
                new StorageEvent('storage', { key: DISMISS_KEY, newValue: '1' }),
              );
            }, DISMISS_ANIMATION_MS);
          }}
        >
          Dismiss
        </button>
      </div>
    </section>
  );
}
