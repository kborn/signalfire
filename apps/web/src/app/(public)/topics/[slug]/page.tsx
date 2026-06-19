import { redirect } from 'next/navigation';

export default async function TopicSlugRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/issues/${slug}`);
}
