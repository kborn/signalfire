'use client';

import { type ComponentProps, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/error';
import { isDemoModeEnabled } from '@/lib/demo-mode';

const README_DEMO_ACCESS_URL = 'https://github.com/kborn/signalfire#demo-review-and-admin-access';

type LoginFormProps = {
  next: string | null;
};

function getRequestedDestinationLabel(next: string | null): string | null {
  if (!next?.startsWith('/admin')) {
    return null;
  }

  if (next === '/admin') {
    return 'admin home';
  }

  if (next.startsWith('/admin/submissions')) {
    return 'moderation queue';
  }

  if (next.startsWith('/admin/articles')) {
    return 'article workspace';
  }

  if (next.startsWith('/admin/actions')) {
    return 'action workspace';
  }

  if (next.startsWith('/admin/events')) {
    return 'event workspace';
  }

  return 'requested admin page';
}

export default function LoginForm({ next }: LoginFormProps) {
  const router = useRouter();
  const isDemoMode = isDemoModeEnabled();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const destinationLabel = useMemo(() => getRequestedDestinationLabel(next), [next]);
  const isSessionReturn = next?.startsWith('/admin') ?? false;

  type FormSubmitHandler = NonNullable<ComponentProps<'form'>['onSubmit']>;

  const submit: FormSubmitHandler = async (event) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email, password });
      const destination = next?.startsWith('/admin') ? next : '/admin';
      router.push(destination);
    } catch (submitError) {
      if (submitError instanceof ApiError && submitError.status === 401) {
        setError('Invalid admin credentials. Check your email and password and try again.');
      } else if (submitError instanceof Error) {
        setError(submitError.message);
      } else {
        setError('Login failed due to an unexpected error.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="adminLoginPage page-section">
      <div className="adminLoginShell">
        <div className="adminLoginFormPanel">
          {isSessionReturn ? (
            <div className="adminLoginStatusPill" role="status">
              Sign in to continue to {destinationLabel ?? 'the admin workspace'}.
            </div>
          ) : null}

          <div className="adminLoginIntro">
            <p className="adminLoginEyebrow">Find Your Fight — Admin</p>
            <h1 className="adminLoginFormTitle">Sign in</h1>
            <p className="adminLoginFormDek">
              {isSessionReturn
                ? 'You will be returned to where you left off after successful login.'
                : 'Use an admin account to enter the moderation and publishing workspace.'}
            </p>
            {!isSessionReturn && isDemoMode ? (
              <p className="adminLoginFormDek">
                Demo credentials and local setup live in the repository&apos;s{' '}
                <Link href={README_DEMO_ACCESS_URL} className="textCTA">
                  demo review and admin access section
                </Link>
                .
              </p>
            ) : null}
          </div>

          <form className="submissionForm adminLoginForm" onSubmit={submit} noValidate>
            {error ? (
              <div className="adminReviewBanner adminReviewBannerError" role="alert">
                <p className="adminReviewBannerTitle">Unable to sign in</p>
                <p className="adminReviewBannerText">{error}</p>
              </div>
            ) : null}

            <section className="submissionField">
              <label className="submissionLabel" htmlFor="admin-email">
                Email
              </label>
              <input
                id="admin-email"
                className="submissionControl adminLoginControl"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={isSubmitting}
                required
              />
            </section>

            <section className="submissionField">
              <label className="submissionLabel" htmlFor="admin-password">
                Password
              </label>
              <input
                id="admin-password"
                className="submissionControl adminLoginControl"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={isSubmitting}
                required
              />
            </section>

            <div className="submissionActions adminLoginActions">
              <button className="primaryCTA adminLoginButton" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in…' : 'Log in'}
              </button>
            </div>
          </form>
        </div>

        <aside className="adminLoginBrandPanel" aria-label="Find Your Fight admin overview">
          <div className="adminLoginBrandCopy">
            <h2 className="pageTitle adminLoginTitle">Moderate. Curate. Publish.</h2>
            <p className="adminDek adminLoginDek">
              The internal workspace for community submissions, curated actions, published articles,
              and event operations.
            </p>
          </div>

          <div className="adminLoginFeatureList" aria-label="Admin workspace areas">
            <div className="adminLoginFeatureItem">
              <span className="adminLoginFeatureKicker">Moderation</span>
              <p>Review pending submissions and move the right civic updates forward.</p>
            </div>
            <div className="adminLoginFeatureItem">
              <span className="adminLoginFeatureKicker">Curation</span>
              <p>Maintain the public-facing toolkit of actions, articles, and events.</p>
            </div>
            <div className="adminLoginFeatureItem">
              <span className="adminLoginFeatureKicker">Publishing</span>
              <p>Keep approved civic information structured, current, and ready to use.</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
