import type { SVGProps } from 'react';

// ─── Wordmark / brand mark ────────────────────────────────────────────────────

export function FYFLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 22 22" focusable="false" aria-hidden="true" {...props}>
      <path
        d="M11 2C8 7 5 11 5 15a6 6 0 0 1 12 0C17 11 14 7 11 2z"
        fill="var(--color-brand-primary)"
      />
    </svg>
  );
}

export function FlameIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 24" focusable="false" aria-hidden="true" {...props}>
      <path
        d="M10 2 C10 2 14 7 14 11 C14 13.2 12.8 15 11.5 16 C12 14 11 12.5 9.5 12 C9.5 12 10.5 14 9 15.5 C7.5 17 6 15.5 6 13.5 C6 11.5 8 9 10 2 Z"
        fill="currentColor"
        stroke="none"
      />
      <path
        d="M10 22 C7 22 5 20 5 17.5 C5 16 5.8 15 7 14 C7 15.5 8 16.5 9.5 16.5 C11 16.5 12 15.5 12 14 C13.2 15 14 16.5 14 18 C14 20.5 12 22 10 22 Z"
        fill="currentColor"
        opacity="0.6"
        stroke="none"
      />
    </svg>
  );
}

// ─── Topic icons ─────────────────────────────────────────────────────────────

export function DemocracyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" {...props}>
      {/* Ballot box with slot */}
      <rect
        x="3"
        y="8"
        width="18"
        height="13"
        rx="1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9 8V6a3 3 0 0 1 6 0v2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M10 13h4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function ClimateIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" {...props}>
      {/* Sun over wave */}
      <circle cx="12" cy="8" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2.5V4M12 12v1.5M17.5 3.5l-1 1M6.5 3.5l1 1M20 8h-1.5M4 8H5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M3 17 C5 14.5 7 14.5 9 17 C11 19.5 13 19.5 15 17 C17 14.5 19 14.5 21 17"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CivilRightsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" {...props}>
      {/* Open raised palm */}
      <path
        d="M8 12V6a1.5 1.5 0 0 1 3 0v5M11 11V5a1.5 1.5 0 0 1 3 0v6M14 11V7a1.5 1.5 0 0 1 3 0v5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M8 12V10a1.5 1.5 0 0 0-3 0v4c0 4 2.5 7 7 7s7-3 7-7v-1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ConsumerActivismIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" {...props}>
      {/* Shopping cart with X */}
      <path
        d="M3 3h2l.4 2M7 13h10l2-7H5.4M7 13L5.4 5M7 13l-2 5h14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M15 7L9 13M9 7l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function EconomicJusticeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" {...props}>
      {/* Balance scale, right side heavy */}
      <path d="M12 3v18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M5 21h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M12 5l-7 2 7 5-7-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 5l7 4-7 3 7-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Heavy right pan */}
      <path d="M17 9v3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M7 7v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function EducationIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" {...props}>
      {/* Open book */}
      <path
        d="M12 7C10 5 7 5 4 6v13c3-1 6-1 8 1 2-2 5-2 8-1V6c-3-1-6-1-8 1Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M12 7v13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function LocalCommunityIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" {...props}>
      {/* 4 houses in a grid (neighbourhood overhead) */}
      <path
        d="M3 10l3-3 3 3v6H3z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M15 10l3-3 3 3v6h-6z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M3 20l3-3 3 3v3H3z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M15 20l3-3 3 3v3h-6z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GenericIssueIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 8v4M12 15.5v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" {...props}>
      <line
        x1="3"
        y1="6"
        x2="21"
        y2="6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="3"
        y1="12"
        x2="21"
        y2="12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="3"
        y1="18"
        x2="21"
        y2="18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" {...props}>
      <line
        x1="4"
        y1="4"
        x2="20"
        y2="20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="20"
        y1="4"
        x2="4"
        y2="20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" {...props}>
      <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M16.5 16.5L21 21"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function CalendarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" {...props}>
      <path
        d="M7 2v3M17 2v3M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}
