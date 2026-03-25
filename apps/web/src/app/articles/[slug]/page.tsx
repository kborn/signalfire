export default async function ArticleDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const articleName = slug; // TODO pull me from the API
  // const articleContent = slug; // TODO pull me from the API
  return (
    <div className="page-section">
      <section>
        <h1>{articleName} Article</h1>
        <p>Article content goes here</p>
      </section>
      <section>
        <h2>Topics</h2>
        <p>Explore topics relating to {articleName}</p>
      </section>
      <section>
        <h2>Actions</h2>
        <p>Get involved with {articleName}</p>
      </section>
    </div>
  );
}
