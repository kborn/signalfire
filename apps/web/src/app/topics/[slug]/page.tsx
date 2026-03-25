export default async function TopicDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const message = `Topic Details ${slug}`;
  return <h1>{message}</h1>;
}
