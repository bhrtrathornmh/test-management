import { useQuery } from "@tanstack/react-query";
import { fetchSubjects } from "@/api/subjects";

export function useSubjects() {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: fetchSubjects,
    staleTime: 5 * 60 * 1000,
  });
}
