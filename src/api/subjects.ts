import { apiClient } from "@/api/client";
import type { ApiEnvelope, Subject } from "@/types";

export async function fetchSubjects(): Promise<Subject[]> {
  const res = await apiClient.get<ApiEnvelope<Subject[]>>("/subjects");
  return res.data.data;
}
