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
      <div className="demoBannerHead">
        <p className="demoBannerEyebrow">Demo Site</p>
        <button
          type="button"
          className="demoBannerDismiss"
          aria-label="Dismiss"
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
          ×
        </button>
      </div>
      <p className="demoBannerCopy">
        Note: the events, actions, and articles here were randomly generated to demonstrate this
        site&apos;s capabilities — none of them are real. A future version will feature properly
        curated content.{' '}
        <Link href="/story" className="inlineLink">
          Read the full story.
        </Link>
      </p>
    </section>
  );
}
