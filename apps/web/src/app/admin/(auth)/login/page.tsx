import LoginForm from './LoginForm';

export const dynamic = 'force-dynamic';

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;

  return <LoginForm next={next ?? null} />;
}
