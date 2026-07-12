import { useQuery } from "@tanstack/react-query";
import { fetchSubTopicsByTopics, fetchTopicsBySubject } from "@/api/topics";

export function useTopicsBySubject(subjectId: string | null) {
  return useQuery({
    queryKey: ["topics", subjectId],
    queryFn: () => fetchTopicsBySubject(subjectId as string),
    enabled: !!subjectId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSubTopicsByTopics(topicIds: string[]) {
  const key = [...topicIds].sort().join(",");
  return useQuery({
    queryKey: ["sub-topics", key],
    queryFn: () => fetchSubTopicsByTopics(topicIds),
    enabled: topicIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}
