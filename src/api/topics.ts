import { apiClient } from "@/api/client";
import type { ApiEnvelope, SubTopic, Topic } from "@/types";

export async function fetchTopicsBySubject(subjectId: string): Promise<Topic[]> {
  const res = await apiClient.get<ApiEnvelope<Topic[]>>(
    `/topics/subject/${subjectId}`,
  );
  return res.data.data;
}

export async function fetchSubTopicsByTopics(
  topicIds: string[],
): Promise<SubTopic[]> {
  if (topicIds.length === 0) return [];
  const res = await apiClient.post<ApiEnvelope<SubTopic[]>>(
    "/sub-topics/multi-topics",
    { topicIds },
  );
  return res.data.data;
}
