import Link from 'next/link';
import React from 'react';

type JourneyStripProps = {
  step: 1 | 2 | 3;
};

const STEPS: { num: string; label: string; href: string }[] = [
  { num: '01', label: 'Choose an issue', href: '/issues' },
  { num: '02', label: 'Read what matters', href: '/articles' },
  { num: '03', label: 'Take action', href: '/actions' },
];

export function JourneyStrip({ step }: JourneyStripProps) {
  return (
    <nav className="journeyStrip" aria-label="Your path">
      {STEPS.map((s, i) => {
        const isActive = i + 1 === step;
        const inner = (
          <>
            <span className="journeyStripNum">{s.num}</span>
            <span className="journeyStripLabel">{s.label}</span>
          </>
        );
        return (
          <React.Fragment key={s.href}>
            {i > 0 && (
              <span className="journeyStripConnector" aria-hidden="true">
                <span className="journeyStripArrow">→</span>
              </span>
            )}
            {isActive ? (
              <div className="journeyStripStep journeyStripStep--active" aria-current="step">
                {inner}
              </div>
            ) : (
              <Link href={s.href} className="journeyStripStep">
                {inner}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
