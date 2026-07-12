import { useMutation, useQuery } from "@tanstack/react-query";
import {
  bulkCreateQuestions,
  fetchQuestionsBulk,
  type BulkCreateQuestionInput,
} from "@/api/questions";

export function useQuestionsBulk(questionIds: string[]) {
  const key = [...questionIds].sort().join(",");
  return useQuery({
    queryKey: ["questions-bulk", key],
    queryFn: () => fetchQuestionsBulk(questionIds),
    enabled: questionIds.length > 0,
  });
}

export function useBulkCreateQuestions() {
  return useMutation({
    mutationFn: (questions: BulkCreateQuestionInput[]) =>
      bulkCreateQuestions(questions),
  });
}
