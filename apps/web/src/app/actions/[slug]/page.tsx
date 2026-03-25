export default async function ActionDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const message = `Action Details ${slug}`;
  return <h1>{message}</h1>;
}
