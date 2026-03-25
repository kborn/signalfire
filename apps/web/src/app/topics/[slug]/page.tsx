export default async function TopicDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topicName = slug; // TODO pull me from the API
  return (
    <div>
      <section>
        <h1>{topicName} Topic</h1>
      </section>
      <section>
        <h1>Articles</h1>
        <p>Learn more about {topicName}</p>
      </section>
      <section>
        <h1>Events</h1>
        <p>Get involved with {topicName}</p>
      </section>
    </div>
  );
}
