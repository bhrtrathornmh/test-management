import { apiClient } from "@/api/client";
import type { ApiEnvelope, Difficulty, Test, TestStatus, TestType } from "@/types";

export interface CreateTestPayload {
  name: string;
  type: TestType;
  subject: string;
  topics: string[];
  sub_topics: string[];
  correct_marks: number;
  wrong_marks: number;
  unattempt_marks: number;
  difficulty: Difficulty;
  total_time: number;
  total_marks: number;
  total_questions: number;
}

export interface UpdateTestPayload {
  name?: string;
  type?: TestType;
  subject?: string;
  topics?: string[];
  sub_topics?: string[];
  correct_marks?: number;
  wrong_marks?: number;
  unattempt_marks?: number;
  difficulty?: Difficulty;
  total_time?: number;
  total_marks?: number;
  total_questions?: number;
  questions?: string[];
  status?: TestStatus;
  scheduled_date?: string | null;
  expiry_date?: string | null;
}

export async function fetchTests(): Promise<Test[]> {
  const res = await apiClient.get<ApiEnvelope<Test[]>>("/tests");
  return res.data.data;
}

export async function fetchTestById(id: string): Promise<Test> {
  const res = await apiClient.get<ApiEnvelope<Test>>(`/tests/${id}`);
  return res.data.data;
}

export async function createTest(payload: CreateTestPayload): Promise<Test> {
  const res = await apiClient.post<ApiEnvelope<Test>>("/tests", payload);
  return res.data.data;
}

export async function updateTest(
  id: string,
  payload: UpdateTestPayload,
): Promise<Test> {
  const res = await apiClient.put<ApiEnvelope<Test>>(`/tests/${id}`, payload);
  return res.data.data;
}

export async function deleteTest(id: string): Promise<void> {
  await apiClient.delete(`/tests/${id}`);
}
