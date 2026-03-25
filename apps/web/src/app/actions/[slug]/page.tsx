export default async function ActionDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const actionName = slug; // TODO pull me from the API
  return (
    <div className="page-section">
      <section>
        <h1>{actionName} Action</h1>
        <p>Understand this action and how you can take part</p>
      </section>
      <section>
        <h2>Topics</h2>
        <p>Explore topics relating to {actionName}</p>
      </section>
      <section>
        <h2>Articles</h2>
        <p>Learn more about {actionName}</p>
      </section>
    </div>
  );
}
