export function buildTopicAssignmentCreates(
  topicIds: number[],
  assignedBy: 'admin' | 'moderation',
) {
  const assignedAt = new Date();

  return topicIds.map((topicId) => ({
    topic: { connect: { id: topicId } },
    assignedAt,
    assignedBy,
  }));
}
