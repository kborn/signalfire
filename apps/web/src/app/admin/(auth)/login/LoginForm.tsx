'use client';

import { type ComponentProps, useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api/auth';

type LoginFormProps = {
  next: string | null;
};

export default function LoginForm({ next }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  type FormSubmitHandler = NonNullable<ComponentProps<'form'>['onSubmit']>;

  const submit: FormSubmitHandler = async (event) => {
    event.preventDefault();
    await login({ email, password });
    const destination = next?.startsWith('/admin') ? next : '/admin';
    router.push(destination);
  };

  return (
    <form className="submissionForm" onSubmit={submit} noValidate>
      <section className="page-section">
        <h1 className="pageTitle">Login</h1>
        <label className="submissionLabel" htmlFor="admin-email">
          Email
        </label>
        <input
          id="admin-email"
          className="submissionControl"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <label className="submissionLabel" htmlFor="admin-password">
          Password
        </label>
        <input
          id="admin-password"
          className="submissionControl"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <div className="submissionActions">
          <button className="primaryCTA" type="submit">
            Log in
          </button>
        </div>
      </section>
    </form>
  );
}
