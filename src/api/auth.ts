import { apiClient } from "@/api/client";
import type { ApiEnvelope, User } from "@/types";

export interface LoginPayload {
  userId: string;
  password: string;
}

export interface LoginResult {
  token: string;
  user: User;
}

export async function login(payload: LoginPayload): Promise<LoginResult> {
  const res = await apiClient.post<ApiEnvelope<LoginResult>>(
    "/auth/login",
    payload,
  );
  return res.data.data;
}
