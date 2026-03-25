export default async function ArticleDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const message = `Article Details ${slug}`;
  return <h1>{message}</h1>;
}
