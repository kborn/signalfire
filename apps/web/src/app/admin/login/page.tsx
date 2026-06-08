'use client';

import { type ComponentProps, useState } from 'react';
import { login } from '@/lib/api/auth';
export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  type FormSubmitHandler = NonNullable<ComponentProps<'form'>['onSubmit']>;

  const submit: FormSubmitHandler = async (event) => {
    event.preventDefault();
    console.log('calling login');
    await login({ email: email, password: password });
  };
  return (
    <form className={'submissionForm'} onSubmit={submit} noValidate>
      <section className="page-section">
        <h1 className="pageTitle">Login</h1>
        <label className="submissionLabel" htmlFor="event-email">
          Email
        </label>
        <input
          id="event-email"
          className="submissionControl"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <label className="submissionLabel" htmlFor="event-password">
          Password
        </label>
        <input
          id="event-password"
          className="submissionControl"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <div className="submissionActions">
          <button className="primaryCTA" type="submit">
            Submit Event
          </button>
        </div>
      </section>
    </form>
  );
}
