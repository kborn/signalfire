export default async function TopicDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topicName = slug; // TODO pull me from the API
  return (
    <div className="page-section">
      <section>
        <h1>{topicName} Topic</h1>
      </section>
      <section>
        <h2>Articles</h2>
        <p>Learn more about {topicName}</p>
      </section>
      <section>
        <h2>Actions</h2>
        <p>Get involved with {topicName}</p>
      </section>
    </div>
  );
}
