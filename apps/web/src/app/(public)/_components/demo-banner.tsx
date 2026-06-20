'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

const DISMISS_KEY = 'fyf-demo-banner-dismissed';
const BANNER_HEIGHT_CSS_VAR = '--demo-banner-height';
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
  const bannerRef = useRef<HTMLElement | null>(null);
  const dismissTimerRef = useRef<number | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (dismissed) {
      document.documentElement.style.setProperty(BANNER_HEIGHT_CSS_VAR, '0px');
      return;
    }

    const banner = bannerRef.current;
    if (!banner) {
      return;
    }

    const updateBannerHeight = () => {
      document.documentElement.style.setProperty(BANNER_HEIGHT_CSS_VAR, `${banner.offsetHeight}px`);
    };

    updateBannerHeight();

    const resizeObserver =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(() => {
            updateBannerHeight();
          });

    resizeObserver?.observe(banner);
    window.addEventListener('resize', updateBannerHeight);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', updateBannerHeight);
      document.documentElement.style.setProperty(BANNER_HEIGHT_CSS_VAR, '0px');
    };
  }, [dismissed]);

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
      ref={bannerRef}
      className={`demoBanner${isClosing ? ' demoBannerClosing' : ''}`}
      aria-label="Demo notice"
    >
      <div className="demoBannerBody">
        <p className="demoBannerEyebrow">Demo Site</p>
        <p className="demoBannerCopy">This is a demo site with sample content.</p>
      </div>
      <div className="demoBannerActions">
        <Link href="/demo" className="demoBannerAdminLink">
          Admin
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
