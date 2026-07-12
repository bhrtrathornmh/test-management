import { apiClient } from "@/api/client";
import type { ApiEnvelope, Question } from "@/types";

export type BulkCreateQuestionInput = Omit<Question, "id">;

export async function bulkCreateQuestions(
  questions: BulkCreateQuestionInput[],
): Promise<Question[]> {
  const res = await apiClient.post<ApiEnvelope<Question[]>>(
    "/questions/bulk",
    { questions },
  );
  return res.data.data;
}

export async function fetchQuestionsBulk(
  questionIds: string[],
): Promise<Question[]> {
  if (questionIds.length === 0) return [];
  const res = await apiClient.post<ApiEnvelope<Question[]>>(
    "/questions/fetchBulk",
    { question_ids: questionIds },
  );
  return res.data.data;
}
