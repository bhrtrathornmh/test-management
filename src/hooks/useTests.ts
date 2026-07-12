import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTest,
  deleteTest,
  fetchTestById,
  fetchTests,
  updateTest,
  type CreateTestPayload,
  type UpdateTestPayload,
} from "@/api/tests";

export function useTests() {
  return useQuery({
    queryKey: ["tests"],
    queryFn: fetchTests,
  });
}

export function useTest(id: string | undefined) {
  return useQuery({
    queryKey: ["test", id],
    queryFn: () => fetchTestById(id as string),
    enabled: !!id,
  });
}

export function useCreateTest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTestPayload) => createTest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tests"] });
    },
  });
}

export function useUpdateTest(id: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateTestPayload) =>
      updateTest(id as string, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tests"] });
      queryClient.invalidateQueries({ queryKey: ["test", id] });
    },
  });
}

export function useDeleteTest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tests"] });
    },
  });
}
